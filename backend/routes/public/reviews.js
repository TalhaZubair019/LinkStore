const express = require("express");
const { connectDB } = require("../../lib/db");
const { ReviewModel } = require("../../lib/models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await connectDB();
    const { productId, vendorId, targetType } = req.query;

    let query = {};
    if (productId) query.productId = Number(productId);
    if (vendorId) query.vendorId = vendorId;
    if (targetType) query.targetType = targetType;

    const reviews = await ReviewModel.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/vendor", async (req, res) => {
  try {
    const { vendorId, rating, comment, userId, userName, userImage, orderId } =
      req.body;

    if (!vendorId || !rating) {
      return res
        .status(400)
        .json({ error: "Vendor ID and rating are required" });
    }

    await connectDB();
    const { VendorModel } = require("../../lib/models");

    const savedReview = await ReviewModel.create({
      id: Date.now().toString(),
      vendorId,
      orderId,
      rating: Number(rating),
      comment,
      userId,
      userName,
      userImage,
      targetType: "vendor",
      date: new Date().toLocaleDateString(),
    });

    const allVendorReviews = await ReviewModel.find({
      vendorId,
      targetType: "vendor",
    });
    const totalReviews = allVendorReviews.length;
    const averageRating =
      allVendorReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      totalReviews;

    await VendorModel.findOneAndUpdate(
      { id: vendorId },
      {
        $set: {
          "vendorProfile.averageRating": Number(averageRating.toFixed(1)),
          "vendorProfile.totalReviews": totalReviews,
        },
      },
    );

    return res.status(201).json(savedReview);
  } catch (error) {
    console.error("Vendor review error:", error);
    return res.status(500).json({ error: "Failed to save vendor review" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body.review ? { ...req.body, ...req.body.review } : req.body;
    const { productId, rating, comment, userId, userName, userImage } = body;

    if (!productId || !rating) {
      return res
        .status(400)
        .json({ error: "Product ID and rating are required" });
    }

    await connectDB();
    const { ProductModel } = require("../../lib/models");
    const product = await ProductModel.findOne({ id: Number(productId) }).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });

    const savedReview = await ReviewModel.create({
      id: Date.now().toString(),
      productId: Number(productId),
      vendorId: product.vendorId,
      rating: Number(rating),
      comment,
      userId,
      userName,
      userImage,
      targetType: "product",
      date: new Date().toLocaleDateString(),
    });

    // Update product stats
    const allProductReviews = await ReviewModel.find({
      productId: Number(productId),
      targetType: "product",
    });
    const totalReviews = allProductReviews.length;
    const averageRating =
      allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      totalReviews;

    await ProductModel.findOneAndUpdate(
      { id: Number(productId) },
      {
        $set: {
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews: totalReviews,
        },
      },
    );

    return res.status(201).json(savedReview);
  } catch (error) {
    console.error("Product review error:", error);
    return res.status(500).json({ error: "Failed to save product review" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { review } = req.body;
    await connectDB();

    const existing = await ReviewModel.findOne({ id: req.params.id }).lean();
    if (!existing) return res.status(404).json({ message: "Review not found" });

    const previousReview = {
      rating: existing.rating,
      comment: existing.comment,
      date: existing.date,
    };

    const reviewToUpdate = {
      ...review,
      previousReview:
        existing.isEdited && existing.previousReview
          ? existing.previousReview
          : previousReview,
    };

    const updated = await ReviewModel.findOneAndUpdate(
      { id: req.params.id },
      { $set: reviewToUpdate },
      { returnDocument: "after", new: true },
    );
    if (!updated) return res.status(404).json({ message: "Review not found" });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update review" });
  }
});

module.exports = router;
