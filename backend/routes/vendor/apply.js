const express = require("express");
const { connectDB } = require("../../lib/db");
const { UserModel } = require("../../lib/models");
const { requireAuth } = require("../../middleware/auth");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

// Submit a vendor application
router.post("/", requireAuth, async (req, res) => {
  try {
    const { storeName, storeDescription } = req.body;

    if (!storeName || !storeDescription) {
      return res.status(400).json({ message: "Store name and description are required" });
    }

    await connectDB();
    const user = await UserModel.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user already has an active or pending application
    const profile = user.vendorProfile || {};
    const status = profile.status;
    
    // Only block if they have a real, valid application in progress or an active/suspended account
    if (status === "approved" || status === "suspended") {
      return res.status(400).json({ 
        message: `Your vendor account is currently ${status}. Please contact support for assistance.`, 
        status 
      });
    }
    
    if (status === "pending" && profile.storeName) {
      return res.status(400).json({ message: "You already have a pending application.", status: "pending" });
    }

    user.vendorProfile = {
      ...user.vendorProfile,
      storeName,
      storeDescription,
      status: "pending",
      storeSlug: storeName.toLowerCase().replace(/\s+/g, "-"),
    };

    await user.save();

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.user.id,
      details: `User "${user.name}" applied for a vendor account: "${storeName}"`,
    });

    return res.json({ 
      message: "Application submitted successfully", 
      vendorProfile: user.vendorProfile 
    });
  } catch (error) {
    console.error("Vendor application error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
