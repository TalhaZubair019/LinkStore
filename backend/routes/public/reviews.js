const express = require("express");
const { connectDB } = require("../../lib/db");
const { ReviewModel } = require("../../lib/models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await connectDB();
    const query = req.query.productId
      ? { productId: req.query.productId.toString() }
      : {};
    const reviews = await ReviewModel.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch reviews" });
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
