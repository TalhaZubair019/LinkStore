const express = require("express");
const { connectDB } = require("../../lib/db");
const { requireSuperAdmin } = require("../../middleware/auth");
const { ActivityLogModel } = require("../../lib/activityLog");
const { VendorModel, AdminModel } = require("../../lib/models");

const router = express.Router();

router.get("/", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const { entity, action, adminId, limit = 100, page = 1 } = req.query;

    const filter = {};
    if (entity && entity !== "all") filter.entity = entity;
    if (action && action !== "all") filter.action = action;
    if (adminId && adminId !== "all") filter.adminId = adminId;

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total, admins, vendors] = await Promise.all([
      ActivityLogModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ActivityLogModel.countDocuments(filter),
      AdminModel.find({}, "id name email adminRole").lean(),
      VendorModel.find({}, "id name email vendorProfile.storeName").lean(),
    ]);

    const formattedAdmins = admins.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      role: a.adminRole,
    }));

    const formattedVendors = vendors.map((v) => ({
      id: v.id,
      name: v.vendorProfile?.storeName || v.name,
      email: v.email,
    }));

    return res.json({
      logs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      admins: formattedAdmins,
      vendors: formattedVendors,
    });
  } catch (error) {
    console.error("Logs fetch error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.get("/export", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const { entity, action, adminId } = req.query;

    const filter = {};
    if (entity && entity !== "all") filter.entity = entity;
    if (action && action !== "all") filter.action = action;
    if (adminId && adminId !== "all") filter.adminId = adminId;

    const logs = await ActivityLogModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "Date",
      "Admin Name",
      "Admin Email",
      "Entity",
      "Action",
      "Entity ID",
      "Details",
    ];
    const rows = logs.map((log) => [
      `"${new Date(log.createdAt).toLocaleString().replace(/"/g, '""')}"`,
      `"${log.adminName.replace(/"/g, '""')}"`,
      `"${log.adminEmail.replace(/"/g, '""')}"`,
      `"${log.entity.replace(/"/g, '""')}"`,
      `"${log.action.replace(/"/g, '""')}"`,
      `"${(log.entityId || "").replace(/"/g, '""')}"`,
      `"${log.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "\ufeff" +
      [
        headers.map((h) => `"${h}"`).join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=activity_logs.csv",
    );
    return res.send(csvContent);
  } catch (error) {
    console.error("Logs export error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
