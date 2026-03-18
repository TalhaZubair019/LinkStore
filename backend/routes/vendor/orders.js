const express = require("express");
const { connectDB } = require("../../lib/db");
const { OrderModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

// Get orders containing items from this vendor
router.get("/", requireVendor, async (req, res) => {
  try {
    await connectDB();
    // In a real marketplace, an order might have items from multiple vendors.
    // We fetch orders where at least one item has the vendor's ID.
    const orders = await OrderModel.find({
      "items.vendorId": req.user.id
    }).sort({ createdAt: -1 }).lean();

    // Optionally filter out items that don't belong to this vendor for privacy
    const filteredOrders = orders.map(order => ({
      ...order,
      items: order.items.filter(item => item.vendorId === req.user.id)
    }));

    return res.json({ orders: filteredOrders });
  } catch (error) {
    console.error("Fetch vendor orders error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

// Update vendor-specific status for an order
router.patch("/:orderId/status", requireVendor, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    await connectDB();
    const order = await OrderModel.findOne({ id: orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ensure this vendor has items in this order
    const hasVendorItems = order.items.some(item => item.vendorId === req.user.id);
    if (!hasVendorItems) {
      return res.status(403).json({ message: "Forbidden: Order does not contain your items" });
    }

    // Find or create the vendorStatus entry
    let vendorStatusEntry = order.vendorStatuses.find(vs => vs.vendorId === req.user.id);
    if (vendorStatusEntry) {
      vendorStatusEntry.status = status;
    } else {
      order.vendorStatuses.push({
        vendorId: req.user.id,
        status: status
      });
    }

    await order.save();

    await logActivity(req, {
      action: "update",
      entity: "order",
      entityId: orderId,
      details: `Vendor ${req.vendor.vendorProfile.storeName} updated order part status to "${status}"`,
    });

    return res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Vendor update order status error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
