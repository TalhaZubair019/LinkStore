const express = require("express");
const bcrypt = require("bcryptjs");
const { connectDB } = require("../../lib/db");
const { UserModel } = require("../../lib/models");
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
    const existing = await UserModel.findOne({ email }).lean();
    if (existing)
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
      adminRole: "admin",
      promotedBy: req.user.id,
      cart: [],
      wishlist: [],
      savedCards: [],
    });
    await logActivity(req, {
      action: "add",
      entity: "user",
      entityId: newUser.id,
      details: `Created new admin account for "${name}" (${email})`
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
    const updateData = { isAdmin: req.body.isAdmin };
    if (req.body.isAdmin) {
      updateData.adminRole = "admin";
      updateData.promotedBy = req.user.id;
      updateData.promotionPending = true;
      updateData.demotionPending = false;
    } else {
      updateData.adminRole = null;
      updateData.promotedBy = null;
      updateData.promotionPending = false;
      updateData.demotionPending = true;
    }
    const updated = await UserModel.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true },
    );
    if (!updated) return res.status(404).json({ message: "User not found" });

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: req.body.isAdmin 
        ? `Promoted user "${updated.name}" (${updated.email}) to Admin` 
        : `Demoted user "${updated.name}" (${updated.email}) to Regular User`
    });

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const targetUser = await UserModel.findOne({ id: req.params.id }).lean();
    if (!targetUser) return res.status(404).json({ message: "User not found" });
    if (targetUser.email === process.env.EMAIL_USER) {
      return res.status(403).json({ message: "Cannot delete the super admin account" });
    }
    await UserModel.findOneAndDelete({ id: req.params.id });

    await logActivity(req, {
      action: "delete",
      entity: "user",
      entityId: req.params.id,
      details: `Deleted user account: "${targetUser.name}" (${targetUser.email})`
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

    if (user.vendorProfile.status !== "pending") {
      return res.status(400).json({ message: "User does not have a pending vendor application" });
    }

    user.isVendor = true;
    user.vendorProfile.status = "approved";
    user.vendorApprovalPending = true;

    await user.save();

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Approved vendor application for "${user.vendorProfile.storeName}" (User: ${user.name})`,
    });

    return res.json({ message: "Vendor application approved successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id/reject-vendor", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.vendorProfile.status = "rejected";
    await user.save();

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Rejected vendor application for "${user.vendorProfile.storeName}" (User: ${user.name})`,
    });

    return res.json({ message: "Vendor application rejected" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id/suspend-vendor", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.vendorProfile.status = "suspended";
    user.isVendor = false;
    user.suspensionPending = true;
    await user.save();

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Suspended vendor account for "${user.vendorProfile.storeName}" (User: ${user.name})`,
    });

    return res.json({ message: "Vendor account suspended" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id/unsuspend-vendor", requireSuperAdmin, async (req, res) => {
  try {
    await connectDB();
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.vendorProfile.status = "approved";
    user.isVendor = true;
    user.suspensionPending = false;
    user.unsuspensionPending = true;
    await user.save();

    await logActivity(req, {
      action: "update",
      entity: "user",
      entityId: req.params.id,
      details: `Unsuspended vendor account for "${user.vendorProfile.storeName}" (User: ${user.name})`,
    });

    return res.json({ message: "Vendor account unsuspended successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
