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
    return res.json({
      message: "Vendor application approved successfully",
      user: vendor,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id/reject-vendor", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const user = await UserModel.findOne({ id: req.params.id });
    const vendor = await VendorModel.findOne({ id: req.params.id });
    const target = user || vendor;
    if (!target) return res.status(404).json({ message: "User not found" });
    target.vendorProfile.status = "rejected";
    await target.save();
    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Rejected vendor application for "${target.vendorProfile.storeName}" (User: ${target.name})`,
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
    return res.json({ message: "Vendor account unsuspended successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
