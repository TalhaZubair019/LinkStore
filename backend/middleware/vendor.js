const { requireAuth } = require("./auth");
const { VendorModel } = require("../lib/models");
const { connectDB } = require("../lib/db");

async function requireVendor(req, res, next) {
  requireAuth(req, res, async () => {
    try {
      await connectDB();
      const user = await VendorModel.findOne({ id: req.user.id }).lean();

      if (!user) {
        return res.status(401).json({ message: "Vendor account not found" });
      }

      if (user.vendorProfile && user.vendorProfile.status === "approved") {
        req.vendor = user;
        return next();
      }

      return res.status(403).json({
        message: "Access denied. Approved vendor account required.",
        vendorStatus: user.vendorProfile ? user.vendorProfile.status : "none",
      });
    } catch (error) {
      console.error("Vendor middleware error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}

module.exports = { requireVendor };
