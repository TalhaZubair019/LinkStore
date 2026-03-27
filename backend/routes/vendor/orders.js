const express = require("express");
const { connectDB } = require("../../lib/db");
const { OrderModel, ProductModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");
const { transporter } = require("../../lib/mailer");
const { logActivity } = require("../../lib/activityLog");

const router = express.Router();

const TRACKING_STEPS = [
  "Pending",
  "Processing",
  "Accepted",
  "Shipped",
  "Arrived in Country",
  "Arrived in City",
  "Out for Delivery",
  "Delivered",
];

router.get("/", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const vendorId = req.user.id;

    const orders = await OrderModel.find({ "items.vendorId": vendorId })
      .sort({ date: -1 })
      .lean();
    const filteredOrders = orders.map((order) => {
      const vendorItems = (order.items || []).filter(
        (item) => item.vendorId === vendorId,
      );

      const vendorSubtotal = vendorItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        return sum + price * qty;
      }, 0);

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

      const vendorStatus =
        (order.vendorStatuses || []).find((vs) => vs.vendorId === vendorId)
          ?.status || order.status;

      return {
        ...order,
        items: vendorItems,
        vendorSubtotal,
        total: vendorSubtotal,
        customer,
        status: vendorStatus,
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
  const trackUrl = `${appUrl}/user?tab=orders&orderId=${order.id}`;
  const activeTotal = (order.items || []).reduce((sum, item) => {
    const vendorStatus = (order.vendorStatuses || []).find(
      (vs) => vs.vendorId === item.vendorId,
    )?.status;
    if (vendorStatus === "Cancelled") return sum;
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject} - LinkStore</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; background-color: #f8fafc; color: #1e293b; }
    .wrapper { width: 100%; padding: 40px 20px; box-sizing: border-box; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #f1f5f9; }
    .header { background: #ffffff; padding: 48px 40px 32px; text-align: center; }
    .header h1 { color: #7c3aed; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.025em; }
    .header p { margin: 12px 0 0; font-size: 16px; color: #64748b; font-weight: 500; }
    .content { padding: 0 40px 40px; }
    .status-badge { display: inline-block; padding: 8px 16px; background: #f5f3ff; color: #7c3aed; border-radius: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 32px; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
    .value { font-size: 14px; color: #1e293b; font-weight: 700; line-height: 1.5; }
    .order-card { background: #f8fafc; border-radius: 20px; padding: 24px; margin-bottom: 32px; border: 1px solid #f1f5f9; }
    .btn { background: #7c3aed; color: #ffffff; padding: 16px 32px; border-radius: 16px; text-decoration: none; font-size: 15px; font-weight: 700; display: inline-block; }
    .items-table { width: 100%; border-collapse: collapse; }
    .items-table td { padding: 12px 0; border-bottom: 1px solid #f8fafc; }
    .total-row { margin-top: 24px; padding-top: 16px; border-top: 1px dashed #e2e8f0; display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #7c3aed; }
    .footer { padding: 32px 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f8fafc; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>LinkStore</h1>
        <p>Order Update</p>
      </div>
      <div class="content">
        <div style="text-align: center;">
          <div class="status-badge" style="background:${content.color}20; color:${content.color}; border: 1px solid ${content.color}30;">${status}</div>
        </div>

        <h2 style="color: #1e293b; font-size: 22px; font-weight: 800; text-align: center; margin: 24px 0 16px;">${content.headline}</h2>
        <p style="color: #64748b; line-height: 1.7; font-size: 15px; text-align: center; margin-bottom: 32px;">${content.message}</p>

        <div class="order-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Order Number</span>
              <div style="font-size: 16px; font-weight: 800; color: #1e293b;">#${order.id.slice(-8).toUpperCase()}</div>
            </div>
            <a href="${trackUrl}" class="btn" style="padding: 10px 20px; font-size: 13px;">Track Order</a>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Purchased Items</div>
          <table class="items-table">
            <tbody>
              ${(order.items || []).map((i) => {
                const vendorStatus = (order.vendorStatuses || []).find(vs => vs.vendorId === i.vendorId)?.status;
                const isCancelled = vendorStatus === "Cancelled";
                const price = Number(i.price) || 0;
                const qty = Number(i.quantity) || 1;
                return `
                  <tr>
                    <td style="color: ${isCancelled ? '#94a3b8' : '#1e293b'}; font-weight: 700; font-size: 14px; text-decoration: ${isCancelled ? 'line-through' : 'none'};">
                      ${i.name || "Product"}
                      <div style="font-size:12px; font-weight:500; color:#64748b; text-decoration: none;">${qty} × $${price.toFixed(2)}</div>
                    </td>
                    <td style="text-align: right; color: ${isCancelled ? '#94a3b8' : '#1e293b'}; font-weight: 800; font-size: 14px; text-decoration: ${isCancelled ? 'line-through' : 'none'};">
                      $${(isCancelled ? 0 : price * qty).toFixed(2)}
                    </td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
          <div class="total-row">
            <span>Grand Total</span>
            <span>$${activeTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} LinkStore Marketplace. All rights reserved.</p>
        <p style="margin-top: 8px;">Need help? Reply to this email or visit our help center.</p>
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

    const existingOrder = await OrderModel.findOne({
      id: req.params.id,
      "items.vendorId": req.user.id,
    }).lean();
    if (!existingOrder)
      return res.status(404).json({ message: "Order not found" });

    const oldGlobalStatus = existingOrder.status;

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { id: req.params.id, "vendorStatuses.vendorId": req.user.id },
      { $set: { "vendorStatuses.$.status": status } },
      { returnDocument: "after" },
    ).lean();

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    const activeVendorStatuses = updatedOrder.vendorStatuses.filter(
      (vs) => vs.status !== "Cancelled",
    );
    let newGlobalStatus = oldGlobalStatus;

    if (activeVendorStatuses.length === 0) {
      newGlobalStatus = "Cancelled";
    } else {
      const allPending = activeVendorStatuses.every(
        (vs) => vs.status === "Pending",
      );
      const anyPending = activeVendorStatuses.some(
        (vs) => vs.status === "Pending",
      );
      const allAcceptedOrBeyond = activeVendorStatuses.every(
        (vs) =>
          TRACKING_STEPS.indexOf(vs.status) >=
          TRACKING_STEPS.indexOf("Accepted"),
      );

      if (allPending) {
        newGlobalStatus = "Pending";
      } else if (anyPending) {
        newGlobalStatus = "Processing";
      } else if (allAcceptedOrBeyond) {
        let minIndex = TRACKING_STEPS.length - 1;
        activeVendorStatuses.forEach((vs) => {
          const index = TRACKING_STEPS.indexOf(vs.status);
          if (index !== -1 && index < minIndex) {
            minIndex = index;
          }
        });
        newGlobalStatus = TRACKING_STEPS[minIndex];
      }
    }

    const globalStatusChanged = newGlobalStatus !== oldGlobalStatus;

    const historyEntry = {
      status: newGlobalStatus,
      message: globalStatusChanged
        ? `Order status is now ${newGlobalStatus}`
        : `A vendor updated their portion of your order to ${status}`,
      timestamp: new Date(),
    };

    const finalOrder = await OrderModel.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: { status: newGlobalStatus },
        $push: { trackingHistory: historyEntry },
      },
      { returnDocument: "after" },
    ).lean();

    if (!finalOrder)
      return res.status(404).json({ message: "Order not found" });

    if (status === "Cancelled") {
      try {
        const vendorItems = (finalOrder.items || []).filter(
          (item) => item.vendorId === req.user.id,
        );

        for (const item of vendorItems) {
          if (
            item.fulfilledFromWarehouse &&
            Array.isArray(item.fulfilledFromWarehouse)
          ) {
            const product = await ProductModel.findOne({
              id: item.productId || item.id,
            });
            if (!product) continue;

            let updatedInventory = [...(product.warehouseInventory || [])];
            let restockAmount = 0;

            for (const fulfillment of item.fulfilledFromWarehouse) {
              const whIndex = updatedInventory.findIndex(
                (wh) =>
                  wh.warehouseName === fulfillment.warehouseName &&
                  wh.location === fulfillment.location,
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
        console.error(
          "Failed to restore stock for cancelled vendor items:",
          restockErr,
        );
      }
    }

    const milestones = ["Accepted", "Delivered", "Cancelled"];
    if (globalStatusChanged && milestones.includes(newGlobalStatus)) {
      try {
        const emailHtml = buildEmailHtml(
          finalOrder,
          newGlobalStatus,
          req.headers.origin,
        );
        const content = getStatusContent(newGlobalStatus, finalOrder);

        transporter
          .sendMail({
            from: `"LinkStore" <${process.env.EMAIL_USER}>`,
            to: finalOrder.customer?.email,
            subject: content.subject,
            html: emailHtml,
          })
          .catch((e) => console.error("Tracking email error:", e));
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
