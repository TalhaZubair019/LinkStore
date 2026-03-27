const express = require("express");
const { connectDB } = require("../../lib/db");
const { UserModel, AdminModel } = require("../../lib/models");
const { requireAuth } = require("../../middleware/auth");
const { logActivity } = require("../../lib/activityLog");
const { transporter } = require("../../lib/mailer");
const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { storeName, storeDescription } = req.body;

    if (!storeName || !storeDescription) {
      return res
        .status(400)
        .json({ message: "Store name and description are required" });
    }

    await connectDB();
    const user = await UserModel.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = user.vendorProfile || {};
    const status = profile.status;

    if (status === "approved" || status === "suspended") {
      return res.status(400).json({
        message: `Your vendor account is currently ${status}. Please contact support for assistance.`,
        status,
      });
    }

    if (status === "pending" && profile.storeName) {
      return res
        .status(400)
        .json({
          message: "You already have a pending application.",
          status: "pending",
        });
    }

    user.vendorProfile = {
      ...user.vendorProfile,
      storeName,
      storeDescription,
      status: "pending",
      storeSlug: storeName.toLowerCase().replace(/\s+/g, "-"),
    };
    user.vendorApplicationPending = true;
    await user.save();

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.user.id,
      details: `User "${user.name}" applied for a vendor account: "${storeName}"`,
    });

    try {
      const admins = await AdminModel.find({ adminRole: "super_admin" }).lean();
      const adminEmails = admins.length > 0 ? admins.map(a => a.email) : [process.env.EMAIL_USER];
      const appHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #8B5CF6;">New Vendor Application</h2>
          <p>A user has submitted a new application to become a vendor on LinkStore.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Applicant Name:</strong> ${user.name}</p>
            <p><strong>Applicant Email:</strong> ${user.email}</p>
            <p><strong>Store Name:</strong> ${storeName}</p>
            <p><strong>Description:</strong> ${storeDescription}</p>
          </div>
          <p>Please log in to the Admin Dashboard to review and approve/reject this application.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">LinkStore Administrative Notification</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"LinkStore" <${process.env.EMAIL_USER}>`,
        to: adminEmails,
        subject: `🔔 New Vendor Application: ${storeName}`,
        html: appHtml,
      });
    } catch (mailError) {
      console.error(
        "Error sending vendor application email to admin:",
        mailError,
      );
    }

    return res.json({
      message: "Application submitted successfully",
      vendorProfile: user.vendorProfile,
    });
  } catch (error) {
    console.error("Vendor application error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
