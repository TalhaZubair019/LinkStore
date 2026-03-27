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
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 8px 16px; background: #f5f3ff; color: #7c3aed; border-radius: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Action Required</div>
          </div>
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 700; margin-bottom: 16px; text-align: center;">New Vendor Application</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px; text-align: center;">A user has submitted an application to open a store on LinkStore. Please review the details below:</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Store Name</td>
                <td style="padding-bottom: 12px; color: #1e293b; font-size: 14px; font-weight: 700; text-align: right;">${storeName}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Applicant</td>
                <td style="padding-bottom: 12px; color: #1e293b; font-size: 14px; font-weight: 700; text-align: right;">${user.name}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase;">Email</td>
                <td style="padding-bottom: 12px; color: #1e293b; font-size: 14px; font-weight: 700; text-align: right;">${user.email}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; vertical-align: top;">Description</td>
                <td style="color: #64748b; font-size: 13px; font-weight: 500; text-align: right; line-height: 1.4;">${storeDescription}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center;">
            <p style="color: #94a3b8; font-size: 13px; margin-bottom: 24px;">Please log in to the administrator portal to review this application.</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Administrative System.</p>
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
