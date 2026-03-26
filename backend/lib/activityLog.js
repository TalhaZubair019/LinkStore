const mongoose = require("mongoose");
const { connectDB } = require("./db");

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    entity: {
      type: String,
      required: true,
      enum: [
        "product",
        "category",
        "order",
        "review",
        "warehouse",
        "user",
        "inventory",
        "system",
      ],
    },
    entityId: { type: String },
    details: { type: String, required: true },
    adminId: { type: String, required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
  },
  { timestamps: true },
);

const ActivityLogModel =
  mongoose.models?.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

async function logActivity(req, { action, entity, entityId, details }) {
  try {
    await connectDB();
    await ActivityLogModel.create({
      action,
      entity,
      entityId: entityId?.toString() || "",
      details,
      adminId: req.user.id,
      adminName: req.user.name || "Unknown",
      adminEmail: req.user.email || "",
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

module.exports = { ActivityLogModel, logActivity };
