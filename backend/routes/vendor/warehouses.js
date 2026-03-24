const express = require("express");
const { connectDB } = require("../../lib/db");
const { WarehouseModel, ProductModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

router.get("/", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const vendorId = req.user.id;
    const warehouses = await WarehouseModel.find({ vendorId }).sort({ name: 1 }).lean();

    const aggregatedWarehouses = await ProductModel.aggregate([
      { $match: { vendorId: vendorId } },
      { $unwind: "$warehouseInventory" },
      {
        $group: {
          _id: "$warehouseInventory.warehouseName",
          items: {
            $push: {
              productId: "$id",
              title: "$title",
              sku: "$sku",
              stock: "$warehouseInventory.quantity",
            },
          },
          totalItemsInWarehouse: { $sum: "$warehouseInventory.quantity" },
        },
      },
    ]);

    const aggMap = {};
    aggregatedWarehouses.forEach(agg => {
      aggMap[agg._id] = agg;
    });

    const enrichedWarehouses = warehouses.map(w => {
      const agg = aggMap[w.name] || { items: [], totalItemsInWarehouse: 0 };
      return {
        _id: w._id,
        id: w.id,
        warehouseName: w.name,
        location: w.location,
        capacity: w.capacity || 0,
        items: agg.items,
        totalItemsInWarehouse: agg.totalItemsInWarehouse
      };
    });

    return res.json(enrichedWarehouses);
  } catch (error) {
    console.error("Vendor warehouses error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/", requireVendor, async (req, res) => {
  try {
    const { name, location, capacity } = req.body;
    if (!name?.trim() || !location?.trim()) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    await connectDB();
    const existing = await WarehouseModel.findOne({ name: name.trim(), vendorId: req.user.id });
    if (existing) {
      return res.status(409).json({ message: "Warehouse with this name already exists" });
    }

    const warehouse = await WarehouseModel.create({
      id: "WH-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: name.trim(),
      location: location.trim(),
      vendorId: req.user.id,
      capacity: Number(capacity) || 0,
    });

    await logActivity(req, {
      action: "add",
      entity: "warehouse",
      entityId: warehouse.id,
      details: `Vendor created warehouse "${name.trim()}"`,
    });

    return res.status(201).json({ message: "Warehouse created", warehouse });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id", requireVendor, async (req, res) => {
  try {
    const { name, location, capacity } = req.body;
    await connectDB();

    const warehouse = await WarehouseModel.findOne({ id: req.params.id, vendorId: req.user.id });
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found or access denied" });

    const updateData = {};
    if (name?.trim()) updateData.name = name.trim();
    if (location?.trim()) updateData.location = location.trim();
    if (capacity !== undefined) updateData.capacity = Number(capacity) || 0;

    const updated = await WarehouseModel.findOneAndUpdate(
      { id: req.params.id, vendorId: req.user.id },
      { $set: updateData },
      { new: true }
    );

    await logActivity(req, {
      action: "update",
      entity: "warehouse",
      entityId: req.params.id,
      details: `Vendor updated warehouse "${updated.name}"`,
    });

    return res.json({ message: "Warehouse updated", warehouse: updated });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const warehouse = await WarehouseModel.findOne({ id: req.params.id, vendorId: req.user.id });
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found or access denied" });
    await WarehouseModel.findOneAndDelete({ id: req.params.id, vendorId: req.user.id });

    await logActivity(req, {
      action: "delete",
      entity: "warehouse",
      entityId: req.params.id,
      details: `Vendor deleted warehouse "${warehouse.name}"`,
    });

    return res.json({ message: "Warehouse deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/bulk-assign", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const { warehouseName, location, products } = req.body;
    const vendorId = req.user.id;
    
    if (!warehouseName || !location || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    let updatedCount = 0;
    for (const p of products) {
      if (!p.productId || typeof p.quantity !== 'number') continue;
      
      const dbProduct = await ProductModel.findOne({ id: p.productId, vendorId: vendorId });
      if (dbProduct) {
        let whInventory = dbProduct.warehouseInventory || [];
        const existingIdx = whInventory.findIndex(w => w.warehouseName === warehouseName);

        if (existingIdx >= 0) {
          whInventory[existingIdx].quantity += p.quantity;
          whInventory[existingIdx].location = location; 
        } else {
          whInventory.push({ warehouseName, location, quantity: p.quantity });
        }

        const newTotalStock = whInventory.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

        await ProductModel.findOneAndUpdate(
          { id: p.productId, vendorId: vendorId },
          { 
            $set: { 
              warehouseInventory: whInventory,
              stockQuantity: newTotalStock
            } 
          }
        );
        updatedCount++;
      }
    }

    if (updatedCount > 0 && req.user && req.user.id) {
      await logActivity(req, {
        action: "update",
        entity: "inventory",
        details: `Vendor bulk assigned ${updatedCount} products to warehouse: ${warehouseName}`
      });
    }

    return res.json({ message: "Successfully assigned products to warehouse." });
    
  } catch (error) {
    console.error("Bulk assign error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
