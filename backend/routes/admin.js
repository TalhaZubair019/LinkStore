const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const { Product, Store, User, Order } = require("../models");

// Get all vendors with their stores
router.get("/vendors", [verifyToken, isAdmin], async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("-password").lean();
    const vendorIds = vendors.map(v => v._id);
    const stores = await Store.find({ vendorId: { $in: vendorIds } }).lean();
    
    const vendorsWithStores = vendors.map(vendor => ({
      ...vendor,
      store: stores.find(s => s.vendorId.toString() === vendor._id.toString()) || null
    }));
    
    res.json(vendorsWithStores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Vendor/Store status (suspend/activate)
router.put("/vendors/:id/status", [verifyToken, isAdmin], async (req, res) => {
  try {
    const { isActive } = req.body;
    const store = await Store.findOneAndUpdate(
      { vendorId: req.params.id },
      { isActive },
      { new: true }
    );
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// moderation routes: Update product status (approve/reject)
router.put("/products/:id/status", [verifyToken, isAdmin], async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Marketplace Analytics
router.get("/marketplace-stats", [verifyToken, isAdmin], async (req, res) => {
  try {
    const orders = await Order.find({ status: "completed" });
    const totalGMV = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const platformRevenue = totalGMV * 0.1; // 10% commission

    const users = await User.countDocuments();
    const vendors = await User.countDocuments({ role: "vendor" });
    const products = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: "pending" });

    res.json({
      totalGMV,
      platformRevenue,
      users,
      vendors,
      products,
      pendingProducts,
      recentOrders: await Order.find().sort({ createdAt: -1 }).limit(5).populate("customerId", "name")
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Stats
router.get("/stats", [verifyToken, isAdmin], async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const storeCount = await Store.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    res.json({
      users: userCount,
      stores: storeCount,
      products: productCount,
      orders: orderCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
