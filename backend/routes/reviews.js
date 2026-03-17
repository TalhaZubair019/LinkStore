const express = require("express");
const router = express.Router();
const { Review, Product } = require("../models");
const { verifyToken } = require("../middleware/auth");

// Get reviews for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 })
      .populate("userId", "name image");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a review
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    if (!productId || !rating) {
      return res.status(400).json({ message: "Product ID and rating are required." });
    }

    const review = new Review({
      productId,
      userId: req.user.id,
      userName: req.user.name,
      userImage: req.user.image || null,
      rating,
      comment,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a review
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.isEdited = true;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a review
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
