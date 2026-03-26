const express = require("express");
const { VendorModel, ProductModel } = require("../../lib/models");
const router = express.Router();

router.get("/list/all", async (req, res) => {
  try {
    const { connectDB } = require("../../lib/db");
    await connectDB();

    const vendors = await VendorModel.find({
      "vendorProfile.status": "approved",
    })
      .select(
        "id name vendorProfile.storeName vendorProfile.logo vendorProfile.storeSlug",
      )
      .lean();

    return res.json({ vendors });
  } catch (error) {
    console.error("Error listing vendors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:storeSlug", async (req, res) => {
  try {
    const { connectDB } = require("../../lib/db");
    await connectDB();
    const { storeSlug } = req.params;
    const vendor = await VendorModel.findOne({
      "vendorProfile.storeSlug": storeSlug,
      "vendorProfile.status": "approved",
    }).select("id name vendorProfile createdAt");

    if (!vendor) {
      return res.status(404).json({ message: "Store not found" });
    }

    const { ReviewModel } = require("../../lib/models");
    const latestReviews = await ReviewModel.find({
      vendorId: vendor.id,
      targetType: "vendor",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

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
      recentReviews: latestReviews,
    };

    const products = await ProductModel.find({
      vendorId: vendor.id,
      isApproved: true,
    }).sort({ createdAt: -1 });

    return res.json({
      store: storeProfile,
      products,
    });
  } catch (error) {
    console.error("Error fetching store data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
