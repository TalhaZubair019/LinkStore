const express = require("express");
const { connectDB } = require("../../lib/db");
const {
  UserModel,
  OrderModel,
  ProductModel,
  ReviewModel,
  CategoryModel,
} = require("../../lib/models");
const { requireAdmin } = require("../../middleware/auth");

const router = express.Router();
const ADMIN_EMAIL = process.env.EMAIL_USER;

router.get("/", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const [users, orders, products, reviews, categories] = await Promise.all([
      UserModel.find({}).lean(),
      OrderModel.find({}).lean(),
      ProductModel.find({}).lean(),
      ReviewModel.find({}).lean(),
      CategoryModel.find({}).sort({ name: 1 }).lean(),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, o) => acc + (o.total || 0), 0);

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
      revenue: orders
        .filter((o) => {
          const od = new Date(o.date);
          return (
            o.status !== "Cancelled" &&
            od.getDate() === d.getDate() &&
            od.getMonth() === d.getMonth() &&
            od.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, o) => sum + (o.total || 0), 0),
    }));

    const productSales = {};
    orders.forEach((order) => {
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

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((order) => {
        const liveCustomer = users.find((u) => u.id === order.userId);
        return {
          ...order,
          customer: {
            name: order.customer?.firstName
              ? `${order.customer.firstName} ${order.customer.lastName}`
              : liveCustomer?.name || order.customer?.name || "Unknown",
            email: order.customer?.email || liveCustomer?.email || "Unknown",
            address: order.customer?.address || liveCustomer?.address || "",
            city: order.customer?.city || liveCustomer?.city || "",
            country: order.customer?.country || liveCustomer?.country || "",
          },
        };
      });

    const usersWithDetails = users.map((user) => {
      const { password, ...rest } = user;
      const isAdmin = !!user.isAdmin || user.email === ADMIN_EMAIL;
      const adminRole = user.email === ADMIN_EMAIL ? "super_admin" : user.isAdmin ? "admin" : null;
      return {
        ...rest,
        isAdmin,
        adminRole,
        cartCount: user.cart?.length || 0,
        wishlistCount: user.wishlist?.length || 0,
      };
    });

    const categorySales = {};
    const hourCounts = {};
    for (let i = 0; i < 24; i++)
      hourCounts[i.toString().padStart(2, "0") + ":00"] = 0;
    const perCategoryStats = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const cat = products.find((p) => p.title === item.name)?.badge || "General";
        if (!perCategoryStats[cat]) {
          perCategoryStats[cat] = { totalRevenue: 0, units: 0, orders: new Set(), fulfilledOrders: new Set(), totalItems: 0, fulfilledItems: 0 };
        }
        
        perCategoryStats[cat].totalItems++;
        perCategoryStats[cat].units += (item.quantity || 1);
        perCategoryStats[cat].orders.add(order.id);

        if (order.status !== "Cancelled") {
          perCategoryStats[cat].fulfilledItems++;
          perCategoryStats[cat].fulfilledOrders.add(order.id);
          perCategoryStats[cat].totalRevenue += (item.totalPrice || 0);
        }
      });

      const hour = new Date(order.date).getHours().toString().padStart(2, "0") + ":00";
      if (hourCounts[hour] !== undefined) hourCounts[hour]++;
      
      if (order.status !== "Cancelled") {
        order.items?.forEach((item) => {
          const cat = products.find((p) => p.title === item.name)?.badge || "General";
          categorySales[cat] = (categorySales[cat] || 0) + (item.totalPrice || 0);
        });
      }
    });

    const categoryPerformance = {
      topSeller: { label: "N/A", value: 0 },
      mostPopular: { label: "N/A", value: 0 },
      highestValue: { label: "N/A", value: 0 },
      bestFulfillment: { label: "N/A", value: 0 }
    };

    const catStatsArray = Object.entries(perCategoryStats).map(([cat, stats]) => {
      const fulfillmentRate = stats.totalItems > 0 ? (stats.fulfilledItems / stats.totalItems) * 100 : 0;
      const aov = stats.fulfilledOrders.size > 0 ? stats.totalRevenue / stats.fulfilledOrders.size : 0;
      return {
        category: cat,
        revenue: stats.totalRevenue,
        units: stats.units,
        aov,
        fulfillmentRate
      };
    });

    if (catStatsArray.length > 0) {
      const topSeller = [...catStatsArray].sort((a, b) => b.revenue - a.revenue)[0];
      const mostPopular = [...catStatsArray].sort((a, b) => b.units - a.units)[0];
      const highestValue = [...catStatsArray].sort((a, b) => b.aov - a.aov)[0];
      const bestFulfillment = [...catStatsArray].sort((a, b) => b.fulfillmentRate - a.fulfillmentRate)[0];

      categoryPerformance.topSeller = { label: topSeller.category, value: topSeller.revenue };
      categoryPerformance.mostPopular = { label: mostPopular.category, value: mostPopular.units };
      categoryPerformance.highestValue = { label: highestValue.category, value: highestValue.aov };
      categoryPerformance.bestFulfillment = { label: bestFulfillment.category, value: Math.round(bestFulfillment.fulfillmentRate) };
    }

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating]++;
    });

    const reviewCounts = {};
    reviews.forEach((r) => {
      reviewCounts[r.productId] = (reviewCounts[r.productId] || 0) + 1;
    });
    const topReviewedProducts = Object.entries(reviewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, count]) => {
        const p = products.find((p) => p.id === parseInt(productId));
        return {
          name: p?.title || `Product ${productId}`,
          image: p?.image || "",
          count,
        };
      });

    const sentimentMap = {};
    reviews.forEach((r) => {
      if (!sentimentMap[r.productId])
        sentimentMap[r.productId] = { good: 0, bad: 0, neutral: 0 };
      if (r.rating >= 4) sentimentMap[r.productId].good++;
      else if (r.rating <= 2) sentimentMap[r.productId].bad++;
      else sentimentMap[r.productId].neutral++;
    });
    const productSentiment = Object.entries(sentimentMap)
      .map(([pid, counts]) => {
        const p = products.find((p) => p.id === parseInt(pid));
        return {
          name: p?.title || `Product ${pid}`,
          image: p?.image || "",
          ...counts,
          total: counts.good + counts.bad + counts.neutral,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const grossRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const cancelledRevenue = grossRevenue - totalRevenue;
    const nonCancelledOrders = orders.filter((o) => o.status !== "Cancelled");
    const averageOrderValue = nonCancelledOrders.length > 0 ? totalRevenue / nonCancelledOrders.length : 0;

    const totalAdmins = users.filter((u) => u.isAdmin || u.email === ADMIN_EMAIL).length;
    const totalVendors = users.filter((u) => u.vendorProfile?.status !== "none").length;
    const pendingVendors = users.filter((u) => u.vendorProfile?.status === "pending").length;

    return res.json({
      totalUsers: users.length,
      totalAdmins,
      totalVendors,
      pendingVendors,
      totalOrders: orders.length,
      cancelledOrders: orders.filter((o) => o.status === "Cancelled").length,
      totalRevenue,
      grossRevenue,
      cancelledRevenue,
      averageOrderValue,
      recentOrders,
      users: usersWithDetails,
      revenueData,
      topProductsByQuantity,
      topProductsByRevenue,
      products,
      ratingDistribution,
      topReviewedProducts,
      totalReviews: reviews.length,
      productSentiment,
      reviews,
      categorySalesData: Object.entries(categorySales)
        .map(([c, v]) => ({ category: c, value: v }))
        .sort((a, b) => b.value - a.value),
      categoryInventoryData: Object.entries(
        products.reduce((acc, p) => {
          const cat = p.category || (p.badges && p.badges[0]) || "General";
          acc[cat] = (acc[cat] || 0) + (p.stockQuantity || 0);
          return acc;
        }, {}),
      )
        .map(([c, v]) => ({ category: c, value: v }))
        .sort((a, b) => b.value - a.value),
      orderVelocityData: Object.entries(hourCounts).map(([h, c]) => ({
        hour: h,
        count: c,
      })),
      categoryPerformance,
      categories,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
