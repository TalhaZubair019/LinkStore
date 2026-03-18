const express = require("express");
const { UserModel, ProductModel } = require("../../lib/models");

const router = express.Router();

// GET /api/public/stores/list/all
router.get("/list/all", async (req, res) => {
  try {
    const { connectDB } = require("../../lib/db");
    await connectDB();
    
    const vendors = await UserModel.find({
      isVendor: true,
      "vendorProfile.status": "approved"
    }).select("id name vendorProfile.storeName").lean();

    return res.json({ vendors });
  } catch (error) {
    console.error("Error listing vendors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/public/stores/:storeSlug
router.get("/:storeSlug", async (req, res) => {
  try {
    const { connectDB } = require("../../lib/db");
    await connectDB();
    const { storeSlug } = req.params;

    // Find vendor by storeSlug
    const vendor = await UserModel.findOne({
      "vendorProfile.storeSlug": storeSlug,
      isVendor: true,
      "vendorProfile.status": "approved"
    }).select("id name vendorProfile createdAt");

    if (!vendor) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Fetch latest 5 reviews for this vendor
    const { ReviewModel } = require("../../lib/models");
    const latestReviews = await ReviewModel.find({ 
      vendorId: vendor.id, 
      targetType: "vendor" 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

    // Filter public profile data
    const storeProfile = {
      id: vendor.id,
      name: vendor.name,
      storeName: vendor.vendorProfile.storeName,
      storeDescription: vendor.vendorProfile.storeDescription,
      logo: vendor.vendorProfile.logo,
      banner: vendor.vendorProfile.banner,
      averageRating: vendor.vendorProfile.averageRating || 0,
      totalReviews: vendor.vendorProfile.totalReviews || 0,
      joinedDate: vendor.createdAt,
      recentReviews: latestReviews
    };

    // Fetch vendor's approved products
    const products = await ProductModel.find({
      vendorId: vendor.id,
      isApproved: true
    }).sort({ createdAt: -1 });

    return res.json({
      store: storeProfile,
      products
    });
  } catch (error) {
    console.error("Error fetching store data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
