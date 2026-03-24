const express = require("express");
const { connectDB } = require("../../lib/db");
const { CategoryModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await connectDB();
    const categories = await CategoryModel.find({}).sort({ name: 1 }).lean();
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/", requireVendor, async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name?.trim())
      return res.status(400).json({ message: "Category name is required" });

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    await connectDB();
    const existing = await CategoryModel.findOne({ slug });
    if (existing)
      return res.status(409).json({ message: "Category already exists" });

    const category = await CategoryModel.create({
      name: name.trim(),
      slug,
      image: image || null,
    });

    await logActivity(req, {
      action: "add",
      entity: "category",
      entityId: category._id.toString(),
      details: `Vendor added category "${name.trim()}"`,
    });

    return res.status(201).json({ message: "Category created", category });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.patch("/:id", requireVendor, async (req, res) => {
  try {
    const { name, image } = req.body;
    const updateData = {};
    if (name?.trim()) {
      updateData.name = name.trim();
      updateData.slug = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    if (image !== undefined) updateData.image = image || null;

    await connectDB();

    const oldCategory = await CategoryModel.findById(req.params.id).lean();
    if (!oldCategory)
      return res.status(404).json({ message: "Category not found" });

    const updated = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    if (!updated)
      return res.status(404).json({ message: "Category not found" });

    const changes = [];
    if (updateData.name && oldCategory.name !== updateData.name) {
      changes.push(`Name: "${oldCategory.name}" → "${updateData.name}"`);
    }
    if (image !== undefined && oldCategory.image !== (image || null)) {
      changes.push(`Image: ${oldCategory.image ? "changed" : "added"}`);
    }

    const detailStr = changes.length > 0
      ? `Vendor updated category "${updated.name}" — ${changes.join(", ")}`
      : `Vendor updated category "${updated.name}" (no field changes)`;

    await logActivity(req, {
      action: "update",
      entity: "category",
      entityId: req.params.id,
      details: detailStr,
    });

    return res.json({ message: "Category updated", category: updated });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });

    await logActivity(req, {
      action: "delete",
      entity: "category",
      entityId: req.params.id,
      details: `Deleted category "${deleted.name}"`,
    });

    return res.json({ message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
