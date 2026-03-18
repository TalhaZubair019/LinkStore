const express = require("express");
const { connectDB } = require("../../lib/db");
const { ProductModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

// Get all products for the logged-in vendor
router.get("/", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const products = await ProductModel.find({ vendorId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json({ products });
  } catch (error) {
    console.error("Fetch vendor products error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

// Create a new product (pending approval)
router.post("/", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
    const newId = lastProduct && typeof lastProduct.id === "number" ? lastProduct.id + 1 : 1;

    const newProduct = await ProductModel.create({
      ...req.body,
      id: newId,
      vendorId: req.user.id,
      vendorStoreName: req.vendor.vendorProfile.storeName,
      vendorStoreSlug: req.vendor.vendorProfile.storeSlug,
      isApproved: false, // Always false for new vendor products
      warehouseInventory: [],
      stockQuantity: req.body.stockQuantity || 0,
    });

    await logActivity(req, {
      action: "add",
      entity: "product",
      entityId: newId.toString(),
      details: `Vendor ${req.vendor.vendorProfile.storeName} added product "${req.body.title}" (ID: ${newId})`,
    });

    return res.status(201).json({
      message: "Product created successfully and is pending admin approval.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Vendor add product error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
