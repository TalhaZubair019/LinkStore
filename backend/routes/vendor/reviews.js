const express = require("express");
const { connectDB } = require("../../lib/db");
const { ReviewModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

router.delete("/:id", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const vendorId = req.user.id;
    // VERY IMPORTANT: ensure the vendor can only delete reviews targeting THEIR OWN products/profile
    const deleted = await ReviewModel.findOneAndDelete({ id: req.params.id, vendorId: vendorId });
    if (!deleted) return res.status(404).json({ message: "Review not found or unauthorized" });

    await logActivity(req, {
      action: "delete",
      entity: "review",
      entityId: req.params.id,
      details: `Vendor deleted review by "${deleted.userName || "Unknown"}" (Rating: ${deleted.rating}/5) on product #${deleted.productId}`,
    });

    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
