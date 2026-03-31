const express = require("express");
const { connectDB } = require("../../lib/db");
const { ProductModel } = require("../../lib/models");

const router = express.Router();

router.post("/validate-cart", async (req, res) => {
  try {
    const { items, productIds: bodyProductIds } = req.body;
    let productIds = [];

    if (items && Array.isArray(items)) {
      productIds = items.map((i) => i.id);
    } else if (bodyProductIds && Array.isArray(bodyProductIds)) {
      productIds = bodyProductIds;
    }

    if (productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs are required" });
    }

    await connectDB();
    const { ProductModel, VendorModel } = require("../../lib/models");
    
    
    const suspendedVendors = await VendorModel.find({ 
      "vendorProfile.status": "suspended" 
    }).select("id").lean();
    const suspendedIds = suspendedVendors.map(v => v.id);

    const products = await ProductModel.find({
      id: { $in: productIds.map((id) => Number(id)) },
      vendorId: { $nin: suspendedIds }
    }).lean();
    return res.json(products);
  } catch (error) {
    console.error("Cart validation error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
