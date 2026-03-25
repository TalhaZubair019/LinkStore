const express = require("express");
const { connectDB } = require("../../lib/db");
const { OrderModel, ProductModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { transporter } = require("../../lib/mailer");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

const TRACKING_STEPS = [
  "Pending",
  "Accepted",
  "Shipped",
  "Arrived in Country",
  "Arrived in City",
  "Out for Delivery",
  "Delivered",
];

// Get all orders for the current vendor
router.get("/", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const vendorId = req.user.id;

    // Fetch orders that contain at least one item from this vendor
    const orders = await OrderModel.find({ "items.vendorId": vendorId })
      .sort({ date: -1 })
      .lean();

    // Map through orders to filter items and calculate vendor-specific subtotal
    const filteredOrders = orders.map((order) => {
      // Only include items belonging to this vendor
      const vendorItems = (order.items || []).filter(
        (item) => item.vendorId === vendorId,
      );

      // Calculate revenue (subtotal) for this vendor only
      const vendorSubtotal = vendorItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        return sum + price * qty;
      }, 0);

      // Ensure customer object exists and has a name field for shared dashboard tables
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

      // Get vendor-specific status for this order
      const vendorStatus =
        (order.vendorStatuses || []).find((vs) => vs.vendorId === vendorId)
          ?.status || order.status;

      return {
        ...order,
        items: vendorItems,
        vendorSubtotal,
        total: vendorSubtotal, // Override total for the frontend table component
        customer,
        status: vendorStatus, // Override main status with vendor-specific status for the list view
      };
    });

    return res.json({ orders: filteredOrders });
  } catch (error) {
    console.error("Fetch vendor orders error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

function getStatusContent(status, order) {
  let country = order.customer?.country || "your country";
  if (country === "PK") country = "Pakistan";
  const city = order.customer?.city || "your city";
  const firstName = order.customer?.firstName || "Customer";

  const map = {
    Pending: {
      subject: `Order #${order.id.slice(-8).toUpperCase()} Received`,
      headline: "Order Received! 📦",
      message: `Hi ${firstName},<br><br>We've received your order and it's now being processed. We'll notify you as it progresses.`,
      color: "#f59e0b",
    },
    Accepted: {
      subject: `Order #${order.id.slice(-8).toUpperCase()} Accepted ✅`,
      headline: "Order Accepted! ✅",
      message: `Hi ${firstName},<br><br>Great news! Your order has been confirmed and our team is now preparing it for shipment.`,
      color: "#10b981",
    },
    Shipped: {
      subject: `Your Order Has Been Shipped! 🚚`,
      headline: "Your Order Is On Its Way! 🚚",
      message: `Hi ${firstName},<br><br>Your package has been handed over to the courier and is on its way to you. You'll receive further updates as it travels.`,
      color: "#6366f1",
    },
    "Arrived in Country": {
      subject: `Package Arrived in ${country} 🌍`,
      headline: `Package Landed in ${country}! 🌍`,
      message: `Hi ${firstName},<br><br>Great news — your package has arrived in <strong>${country}</strong> and is now being processed by local customs/logistics.`,
      color: "#8b5cf6",
    },
    "Arrived in City": {
      subject: `Package Arrived in ${city} 📍`,
      headline: `Package Arrived in ${city}! 📍`,
      message: `Hi ${firstName},<br><br>Your package has arrived in <strong>${city}</strong> and is now at a local sorting facility. Delivery is very close!`,
      color: "#ec4899",
    },
    "Out for Delivery": {
      subject: `Out for Delivery — Expect It Today! 🏠`,
      headline: "Out for Delivery! 🏠",
      message: `Hi ${firstName},<br><br>Your package is out for delivery today! Our courier is on the way to your address. Please make sure someone is available to receive it.`,
      color: "#f97316",
    },
    Delivered: {
      subject: `Order Delivered Successfully! 🎉`,
      headline: "Order Delivered! 🎉",
      message: `Hi ${firstName},<br><br>Your order has been delivered successfully. We hope you love what you ordered! Thank you for shopping with LinkStore.`,
      color: "#10b981",
    },
    Cancelled: {
      subject: `Order #${order.id.slice(-8).toUpperCase()} Cancelled`,
      headline: "Order Cancelled",
      message: `Hi ${firstName},<br><br>We're sorry to inform you that your order has been cancelled. If you have any questions, please contact our support team.`,
      color: "#ef4444",
    },
  };

  return (
    map[status] || {
      subject: `Order Status Updated — ${status}`,
      headline: `Order Status: ${status}`,
      message: `Hi ${firstName},<br><br>Your order status has been updated to <strong>${status}</strong>.`,
      color: "#64748b",
    }
  );
}

function buildEmailHtml(order, status, baseUrl) {
  const content = getStatusContent(status, order);
  const appUrl = (
    baseUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
  const trackUrl = `${appUrl}/account?tab=orders&orderId=${order.id}`;

  // Recalculate Grand Total based on active (non-cancelled) items
  const activeTotal = (order.items || []).reduce((sum, item) => {
    const vendorStatus = (order.vendorStatuses || []).find(vs => vs.vendorId === item.vendorId)?.status;
    if (vendorStatus === "Cancelled") return sum;
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + (price * qty);
  }, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject} - LinkStore</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;">
  <div style="width:100%;padding:40px 16px;box-sizing:border-box;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#ec4899 100%);padding:48px 40px;text-align:center;">
        <div style="font-size:40px;margin-bottom:12px;">📦</div>
        <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">${content.headline}</h1>
        <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.85);font-weight:500;">LinkStore Studio Order Update</p>
      </div>

      <!-- Body -->
      <div style="padding:40px;">
        <!-- Message -->
        <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 32px;">${content.message}</p>

        <!-- Order ID badge -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px 20px;margin-bottom:32px;display:flex;align-items:center;gap:12px;">
          <div style="background:${content.color};border-radius:8px;padding:8px;display:inline-block;">
            <span style="color:#fff;font-size:16px;">🧾</span>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:2px;">Order ID</div>
            <div style="font-size:16px;font-weight:800;color:#1e293b;">#${order.id.slice(-8).toUpperCase()}</div>
          </div>
          <div style="margin-left:auto;">
            <span style="display:inline-block;padding:6px 14px;background:${content.color};color:#fff;border-radius:999px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;">${status}</span>
          </div>
        </div>

        <!-- Track Order Button -->
        <div style="text-align:center;margin:32px 0;">
          <a href="${trackUrl}" style="background:linear-gradient(135deg,#6366f1 0%,#a855f7 100%);color:#ffffff;padding:16px 36px;border-radius:14px;text-decoration:none;font-size:15px;font-weight:800;display:inline-block;box-shadow:0 10px 20px rgba(99,102,241,0.2);">
            Track Your Order 📍
          </a>
          <p style="font-size:12px;color:#94a3b8;margin-top:14px;">View live updates and delivery history in your dashboard</p>
        </div>

        <!-- Order Summary -->
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #f1f5f9;">Order Summary</div>
          <table cellpadding="0" cellspacing="0" style="width:100%;">
            <tbody>
              ${(order.items || [])
                .map((i) => {
                  const vendorStatus = (order.vendorStatuses || []).find(vs => vs.vendorId === i.vendorId)?.status;
                  const isCancelled = vendorStatus === "Cancelled";
                  const price = Number(i.price) || 0;
                  const qty = Number(i.quantity) || 1;
                  const itemTotal = isCancelled ? 0 : price * qty;
                  
                  const textStyle = isCancelled ? 'color:#ef4444;text-decoration:line-through;' : 'color:#374151;';
                  const nameLabel = isCancelled ? `${i.name || "Custom Product"} <span style="font-size:10px;font-weight:800;text-decoration:none;display:inline-block;">(Cancelled)</span>` : (i.name || "Custom Product");

                  return `<tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f8fafc;font-size:14px;font-weight:600;${textStyle}">
                    ${nameLabel}<br>
                    <span style="font-size:12px;font-weight:400;color:#94a3b8;text-decoration:none;display:inline-block;">Qty: ${qty} × $${price.toFixed(2)}</span>
                  </td>
                  <td style="padding:12px 0;border-bottom:1px solid #f8fafc;text-align:right;font-size:14px;font-weight:700;${textStyle}">$${itemTotal.toFixed(2)}</td>
                </tr>`;
                })
                .join("")}
              <tr>
                <td style="padding-top:16px;font-size:16px;font-weight:800;color:#6366f1;">Grand Total</td>
                <td style="padding-top:16px;text-align:right;font-size:16px;font-weight:800;color:#6366f1;">$${activeTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style="text-align:center;font-size:13px;color:#94a3b8;margin-top:40px;font-weight:500;">Thank you for shopping with LinkStore Studio!</p>
      </div>

      <!-- Footer -->
      <div style="padding:24px 40px;background:#f8fafc;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} LinkStore Studio. All rights reserved.</p>
        <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">Questions? Reply to this email or contact support.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

router.patch("/:id", requireVendor, async (req, res) => {
  try {
    const { status } = req.body;
    await connectDB();

    // 1. Fetch order and verify vendor ownership
    const existingOrder = await OrderModel.findOne({
      id: req.params.id,
      "items.vendorId": req.user.id,
    }).lean();
    if (!existingOrder)
      return res.status(404).json({ message: "Order not found" });

    const oldGlobalStatus = existingOrder.status;

    // 2. Update individual vendor status first
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { id: req.params.id, "vendorStatuses.vendorId": req.user.id },
      { $set: { "vendorStatuses.$.status": status } },
      { returnDocument: "after" },
    ).lean();

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    // 3. Calculate "Lowest Common Denominator" Global Status
    const activeVendorStatuses = updatedOrder.vendorStatuses.filter(vs => vs.status !== "Cancelled");
    let newGlobalStatus = oldGlobalStatus;

    if (activeVendorStatuses.length === 0) {
      newGlobalStatus = "Cancelled";
    } else {
      // Find the minimum index in TRACKING_STEPS among active vendors
      let minIndex = TRACKING_STEPS.length - 1;
      activeVendorStatuses.forEach(vs => {
        const index = TRACKING_STEPS.indexOf(vs.status);
        // If a vendor is still "Pending", that's naturally the lowest
        if (index !== -1 && index < minIndex) {
          minIndex = index;
        }
      });
      newGlobalStatus = TRACKING_STEPS[minIndex];
    }

    const globalStatusChanged = newGlobalStatus !== oldGlobalStatus;

    // 4. Tracking History Updates
    const historyEntry = {
      status: newGlobalStatus,
      message: globalStatusChanged 
        ? `Order status is now ${newGlobalStatus}` 
        : `A vendor updated their portion of your order to ${status}`,
      timestamp: new Date(),
    };

    // 5. Update Global Status and History
    const finalOrder = await OrderModel.findOneAndUpdate(
      { id: req.params.id },
      { 
        $set: { status: newGlobalStatus },
        $push: { trackingHistory: historyEntry }
      },
      { returnDocument: "after" }
    ).lean();

    if (!finalOrder) return res.status(404).json({ message: "Order not found" });

    // 6. Fix restocking bug: Filter by vendorId before restocking
    if (status === "Cancelled") {
      try {
        const vendorItems = (finalOrder.items || []).filter(item => item.vendorId === req.user.id);
        
        for (const item of vendorItems) {
          if (item.fulfilledFromWarehouse && Array.isArray(item.fulfilledFromWarehouse)) {
            const product = await ProductModel.findOne({ id: item.productId || item.id });
            if (!product) continue;

            let updatedInventory = [...(product.warehouseInventory || [])];
            let restockAmount = 0;

            for (const fulfillment of item.fulfilledFromWarehouse) {
              const whIndex = updatedInventory.findIndex(
                (wh) => wh.warehouseName === fulfillment.warehouseName && wh.location === fulfillment.location
              );
              if (whIndex !== -1) {
                updatedInventory[whIndex].quantity += fulfillment.qty;
              } else {
                updatedInventory.push({
                  warehouseName: fulfillment.warehouseName,
                  location: fulfillment.location,
                  quantity: fulfillment.qty,
                });
              }
              restockAmount += fulfillment.qty;
            }

            await ProductModel.findOneAndUpdate(
              { id: item.productId || item.id },
              {
                $set: { warehouseInventory: updatedInventory },
                $inc: { stockQuantity: restockAmount },
              },
            );
          } else {
            await ProductModel.findOneAndUpdate(
              { id: item.productId || item.id },
              { $inc: { stockQuantity: item.quantity } },
            );
          }
        }
      } catch (restockErr) {
        console.error("Failed to restore stock for cancelled vendor items:", restockErr);
      }
    }

    // 7. Milestone Email Notifications
    const milestones = ["Accepted", "Delivered", "Cancelled"];
    if (globalStatusChanged && milestones.includes(newGlobalStatus)) {
      try {
        const emailHtml = buildEmailHtml(finalOrder, newGlobalStatus, req.headers.origin);
        const content = getStatusContent(newGlobalStatus, finalOrder);

        transporter.sendMail({
          from: `"LinkStore" <${process.env.EMAIL_USER}>`,
          to: finalOrder.customer?.email,
          subject: content.subject,
          html: emailHtml,
        }).catch((e) => console.error("Tracking email error:", e));
      } catch (emailErr) {
        console.error("Email preparation error:", emailErr);
      }
    }

    await logActivity(req, {
      action: "update",
      entity: "order",
      entityId: req.params.id,
      details: `Vendor ${req.user.name} updated status to "${status}". Global status is now "${newGlobalStatus}".`,
    });

    return res.json({ message: "Order status updated", order: finalOrder });
  } catch (error) {
    console.error("Vendor order patch error:", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
