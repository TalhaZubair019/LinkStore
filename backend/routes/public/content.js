const express = require("express");
const { connectDB } = require("../../lib/db");
const { ProductModel } = require("../../lib/models");
const db = require("../../../data/db.json");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { section } = req.query;

    if (section === "products") {
      await connectDB();
      const { OrderModel, VendorModel } = require("../../lib/models");
      const { search, category, minPrice, maxPrice, vendorId, sort } =
        req.query;
      
      // Fetch suspended vendor IDs to exclude their products
      const suspendedVendors = await VendorModel.find({ 
        "vendorProfile.status": "suspended" 
      }).select("id").lean();
      const suspendedIds = suspendedVendors.map(v => v.id);

      const query = { 
        isApproved: true,
        vendorId: { $nin: suspendedIds }
      };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      if (category && category !== "All Categories") {
        query.category = { $regex: new RegExp(`^${category}$`, "i") };
      }

      if (vendorId) {
        query.vendorId = vendorId;
      }

      let sortQuery = { id: -1 };
      if (
        sort === "Sort By Oldest" ||
        sort === "oldest" ||
        sort === "Oldest First"
      ) {
        sortQuery = { id: 1 };
      } else if (
        sort === "Sort By Latest" ||
        sort === "newest" ||
        sort === "Newest First"
      ) {
        sortQuery = { id: -1 };
      }

      const [shopProducts, orders] = await Promise.all([
        ProductModel.find(query).sort(sortQuery).lean(),
        OrderModel.find({}).lean(),
      ]);
      let filteredProducts = shopProducts;
      if (minPrice || maxPrice) {
        const min = minPrice ? parseFloat(minPrice) : -Infinity;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;

        filteredProducts = shopProducts.filter((p) => {
          if (!p.price) return false;
          const priceValue = parseFloat(
            String(p.price).replace(/[^0-9.]/g, ""),
          );
          return !isNaN(priceValue) && priceValue >= min && priceValue <= max;
        });
      }

      const salesData = {};
      orders.forEach((order) => {
        if (order.status === "Cancelled") return;
        order.items?.forEach((item) => {
          salesData[item.name] =
            (salesData[item.name] || 0) + (item.quantity || 1);
        });
      });

      const uniqueProducts = filteredProducts.map((p) => {
        const salesCount = salesData[p.title] || 0;
        return { ...p, salesCount };
      });

      return res.json({ products: uniqueProducts });
    }

    if (section === "categories") {
      await connectDB();
      const { CategoryModel } = require("../../lib/models");
      const dbCategories = await CategoryModel.find({})
        .sort({ name: 1 })
        .lean();

      const formattedCategories = dbCategories.map((cat) => ({
        id: cat._id.toString(),
        title: cat.name,
        name: cat.name,
        image: cat.image,
        link: `/category/${cat.slug}`,
      }));

      return res.json({
        ...db.categories,
        categories:
          formattedCategories.length > 0
            ? formattedCategories
            : db.categories.categories,
      });
    }

    if (section && section in db) {
      return res.json(db[section]);
    }

    const { all } = req.query;
    if (all === "true") {
      await connectDB();
      const { CategoryModel } = require("../../lib/models");
      const dbCategories = await CategoryModel.find({}).lean();
      if (dbCategories.length > 0) {
        const formattedCategories = dbCategories.map((cat) => ({
          id: cat._id,
          title: cat.name,
          name: cat.name,
          image: cat.image,
          link: `/product-category/${cat.slug}/`,
        }));
        return res.json({
          ...db,
          categories: {
            ...db.categories,
            categories: formattedCategories,
          },
        });
      }
    }

    return res.json(db);
  } catch (error) {
    console.error("Content API error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
