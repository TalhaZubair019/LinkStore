const express = require("express");
const { connectDB } = require("../../lib/db");
const { WarehouseModel, ProductModel } = require("../../lib/models");
const { requireAdmin } = require("../../middleware/auth");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  try {
    await connectDB();

    const warehouses = await WarehouseModel.find({}).sort({ name: 1 }).lean();

    const aggregatedWarehouses = await ProductModel.aggregate([
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
        items: agg.items,
        totalItemsInWarehouse: agg.totalItemsInWarehouse
      };
    });

    return res.json(enrichedWarehouses);
  } catch (error) {
    console.error("Admin warehouses error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/bulk-assign", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { warehouseName, location, products } = req.body;
    
    if (!warehouseName || !location || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    let updatedCount = 0;
    for (const p of products) {
      if (!p.productId || typeof p.quantity !== 'number') continue;
      
      const dbProduct = await ProductModel.findOne({ id: p.productId });
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
          { id: p.productId },
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
        details: `Bulk assigned ${updatedCount} products to warehouse: ${warehouseName}`
      });
    }

    return res.json({ message: "Successfully assigned products to warehouse." });
    
  } catch (error) {
    console.error("Bulk assign error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required." });
    }

    const id = `wh_${Date.now()}`;
    const newWarehouse = await WarehouseModel.create({
      id,
      name,
      location
    });

    if (req.user && req.user.id) {
      await logActivity(req, {
        action: "add",
        entity: "warehouse",
        details: `Created new warehouse: ${name}`
      });
    }

    return res.status(201).json(newWarehouse);
  } catch (error) {
    console.error("Create warehouse error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Warehouse ID already exists." });
    }
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { name, location } = req.body;
    
    const warehouse = await WarehouseModel.findOne({ id });
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found." });
    }

    const oldName = warehouse.name;
    const oldLocation = warehouse.location;

    warehouse.name = name || warehouse.name;
    warehouse.location = location || warehouse.location;
    await warehouse.save();

    if (oldName !== warehouse.name || oldLocation !== warehouse.location) {
      const products = await ProductModel.find({ "warehouseInventory.warehouseName": oldName });
      for (const p of products) {
        let changed = false;
        p.warehouseInventory.forEach(w => {
          if (w.warehouseName === oldName) {
            changed = true;
            w.warehouseName = warehouse.name;
            w.location = warehouse.location;
          }
        });
        if (changed) {
          await p.save();
        }
      }
    }

    if (req.user && req.user.id) {
      await logActivity(req, {
        action: "update",
        entity: "warehouse",
        entityId: req.params.id,
        details: `Updated warehouse: ${warehouse.name} (${warehouse.location})`
      });
    }

    return res.json(warehouse);
  } catch (error) {
    console.error("Update warehouse error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    const warehouse = await WarehouseModel.findOne({ id });
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found." });
    }

    await WarehouseModel.deleteOne({ id });

    if (req.user && req.user.id) {
      await logActivity(req, {
        action: "delete",
        entity: "warehouse",
        entityId: req.params.id,
        details: `Deleted warehouse: ${warehouse.name}`
      });
    }

    return res.json({ message: "Warehouse deleted successfully." });
  } catch (error) {
    console.error("Delete warehouse error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
