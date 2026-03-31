const express = require("express");
const { connectDB } = require("../../lib/db");
const { ProductModel, WarehouseModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

router.post("/", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const vendorId = req.user.id;
    const vendorProfile = req.vendor;

    const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
    const newId =
      lastProduct && typeof lastProduct.id === "number"
        ? lastProduct.id + 1
        : 1;
    const newProduct = await ProductModel.create({
      ...req.body,
      id: newId,
      vendorId: vendorId,
      vendorStoreName:
        vendorProfile.vendorProfile?.storeName || vendorProfile.name,
      vendorStoreSlug:
        vendorProfile.vendorProfile?.storeSlug ||
        vendorProfile.name.toLowerCase().replace(/\s+/g, "-"),
      warehouseInventory: [],
      stockQuantity: 0,
      lowStockThreshold: 5,
      sku: "",
    });

    await logActivity(req, {
      action: "add",
      entity: "product",
      entityId: newId.toString(),
      details: `Added product "${req.body.title || "Untitled"}" (ID: ${newId})`,
    });

    return res.json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add product error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.get("/:id", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const product = await ProductModel.findOne({
      id: Number(req.params.id),
      vendorId: req.user.id,
    }).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id", requireVendor, async (req, res) => {
  try {
    await connectDB();

    const oldProduct = await ProductModel.findOne({
      id: Number(req.params.id),
      vendorId: req.user.id,
    }).lean();
    if (!oldProduct)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    const { vendorId, ...safeUpdateData } = req.body;
    const warehouseInventory = safeUpdateData.warehouseInventory;

    
    if (Array.isArray(warehouseInventory)) {
      for (const wInv of warehouseInventory) {
        if (!wInv.warehouseName) continue;

        const warehouse = await WarehouseModel.findOne({ 
          name: wInv.warehouseName, 
          vendorId: req.user.id 
        });

        if (warehouse && warehouse.capacity > 0) {
          const usageAgg = await ProductModel.aggregate([
            { $match: { vendorId: req.user.id, id: { $ne: Number(req.params.id) } } },
            { $unwind: "$warehouseInventory" },
            { $match: { "warehouseInventory.warehouseName": wInv.warehouseName } },
            { $group: { _id: null, totalUsage: { $sum: "$warehouseInventory.quantity" } } }
          ]);

          const otherProductsUsage = usageAgg[0]?.totalUsage || 0;
          const newUsageForThisProduct = Number(wInv.quantity) || 0;
          const totalProjected = otherProductsUsage + newUsageForThisProduct;

          if (totalProjected > warehouse.capacity) {
            return res.status(400).json({ 
              message: `Warehouse "${wInv.warehouseName}" capacity exceeded! Projected usage: ${totalProjected}/${warehouse.capacity}.` 
            });
          }
        }
      }
    }

    const updated = await ProductModel.findOneAndUpdate(
      { id: Number(req.params.id), vendorId: req.user.id },
      safeUpdateData,
      { returnDocument: "after" },
    ).lean();
    if (!updated) return res.status(404).json({ message: "Product not found" });

    const trackFields = [
      "title",
      "description",
      "price",
      "oldPrice",
      "image",
      "badges",
      "printText",
      "category",
      "sku",
      "stockQuantity",
      "lowStockThreshold",
      "warehouseInventory",
    ];

    const changes = [];
    for (const field of trackFields) {
      const oldVal = oldProduct[field];
      const newVal = req.body[field];

      if (newVal !== undefined) {
        let hasChanged = false;
        if (Array.isArray(oldVal) || Array.isArray(newVal)) {
          hasChanged =
            JSON.stringify(oldVal || []) !== JSON.stringify(newVal || []);
        } else {
          hasChanged = String(oldVal ?? "") !== String(newVal ?? "");
        }

        if (hasChanged) {
          const oldStr = Array.isArray(oldVal)
            ? `[${oldVal.join(", ")}]`
            : (oldVal ?? "(empty)");
          const newStr = Array.isArray(newVal)
            ? `[${newVal.join(", ")}]`
            : (newVal ?? "(empty)");
          const label = field.charAt(0).toUpperCase() + field.slice(1);
          changes.push(`${label}: "${oldStr}" → "${newStr}"`);
        }
      }
    }

    const detailStr =
      changes.length > 0
        ? `Updated product "${updated.title}" (ID: ${req.params.id}) — ${changes.join(", ")}`
        : `Updated product "${updated.title}" (ID: ${req.params.id}) (no field changes)`;

    await logActivity(req, {
      action: "update",
      entity: "product",
      entityId: req.params.id,
      details: detailStr,
    });

    return res.json({ message: "Product updated", product: updated });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id/inventory", requireVendor, async (req, res) => {
  try {
    const { sku, lowStockThreshold, warehouseInventory } = req.body;
    await connectDB();

    const oldProduct = await ProductModel.findOne({
      id: Number(req.params.id),
      vendorId: req.user.id,
    }).lean();
    if (!oldProduct)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    const totalStock = (warehouseInventory || []).reduce(
      (acc, curr) => acc + (curr.quantity || 0),
      0,
    );

    
    if (Array.isArray(warehouseInventory)) {
      for (const wInv of warehouseInventory) {
        if (!wInv.warehouseName) continue;

        const warehouse = await WarehouseModel.findOne({ 
          name: wInv.warehouseName, 
          vendorId: req.user.id 
        });

        if (warehouse && warehouse.capacity > 0) {
          
          const usageAgg = await ProductModel.aggregate([
            { $match: { vendorId: req.user.id, id: { $ne: Number(req.params.id) } } },
            { $unwind: "$warehouseInventory" },
            { $match: { "warehouseInventory.warehouseName": wInv.warehouseName } },
            { $group: { _id: null, totalUsage: { $sum: "$warehouseInventory.quantity" } } }
          ]);

          const otherProductsUsage = usageAgg[0]?.totalUsage || 0;
          const newUsageForThisProduct = Number(wInv.quantity) || 0;
          const totalProjected = otherProductsUsage + newUsageForThisProduct;

          if (totalProjected > warehouse.capacity) {
            return res.status(400).json({ 
              message: `Warehouse "${wInv.warehouseName}" capacity exceeded! Projected usage: ${totalProjected}/${warehouse.capacity}.` 
            });
          }
        }
      }
    }

    const updated = await ProductModel.findOneAndUpdate(
      { id: Number(req.params.id), vendorId: req.user.id },
      {
        sku,
        lowStockThreshold,
        warehouseInventory,
        stockQuantity: totalStock,
      },
      { returnDocument: "after" },
    ).lean();

    if (!updated) return res.status(404).json({ message: "Product not found" });

    if (warehouseInventory && warehouseInventory.length > 0) {
      for (const w of warehouseInventory) {
        if (!w.warehouseName || !w.location) continue;

        const existingWarehouse = await WarehouseModel.findOne({
          name: w.warehouseName,
        });
        if (!existingWarehouse) {
          const whId = `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          await WarehouseModel.create({
            id: whId,
            name: w.warehouseName,
            location: w.location,
          });

          if (req.user && req.user.id) {
            await logActivity(req, {
              action: "add",
              entity: "warehouse",
              details: `Auto-created warehouse "${w.warehouseName}" during inventory adjustment`,
            });
          }
        }
      }
    }

    await logActivity(req, {
      action: "update",
      entity: "product",
      entityId: req.params.id,
      details: `Adjusted inventory for product "${updated.title}" (ID: ${req.params.id}) - New Total Stock: ${totalStock}`,
    });

    return res.json({ message: "Inventory updated", product: updated });
  } catch (error) {
    console.error("Update inventory error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const deleted = await ProductModel.findOneAndDelete({
      id: Number(req.params.id),
      vendorId: req.user.id,
    });
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    await logActivity(req, {
      action: "delete",
      entity: "product",
      entityId: req.params.id,
      details: `Deleted product "${deleted.title}" (ID: ${req.params.id})`,
    });

    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
