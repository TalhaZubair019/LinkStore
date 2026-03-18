const express = require("express");
const { connectDB } = require("../../lib/db");
const { ReviewModel } = require("../../lib/models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await connectDB();
    const { productId, vendorId, targetType } = req.query;
    
    let query = {};
    if (productId) query.productId = productId.toString();
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

// POST /api/public/reviews/vendor
router.post("/vendor", async (req, res) => {
  try {
    const { vendorId, rating, comment, userId, userName, userImage } = req.body;
    
    if (!vendorId || !rating) {
      return res.status(400).json({ error: "Vendor ID and rating are required" });
    }

    await connectDB();
    const { UserModel } = require("../../lib/models");

    // 1. Create the review
    const savedReview = await ReviewModel.create({
      id: Date.now().toString(),
      vendorId,
      rating: Number(rating),
      comment,
      userId,
      userName,
      userImage,
      targetType: "vendor",
      date: new Date().toLocaleDateString()
    });

    // 2. Recalculate Vendor Stats
    const allVendorReviews = await ReviewModel.find({ vendorId, targetType: "vendor" });
    const totalReviews = allVendorReviews.length;
    const averageRating = allVendorReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews;

    await UserModel.findOneAndUpdate(
      { id: vendorId },
      { 
        $set: { 
          "vendorProfile.averageRating": Number(averageRating.toFixed(1)),
          "vendorProfile.totalReviews": totalReviews
        } 
      }
    );

    return res.status(201).json(savedReview);
  } catch (error) {
    console.error("Vendor review error:", error);
    return res.status(500).json({ error: "Failed to save vendor review" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { productId, review } = req.body;
    if (!productId || !review)
      return res.status(400).json({ error: "Missing required fields" });

    await connectDB();
    const savedReview = await ReviewModel.create({
      ...review,
      productId: productId.toString(),
    });
    return res.status(201).json(savedReview);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save review" });
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

router.delete("/:id", async (req, res) => {
  try {
    await connectDB();
    const deleted = await ReviewModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Review not found" });
    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
