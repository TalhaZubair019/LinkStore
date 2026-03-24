const express = require("express");
const { UserModel, ProductModel } = require("../../lib/models");
const { connectDB } = require("../../lib/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await connectDB();
    const vendors = await UserModel.find({
      isVendor: true,
      "vendorProfile.status": "approved",
    }).lean();

    const vendorList = await Promise.all(
      vendors.map(async (v) => {
        const productCount = await ProductModel.countDocuments({
          vendorId: v.id,
          isApproved: true,
        });
        return {
          id: v.id,
          name: v.vendorProfile?.storeName || v.name,
          logo: v.vendorProfile?.logo,
          productCount,
        };
      })
    );

    return res.json(vendorList);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
