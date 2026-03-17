const express = require("express");
const { connectDB } = require("../../lib/db");
const { ReviewModel } = require("../../lib/models");
const { requireAdmin } = require("../../middleware/auth");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const deleted = await ReviewModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Review not found" });

    await logActivity(req, {
      action: "delete",
      entity: "review",
      entityId: req.params.id,
      details: `Deleted review by "${deleted.userName || "Unknown"}" (Rating: ${deleted.rating}/5) on product #${deleted.productId}`,
    });

    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
