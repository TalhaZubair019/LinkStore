const express = require("express");
const { connectDB } = require("../../lib/db");
const { VendorModel } = require("../../lib/models");
const { requireSuperAdmin } = require("../../middleware/auth");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

router.use("/stats", require("./stats"));
router.use("/users", require("./users"));
router.use("/logs", require("./logs"));
router.use("/reviews", require("./reviews"));

router.post("/clear-commission-debt", requireSuperAdmin, async (req, res) => {
  try {
    const { vendorId } = req.body;
    if (!vendorId)
      return res.status(400).json({ message: "Vendor ID is required" });

    await connectDB();
    const vendorBefore = await VendorModel.findOne({ id: vendorId }).lean();
    if (!vendorBefore)
      return res.status(404).json({ message: "Vendor not found" });

    const amountCleared = vendorBefore.vendorProfile.outstandingCommission || 0;

    const vendor = await VendorModel.findOneAndUpdate(
      { id: vendorId },
      {
        $set: { 
          "vendorProfile.outstandingCommission": 0,
          "vendorProfile.commissionDeadline": null,
        },
        $inc: { "vendorProfile.totalCommissionPaid": amountCleared },
      },
      { new: true },
    );

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await logActivity(req, {
      action: "update",
      entity: "vendor",
      entityId: vendorId,
      details: `Cleared outstanding COD commission for vendor "${vendor.vendorProfile.storeName}"`,
    });

    return res.json({
      message: "Commission debt cleared successfully",
      vendor,
    });
  } catch (error) {
    console.error("Clear commission error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
