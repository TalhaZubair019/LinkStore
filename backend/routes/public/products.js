const express = require("express");
const { ProductModel } = require("../../lib/models");
const { connectDB } = require("../../lib/db");
const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    await connectDB();
    const { ProductModel, VendorModel } = require("../../lib/models");
    const { slug } = req.params;
    const products = await ProductModel.find({ isApproved: true }).lean();
    const product = products.find(
      (p) => p.title.toLowerCase().replace(/\s+/g, "-") === slug,
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    const vendor = await VendorModel.findOne({ id: product.vendorId }).lean();
    if (vendor?.vendorProfile?.status === "suspended") {
       return res.status(404).json({ message: "Product not available" });
    }

    
    const suspendedVendors = await VendorModel.find({ 
      "vendorProfile.status": "suspended" 
    }).select("id").lean();
    const suspendedIds = suspendedVendors.map(v => v.id);

    const related = await ProductModel.find({
      category: product.category,
      id: { $ne: product.id },
      isApproved: true,
      vendorId: { $nin: suspendedIds }
    })
      .limit(4)
      .lean();

    return res.json({ product, related });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
