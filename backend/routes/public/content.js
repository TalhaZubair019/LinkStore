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

      const [shopProducts, orders] = await Promise.all([
        ProductModel.find({}).sort({ id: -1 }).lean(),
        OrderModel.find({}).lean(),
      ]);

      const salesData = {};
      orders.forEach((order) => {
        if (order.status === "Cancelled") return;
        order.items?.forEach((item) => {
          salesData[item.name] =
            (salesData[item.name] || 0) + (item.quantity || 1);
        });
      });

      const dbProducts = db.products?.products || [];
      const allProducts = [...shopProducts, ...dbProducts];
      const uniqueProducts = Array.from(
        new Map(allProducts.map((p) => [p.id, p])).values(),
      ).map((p) => {
        const salesCount = salesData[p.title] || 0;
        return {
          ...p,
          salesCount,
        };
      });

      return res.json({ ...db.products, products: uniqueProducts });
    }

    if (section === "categories") {
      const { all } = req.query;

      if (all === "true") {
        await connectDB();
        const { CategoryModel } = require("../../lib/models");
        const dbCategories = await CategoryModel.find({}).lean();

        const formattedCategories = dbCategories.map((cat) => ({
          id: cat._id,
          title: cat.name,
          name: cat.name,
          image: cat.image,
          link: `/product-category/${cat.slug}/`,
        }));

        return res.json({
          ...db.categories,
          categories:
            formattedCategories.length > 0
              ? formattedCategories
              : db.categories.categories,
        });
      }

      return res.json(db.categories);
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
