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
      const { OrderModel } = require("../../lib/models");
      const { search, category, minPrice, maxPrice, vendorId } = req.query;

      // Build dynamic query
      const query = { isApproved: true };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ];
      }

      if (category && category !== "All Categories") {
        query.category = { $regex: new RegExp(`^${category}$`, "i") };
      }

      if (vendorId) {
        query.vendorId = vendorId;
      }

      // Fetch products matching core filters first
      const [shopProducts, orders] = await Promise.all([
        ProductModel.find(query).sort({ id: -1 }).lean(),
        OrderModel.find({}).lean(),
      ]);

      // Apply price range filter in-memory for accurate numeric comparison (since price is String in DB)
      let filteredProducts = shopProducts;
      if (minPrice || maxPrice) {
        const min = minPrice ? parseFloat(minPrice) : -Infinity;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;

        filteredProducts = shopProducts.filter((p) => {
          if (!p.price) return false;
          // Extract numeric value from string (e.g. "$99.00" -> 99.0)
          const priceValue = parseFloat(String(p.price).replace(/[^0-9.]/g, ""));
          return !isNaN(priceValue) && priceValue >= min && priceValue <= max;
        });
      }

      const salesData = {};
      orders.forEach((order) => {
        if (order.status === "Cancelled") return;
        order.items?.forEach((item) => {
          salesData[item.name] = (salesData[item.name] || 0) + (item.quantity || 1);
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
      const dbCategories = await CategoryModel.find({}).sort({ name: 1 }).lean();

      const formattedCategories = dbCategories.map((cat) => ({
        id: cat._id.toString(),
        title: cat.name,
        name: cat.name,
        image: cat.image,
        link: `/category/${cat.slug}`,
      }));

      // Merge metadata from db.json with dynamic categories
      return res.json({
        ...db.categories,
        categories: formattedCategories.length > 0 
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
