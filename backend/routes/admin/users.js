const express = require("express");
const bcrypt = require("bcryptjs");
const { connectDB } = require("../../lib/db");
const { UserModel, AdminModel, VendorModel } = require("../../lib/models");
const { requireSuperAdmin } = require("../../middleware/auth");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

router.post("/", requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });

    await connectDB();
    const [existingUser, existingAdmin, existingVendor] = await Promise.all([
      UserModel.findOne({ email }).lean(),
      AdminModel.findOne({ email }).lean(),
      VendorModel.findOne({ email }).lean(),
    ]);
    if (existingUser || existingAdmin || existingVendor)
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await AdminModel.create({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      adminRole: "admin",
      promotedBy: req.user.id,
    });
    await logActivity(req, {
      action: "add",
      entity: "user",
      entityId: newAdmin.id,
      details: `Created new admin account for "${name}" (${email})`,
    });
    return res
      .status(201)
      .json({ message: "Admin account created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    if (req.body.isAdmin) {
      const user = await UserModel.findOne({ id: req.params.id });
      if (!user) return res.status(404).json({ message: "User not found" });

      const newAdmin = await AdminModel.create({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        isVerified: user.isVerified,
        adminRole: "admin",
        promotedBy: req.user.id,
        promotionPending: true,
      });
      await logActivity(req, {
        action: "update",
        entity: "user",
        entityId: req.params.id,
        details: `Promoted user "${user.name}" (${user.email}) to Admin`,
      });
      return res.json({ message: "User promoted to admin successfully" });
    } else {
      const admin = await AdminModel.findOne({ id: req.params.id });
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      await AdminModel.findOneAndDelete({ id: req.params.id });
      await UserModel.findOneAndUpdate(
        { id: req.params.id },
        { demotionPending: true },
      );
      await logActivity(req, {
        action: "update",
        entity: "user",
        entityId: req.params.id,
        details: `Demoted admin "${admin.name}" (${admin.email}) to Regular User`,
      });
      return res.json({ message: "Admin demoted to regular user" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const [user, admin, vendor] = await Promise.all([
      UserModel.findOne({ id: req.params.id }).lean(),
      AdminModel.findOne({ id: req.params.id }).lean(),
      VendorModel.findOne({ id: req.params.id }).lean(),
    ]);
    const target = user || admin || vendor;
    if (!target) return res.status(404).json({ message: "User not found" });
    if (target.email === process.env.EMAIL_USER) {
      return res
        .status(403)
        .json({ message: "Cannot delete the super admin account" });
    }
    await Promise.all([
      UserModel.findOneAndDelete({ id: req.params.id }),
      AdminModel.findOneAndDelete({ id: req.params.id }),
      VendorModel.findOneAndDelete({ id: req.params.id }),
    ]);
    await logActivity(req, {
      action: "delete",
      entity: "user",
      entityId: req.params.id,
      details: `Deleted account: "${target.name}" (${target.email})`,
    });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id/approve-vendor", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.vendorProfile?.status !== "pending") {
      return res
        .status(400)
        .json({ message: "User does not have a pending vendor application" });
    }

    const vendor = await VendorModel.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      isVerified: user.isVerified,
      address: user.address,
      city: user.city,
      province: user.province,
      postcode: user.postcode,
      country: user.country,
      countryCode: user.countryCode,
      stateCode: user.stateCode,
      cart: user.cart || [],
      wishlist: user.wishlist || [],
      savedCards: user.savedCards || [],
      vendorApprovalPending: true,
      vendorProfile: {
        ...user.vendorProfile,
        status: "approved",
      },
    });
    await UserModel.findOneAndDelete({ id: req.params.id });

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Approved vendor application for "${vendor.vendorProfile.storeName}" (User: ${vendor.name})`,
    });
    
    try {
      const { transporter } = require("../../lib/mailer");
      const approvalHtml = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 8px 16px; background: #ecfdf5; color: #059669; border-radius: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Application Approved</div>
          </div>
          <h2 style="color: #1e293b; font-size: 22px; font-weight: 800; margin-bottom: 16px;">Congratulations!</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Dear ${vendor.name}, we are thrilled to welcome you to the LinkStore community. Your application for <strong>"${vendor.vendorProfile.storeName}"</strong> has been approved!</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; margin-bottom: 32px; text-align: center;">
            <p style="color: #1e293b; font-weight: 700; margin-bottom: 16px;">You can now access your Vendor Dashboard:</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/vendor" style="background: #7c3aed; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-weight: 700; display: inline-block;">Go to Dashboard</a>
          </div>
          
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 32px;">We look forward to seeing your products on our marketplace. If you have any questions about getting started, our support team is here to help.</p>
          
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Marketplace. All rights reserved.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"LinkStore Team" <${process.env.EMAIL_USER}>`,
        to: vendor.email,
        subject: `Welcome to LinkStore! Your store "${vendor.vendorProfile.storeName}" is approved`,
        html: approvalHtml,
      });
    } catch (mailError) {
      console.error("Error sending approval email:", mailError);
    }

    return res.json({
      message: "Vendor application approved successfully",
      user: vendor,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

const { transporter } = require("../../lib/mailer");

router.patch("/:id/reject-vendor", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const user = await UserModel.findOne({ id: req.params.id });
    const vendor = await VendorModel.findOne({ id: req.params.id });
    const target = user || vendor;
    if (!target) return res.status(404).json({ message: "User not found" });

    const storeName = target.vendorProfile?.storeName || "your store";
    
    
    await UserModel.findOneAndUpdate(
      { id: req.params.id },
      { 
        $set: { 
          "vendorProfile.status": "rejected",
          "vendorApplicationPending": false
        } 
      }
    );

    
    await VendorModel.findOneAndUpdate(
      { id: req.params.id },
      { 
        $set: { 
          "vendorProfile.status": "rejected"
        } 
      }
    );

    
    try {
      const rejectionHtml = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 8px 16px; background: #fff1f2; color: #e11d48; border-radius: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Application Update</div>
          </div>
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Update on your Vendor Application</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Dear ${target.name},</p>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Thank you for your interest in joining the LinkStore marketplace. After carefully reviewing your application for <strong>"${storeName}"</strong>, we regret to inform you that we cannot approve your application at this time.</p>
          <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #f1f5f9;">
            <p style="color: #64748b; margin: 0; font-size: 14px; font-weight: 500; line-height: 1.5;">We appreciate the effort you put into your application. While this decision is final for now, you are welcome to continue using LinkStore as a regular customer.</p>
          </div>
          <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 32px; font-size: 13px;">If you have any questions, feel free to contact our support team.</p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Marketplace. All rights reserved.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"LinkStore Team" <${process.env.EMAIL_USER}>`,
        to: target.email,
        subject: `Update regarding your application for ${storeName}`,
        html: rejectionHtml,
      });
    } catch (mailError) {
      console.error("Error sending rejection email:", mailError);
    }

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Rejected vendor application for "${storeName}" (User: ${target.name})`,
    });
    return res.json({ message: "Vendor application rejected" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id/suspend-vendor", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const vendor = await VendorModel.findOne({ id: req.params.id });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    vendor.vendorProfile.status = "suspended";
    vendor.suspensionPending = true;
    await vendor.save();
    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Suspended vendor account for "${vendor.vendorProfile.storeName}" (User: ${vendor.name})`,
    });
    
    try {
      const suspensionHtml = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #fecaca; border-radius: 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #e11d48; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 8px 16px; background: #fff1f2; color: #e11d48; border-radius: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Account Suspended</div>
          </div>
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Important notice regarding your store</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Dear ${vendor.name},</p>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">This is to inform you that your vendor account for <strong>"${vendor.vendorProfile.storeName}"</strong> has been suspended due to a policy violation or maintenance requirement.</p>
          <div style="background: #fef2f2; padding: 24px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #fee2e2;">
            <p style="color: #991b1b; margin: 0; font-size: 14px; font-weight: 600;">While suspended, your products are hidden from the storefront and you cannot access vendor features.</p>
          </div>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 32px;">If you believe this is an error or would like to appeal, please contact our vendor support team immediately.</p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Trust & Safety.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"LinkStore Support" <${process.env.EMAIL_USER}>`,
        to: vendor.email,
        subject: `⚠️ Important notice: Your store "${vendor.vendorProfile.storeName}" has been suspended`,
        html: suspensionHtml,
      });
    } catch (mailError) {
      console.error("Error sending suspension email:", mailError);
    }

    return res.json({ message: "Vendor account suspended" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id/unsuspend-vendor", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const vendor = await VendorModel.findOne({ id: req.params.id });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    vendor.vendorProfile.status = "approved";
    vendor.suspensionPending = false;
    vendor.unsuspensionPending = true;
    await vendor.save();
    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Unsuspended vendor account for "${vendor.vendorProfile.storeName}" (User: ${vendor.name})`,
    });
    
    try {
      const unsuspensionHtml = `
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
          </div>
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 8px 16px; background: #ecfdf5; color: #059669; border-radius: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase;">Account Restored</div>
          </div>
          <h2 style="color: #1e293b; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Welcome back!</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Dear ${vendor.name},</p>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">We are pleased to inform you that your vendor account for <strong>"${vendor.vendorProfile.storeName}"</strong> has been unsuspended and fully restored.</p>
          <div style="background: #f0fdf4; padding: 24px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #dcfce7;">
            <p style="color: #166534; margin: 0; font-size: 14px; font-weight: 600;">Your products are now visible again, and your dashboard access is restored.</p>
          </div>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 32px;">Thank you for your patience. You can resume your business operations immediately.</p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Marketplace.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"LinkStore Team" <${process.env.EMAIL_USER}>`,
        to: vendor.email,
        subject: `✅ Good news: Your store "${vendor.vendorProfile.storeName}" has been restored`,
        html: unsuspensionHtml,
      });
    } catch (mailError) {
      console.error("Error sending unsuspension email:", mailError);
    }

    return res.json({ message: "Vendor account unsuspended successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
