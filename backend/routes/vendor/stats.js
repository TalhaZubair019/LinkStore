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
    const products = await ProductModel.find({ vendorId }).lean();
    const productIds = products.map((p) => p.id);

    const [allOrders, allReviews, categories, vendorDoc] =
      await Promise.all([
        OrderModel.find({ "items.vendorId": vendorId }).lean(),
        ReviewModel.find({
          $or: [{ vendorId }, { productId: { $in: productIds } }],
        }).lean(),
        CategoryModel.find({}).sort({ name: 1 }).lean(),
        VendorModel.findOne({ id: vendorId }).lean(),
      ]);

    const productReviews = allReviews.filter((r) => r.targetType === "product");
    const storeReviews = allReviews.filter((r) => r.targetType === "vendor");
    const vendorOrders = allOrders.map((order) => {
      const vendorItems = order.items.filter(
        (item) => item.vendorId === vendorId,
      );
      const vendorTotal = vendorItems.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0,
      );
      const customer = order.customer
        ? {
            ...order.customer,
            name:
              `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() ||
              order.customer.name ||
              "Guest Customer",
          }
        : {
            name: "Guest Customer",
          };

      return {
        ...order,
        items: vendorItems,
        vendorTotal,
        total: vendorTotal,
        customer,
      };
    });

    const totalRevenue = vendorOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, o) => acc + (o.vendorTotal || 0), 0);

    const totalEarnings = vendorOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce(
        (acc, o) => acc + (o.vendorPayout || o.vendorTotal * 0.9 || 0),
        0,
      );

    const grossRevenue = vendorOrders.reduce(
      (acc, o) => acc + (o.vendorTotal || 0),
      0,
    );
    const cancelledRevenue = grossRevenue - totalRevenue;
    const averageOrderValue =
      vendorOrders.filter((o) => o.status !== "Cancelled").length > 0
        ? totalRevenue /
          vendorOrders.filter((o) => o.status !== "Cancelled").length
        : 0;

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

    const productRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const sellerRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    allReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        const rating = Math.floor(r.rating);
        if (r.targetType === "product") {
          productRatingDistribution[rating]++;
        } else if (r.targetType === "vendor") {
          sellerRatingDistribution[rating]++;
        }
      }
    });

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        ratingDistribution[Math.floor(r.rating)]++;
      }
    });

    vendorOrders.forEach((order) => {
      const hour =
        new Date(order.date).getHours().toString().padStart(2, "0") + ":00";
      if (hourCounts[hour] !== undefined) hourCounts[hour]++;

      if (order.status !== "Cancelled") {
        order.items?.forEach((item) => {
          const cat =
            products.find((p) => p.title === item.name)?.category || "General";
          categorySales[cat] =
            (categorySales[cat] || 0) + (item.totalPrice || 0);
        });
      }
    });

    const perCategoryStats = {};
    vendorOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const cat = products.find((p) => p.title === item.name)?.category || "General";
        if (!perCategoryStats[cat]) {
          perCategoryStats[cat] = {
            totalRevenue: 0,
            units: 0,
            orders: new Set(),
            fulfilledOrders: new Set(),
            totalItems: 0,
            fulfilledItems: 0,
          };
        }

        perCategoryStats[cat].totalItems++;
        perCategoryStats[cat].units += item.quantity || 1;
        perCategoryStats[cat].orders.add(order.id);

        if (order.status !== "Cancelled") {
          perCategoryStats[cat].fulfilledItems++;
          perCategoryStats[cat].fulfilledOrders.add(order.id);
          perCategoryStats[cat].totalRevenue += item.totalPrice || 0;
        }
      });
    });

    const categoryPerformance = {
      topSeller: { label: "N/A", value: 0 },
      mostPopular: { label: "N/A", value: 0 },
      highestValue: { label: "N/A", value: 0 },
      bestFulfillment: { label: "N/A", value: 0 },
    };

    const catStatsArray = Object.entries(perCategoryStats).map(([cat, stats]) => {
      const fulfillmentRate = stats.totalItems > 0 ? (stats.fulfilledItems / stats.totalItems) * 100 : 0;
      const aov = stats.fulfilledOrders.size > 0 ? stats.totalRevenue / stats.fulfilledOrders.size : 0;
      return {
        category: cat,
        revenue: stats.totalRevenue,
        units: stats.units,
        aov,
        fulfillmentRate,
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

    const reviewCounts = {};
    allReviews.forEach((r) => {
      if (r.targetType === "product") {
        reviewCounts[r.productId] = (reviewCounts[r.productId] || 0) + 1;
      }
    });

    const topReviewedProducts = Object.entries(reviewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, count]) => {
        const p = products.find((p) => (p.id ? p.id.toString() : p._id.toString()) === productId);
        return {
          name: p?.title || `Product ${productId}`,
          image: p?.image || "",
          count,
        };
      });

    const sentimentMap = {};
    allReviews.forEach((r) => {
      if (r.targetType === "product") {
        if (!sentimentMap[r.productId]) sentimentMap[r.productId] = { good: 0, bad: 0, neutral: 0 };
        if (r.rating >= 4) sentimentMap[r.productId].good++;
        else if (r.rating <= 2) sentimentMap[r.productId].bad++;
        else sentimentMap[r.productId].neutral++;
      }
    });

    const productSentiment = Object.entries(sentimentMap)
      .map(([pid, counts]) => {
        const p = products.find((p) => (p.id ? p.id.toString() : p._id.toString()) === pid);
        return {
          name: p?.title || `Product ${pid}`,
          image: p?.image || "",
          ...counts,
          total: counts.good + counts.bad + counts.neutral,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const statusCounts = {};
    vendorOrders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      if (o.status === "Completed") {
        statusCounts["Delivered"] = (statusCounts["Delivered"] || 0) + 1;
      }
    });

    const aovData = dayRange.map((d) => {
      const dayOrders = vendorOrders.filter((o) => {
        const od = new Date(o.date);
        return (
          o.status !== "Cancelled" &&
          od.getDate() === d.getDate() &&
          od.getMonth() === d.getMonth() &&
          od.getFullYear() === d.getFullYear()
        );
      });
      const revenue = dayOrders.reduce((sum, o) => sum + (o.vendorTotal || 0), 0);
      const count = dayOrders.length;
      return {
        date: d.toISOString(),
        revenue,
        aov: count > 0 ? revenue / count : 0,
        orderCount: count,
      };
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
      revenueData: aovData,
      aovData,
      statusCounts,
      categoryPerformance,
      topProductsByQuantity,
      topProductsByRevenue,
      products,
      ratingDistribution,
      productRatingDistribution,
      sellerRatingDistribution,
      topReviewedProducts,
      totalReviews: allReviews.length,
      productSentiment,
      reviews: productReviews,
      productReviews,
      storeReviews,
      categorySalesData: Object.entries(categorySales)
        .map(([c, v]) => ({ category: c, value: v }))
        .sort((a, b) => b.value - a.value),
      categoryInventoryData: Object.entries(
        products.reduce((acc, p) => {
          const cat = p.category || "General";
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
      categories,
      outstandingCommission: vendorDoc?.vendorProfile?.outstandingCommission || 0,
      totalCommissionPaid: vendorDoc?.vendorProfile?.totalCommissionPaid || 0,
      commissionDeadline: vendorDoc?.vendorProfile?.commissionDeadline || null,
    });
  } catch (error) {
    console.error("Vendor stats error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
