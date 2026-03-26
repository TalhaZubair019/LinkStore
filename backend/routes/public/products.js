const express = require("express");
const { ProductModel } = require("../../lib/models");
const { connectDB } = require("../../lib/db");
const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    await connectDB();
    const { slug } = req.params;
    const products = await ProductModel.find({ isApproved: true }).lean();
    const product = products.find(
      (p) => p.title.toLowerCase().replace(/\s+/g, "-") === slug,
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const related = await ProductModel.find({
      category: product.category,
      id: { $ne: product.id },
      isApproved: true,
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
