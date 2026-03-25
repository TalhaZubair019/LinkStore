const express = require("express");
const { connectDB } = require("../../lib/db");
const {
  OrderModel,
  ProductModel,
  ReviewModel,
  CategoryModel,
  VendorModel,
} = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");

const router = express.Router();

router.get("/", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const vendorId = req.user.id;

    // Fetch only data relevant to this vendor
    const [allOrders, products, reviews, categories, vendorDoc] = await Promise.all([
      OrderModel.find({ "items.vendorId": vendorId }).lean(),
      ProductModel.find({ vendorId }).lean(),
      ReviewModel.find({ vendorId, targetType: "product" }).lean(),
      CategoryModel.find({}).sort({ name: 1 }).lean(),
      VendorModel.findOne({ id: vendorId }).lean(),
    ]);

    // Filter orders to only include items belonging to this vendor for revenue calculation
    const vendorOrders = allOrders.map(order => {
      const vendorItems = order.items.filter(item => item.vendorId === vendorId);
      const vendorTotal = vendorItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      
      // Ensure customer object exists and has a name field for the frontend tables
      const customer = order.customer ? {
        ...order.customer,
        name: `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() || order.customer.name || "Guest Customer"
      } : {
        name: "Guest Customer"
      };

      return {
        ...order,
        items: vendorItems,
        vendorTotal,
        total: vendorTotal, // Override total for the frontend table component
        customer
      };
    });

    const totalRevenue = vendorOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, o) => acc + (o.vendorTotal || 0), 0);
    
    const totalEarnings = vendorOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, o) => acc + (o.vendorPayout || (o.vendorTotal * 0.9 || 0)), 0);

    const { startDate: startDateParam, endDate: endDateParam } = req.query;
    let rangeStart, rangeEnd;
    if (startDateParam && endDateParam) {
      const [sYear, sMonth, sDay] = startDateParam.split("-").map(Number);
      const [eYear, eMonth, eDay] = endDateParam.split("-").map(Number);
      rangeStart = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0);
      rangeEnd = new Date(eYear, eMonth - 1, eDay, 23, 59, 59, 999);
    } else {
      rangeEnd = new Date();
      rangeStart = new Date();
      rangeStart.setDate(rangeStart.getDate() - 6);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd.setHours(23, 59, 59, 999);
    }

    const dayRange = [];
    const cursor = new Date(rangeStart);
    cursor.setHours(0, 0, 0, 0);
    while (cursor <= rangeEnd) {
      dayRange.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    const revenueData = dayRange.map((d) => ({
      date: d.toISOString(),
      revenue: vendorOrders
        .filter((o) => {
          const od = new Date(o.date);
          return (
            o.status !== "Cancelled" &&
            od.getDate() === d.getDate() &&
            od.getMonth() === d.getMonth() &&
            od.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, o) => sum + (o.vendorTotal || 0), 0),
    }));

    const productSales = {};
    vendorOrders.forEach((order) => {
      if (order.status === "Cancelled") return;
      order.items?.forEach((item) => {
        if (!productSales[item.name])
          productSales[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            image: item.image,
          };
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.totalPrice;
      });
    });

    const topProductsByQuantity = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const topProductsByRevenue = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const recentOrders = [...vendorOrders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    const categorySales = {};
    const hourCounts = {};
    for (let i = 0; i < 24; i++)
      hourCounts[i.toString().padStart(2, "0") + ":00"] = 0;
    
    vendorOrders.forEach((order) => {
      const hour = new Date(order.date).getHours().toString().padStart(2, "0") + ":00";
      if (hourCounts[hour] !== undefined) hourCounts[hour]++;
      
      if (order.status !== "Cancelled") {
        order.items?.forEach((item) => {
          const cat = products.find((p) => p.title === item.name)?.category || "General";
          categorySales[cat] = (categorySales[cat] || 0) + (item.totalPrice || 0);
        });
      }
    });

    const grossRevenue = vendorOrders.reduce((acc, o) => acc + (o.vendorTotal || 0), 0);
    const cancelledRevenue = grossRevenue - totalRevenue;
    const nonCancelledOrders = vendorOrders.filter((o) => o.status !== "Cancelled");
    const averageOrderValue = nonCancelledOrders.length > 0 ? totalRevenue / nonCancelledOrders.length : 0;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating]++;
    });

    const sentimentMap = { good: 0, bad: 0, neutral: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 4) sentimentMap.good++;
      else if (r.rating <= 2) sentimentMap.bad++;
      else sentimentMap.neutral++;
    });

    return res.json({
      totalOrders: vendorOrders.length,
      cancelledOrders: vendorOrders.filter((o) => o.status === "Cancelled").length,
      totalRevenue,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      grossRevenue,
      cancelledRevenue,
      averageOrderValue,
      recentOrders,
      revenueData,
      topProductsByQuantity,
      topProductsByRevenue,
      products,
      ratingDistribution,
      totalReviews: reviews.length,
      productSentiment: [], // Optional: needs per-product breakdown if desired
      reviews,
      categorySalesData: Object.entries(categorySales)
        .map(([c, v]) => ({ category: c, value: v }))
        .sort((a, b) => b.value - a.value),
      orderVelocityData: Object.entries(hourCounts).map(([h, c]) => ({
        hour: h,
        count: c,
      })),
      categories,
      outstandingCommission: vendorDoc?.vendorProfile?.outstandingCommission || 0,
    });
  } catch (error) {
    console.error("Vendor stats error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
