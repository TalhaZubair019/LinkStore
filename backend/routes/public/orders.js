const express = require("express");
const jwt = require("jsonwebtoken");
const { connectDB } = require("../../lib/db");
const { OrderModel, UserModel, AdminModel, VendorModel, ProductModel } = require("../../lib/models");
const { requireAuth, JWT_SECRET } = require("../../middleware/auth");
const { transporter } = require("../../lib/mailer");
const db = require("../../../data/db.json");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    await connectDB();
    const orders = await OrderModel.find({ userId: req.user.id }).lean();
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.post("/place-order", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    await connectDB();
    const shopProducts = await ProductModel.find({}).lean();
    const dbProducts = db.products?.products || [];
    const allValidProducts = [...shopProducts, ...dbProducts];
    const validProductIds = allValidProducts.map((p) => p.id);

    for (const item of items) {
      if (!validProductIds.includes(item.id)) {
        return res.status(400).json({
          error: `Product "${item.name}" is no longer available. Please remove it from your cart.`,
        });
      }
    }

    let userId = "guest";
    const authHeader = req.headers["authorization"];
    const cookieHeader = req.headers["cookie"] || "";
    const cookieMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
    const token =
      (authHeader || "").replace("Bearer ", "") ||
      (cookieMatch ? cookieMatch[1] : null);

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (_) {}
    }

    let fulfillmentDetails = [];

    for (const item of items) {
      const product = await ProductModel.findOne({ id: item.id });
      if (!product) continue;

      let remainingToFulfill = item.quantity;
      const itemFulfillmentList = [];
      let updatedInventory = [...(product.warehouseInventory || [])];

      for (let i = 0; i < updatedInventory.length; i++) {
        if (remainingToFulfill <= 0) break;

        const wh = updatedInventory[i];
        if (wh.quantity > 0) {
          const deduction = Math.min(wh.quantity, remainingToFulfill);
          wh.quantity -= deduction;
          remainingToFulfill -= deduction;

          itemFulfillmentList.push({
            warehouseName: wh.warehouseName,
            location: wh.location,
            qty: deduction,
          });
        }
      }

      if (remainingToFulfill > 0) {
        return res.status(400).json({
          error: `Insufficient stock to fulfill ${item.name}.`,
          shortfall: remainingToFulfill,
        });
      }

      const newTotalStock = updatedInventory.reduce(
        (acc, curr) => acc + curr.quantity,
        0,
      );
      try {
        await ProductModel.findOneAndUpdate(
          { id: item.id },
          {
            $set: { warehouseInventory: updatedInventory },
            $inc: { stockQuantity: -item.quantity },
          },
        );

        if (newTotalStock <= (product.lowStockThreshold || 5)) {
          console.log(
            `[ALERT] Product ${product.title} (ID: ${product.id}) is low on stock: ${newTotalStock} remaining.`,
          );

          const alertHtml = `
            <h2>Low Stock Alert</h2>
            <p><strong>Product:</strong> ${product.title} (SKU: ${product.sku || "N/A"})</p>
            <p><strong>Remaining Stock:</strong> ${newTotalStock} (Threshold: ${product.lowStockThreshold || 5})</p>
            <p>Please restock this item soon to avoid turning away customers.</p>
          `;

          transporter
            .sendMail({
              from: `"Store Alerts" <${process.env.EMAIL_USER}>`,
              to: process.env.EMAIL_USER,
              subject: `⚠️ Low Stock Alert: ${product.title}`,
              html: alertHtml,
            })
            .catch((e) => console.error("Alert email error:", e));
        }
      } catch (err) {
        console.error(`Failed to deduct stock for ${item.name}`, err);
        return res
          .status(500)
          .json({ error: "Checkout failed during inventory reservation." });
      }

      fulfillmentDetails.push({
        productId: item.id,
        name: item.name,
        vendorId: product.vendorId,
        vendorStoreName: product.vendorStoreName,
        fulfilledFromWarehouse: itemFulfillmentList,
      });
    }

    const itemsWithFulfillment = items.map((item) => {
      const match = fulfillmentDetails.find((f) => f.productId === item.id);
      if (match) {
        return {
          ...item,
          vendorId: match.vendorId,
          vendorStoreName: match.vendorStoreName,
          fulfilledFromWarehouse: match.fulfilledFromWarehouse,
        };
      }
      return item;
    });

    // Dynamically generate vendorStatuses for multi-vendor tracking
    const uniqueVendorIds = [
      ...new Set(itemsWithFulfillment.map((item) => item.vendorId)),
    ].filter(Boolean);
    const vendorStatuses = uniqueVendorIds.map((vId) => ({
      vendorId: vId,
      status: "Pending",
    }));

    const orderId = Date.now().toString();
    let trackingNumber = "Pending";
    let trackingUrl = "";
    const newOrder = {
      id: orderId,
      userId,
      date: new Date().toLocaleString(),
      status: "Pending",
      total: totalAmount,
      items: itemsWithFulfillment,
      customer,
      trackingNumber,
      trackingUrl,
      vendorStatuses, // Added for multi-vendor fulfillment
      trackingHistory: [
        {
          status: "Pending",
          message: "Order Placed Successfully",
          timestamp: new Date(),
        },
      ],
    };

    await connectDB();
    await OrderModel.create(newOrder);

    if (userId !== "guest") {
      await Promise.all([
        UserModel.findOneAndUpdate({ id: userId }, { cart: [] }),
        AdminModel.findOneAndUpdate({ id: userId }, { cart: [] }),
        VendorModel.findOneAndUpdate({ id: userId }, { cart: [] })
      ]);
    }

    try {
      // Group items by vendor for individual notifications
      const itemsByVendor = itemsWithFulfillment.reduce((acc, item) => {
        if (item.vendorId) {
          if (!acc[item.vendorId]) acc[item.vendorId] = [];
          acc[item.vendorId].push(item);
        }
        return acc;
      }, {});

      // Function to generate email HTML for a specific set of items
      const generateEmailHtml = (orderItems, isVendor = false) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${isVendor ? "New Order" : "Order Confirmation"} - LinkStore</title>
          <style>
            body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; }
            .wrapper { width: 100%; padding: 40px 20px; box-sizing: border-box; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 60px 40px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.2; }
            .header p { margin: 12px 0 0; font-size: 16px; opacity: 0.9; font-weight: 500; }
            .content { padding: 40px; }
            .status-badge { display: inline-block; padding: 6px 14px; background: #f0fdf4; color: #166534; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 32px; }
            .section { margin-bottom: 40px; }
            .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
            .info-grid { width: 100%; border-collapse: collapse; margin-top: 8px; }
            .info-grid td { padding-bottom: 24px; vertical-align: top; width: 50%; }
            .label { font-size: 12px; color: #94a3b8; font-weight: 600; margin-bottom: 4px; display: block; }
            .value { font-size: 15px; color: #1e293b; font-weight: 600; line-height: 1.5; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            .items-table th { text-align: left; font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9; }
            .items-table td { padding: 20px 0; border-bottom: 1px solid #f1f5f9; }
            .product-name { font-size: 15px; font-weight: 700; color: #1e293b; display: block; }
            .product-qty { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; display: block; }
            .price { font-size: 15px; font-weight: 700; color: #1e293b; text-align: right; }
            .summary-box { background: #f8fafc; border-radius: 16px; padding: 24px; margin-top: 24px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #64748b; }
            .summary-row.total { margin-top: 16px; padding-top: 16px; border-top: 1px dashed #cbd5e1; font-size: 20px; font-weight: 800; color: #6366f1; }
            .footer { padding: 40px; text-align: center; color: #94a3b8; font-size: 13px; font-weight: 500; }
            .footer p { margin: 8px 0; }
            @media (max-width: 600px) { .header { padding: 40px 20px; } .content { padding: 30px 20px; } .info-grid td { width: 100%; display: block; } }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>${isVendor ? "New Order Received!" : "Order Confirmed!"}</h1>
                <p>${isVendor ? "A customer has placed an order from your store." : "We're getting your items ready for delivery."}</p>
              </div>
              <div class="content">
                <div class="status-badge">${isVendor ? "Action Required" : "Processing Order"}</div>

                <div class="section">
                  <div class="section-title">Order Information</div>
                  <table class="info-grid">
                    <tr>
                      <td>
                        <span class="label">Order ID</span>
                        <span class="value">#${orderId}</span>
                      </td>
                      <td>
                        <span class="label">Order Date</span>
                        <span class="value">${newOrder.date}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Payment Method</span>
                        <span class="value">${customer.paymentMethod?.toUpperCase()}</span>
                      </td>
                      <td>
                        <span class="label">Customer Email</span>
                        <span class="value">${customer.email}</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="section">
                  <div class="section-title">Shipping Address</div>
                  <div class="value">
                    ${customer.firstName} ${customer.lastName}<br>
                    ${customer.address}${customer.apartment ? `, ${customer.apartment}` : ""}<br>
                    ${customer.city}, ${customer.province} ${customer.postcode}<br>
                    ${customer.country}
                  </div>
                </div>

                <div class="section" style="margin-bottom: 0;">
                  <div class="section-title">${isVendor ? "Items to Fulfill" : "Order Summary"}</div>
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th style="text-align: right;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${orderItems
                        .map((i) => {
                          const price = Number(i.price) || 0;
                          const qty = Number(i.quantity) || 1;
                          return `
                          <tr>
                            <td>
                              <span class="product-name">${i.name || "Custom Product"}</span>
                              <span class="product-qty">Quantity: ${qty} × $${price.toFixed(2)}</span>
                            </td>
                            <td class="price">$${(price * qty).toFixed(2)}</td>
                          </tr>
                        `;
                        })
                        .join("")}
                    </tbody>
                  </table>

                  <div class="summary-box">
                    <div class="summary-row total">
                      <span>${isVendor ? "Your Subtotal" : "Grand Total"}</span>
                      <span>$${orderItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} LinkStore. All rights reserved.</p>
                <p>If you have any questions, reply to this email or contact support.</p>
              </div>
            </div>
          </div>
        </body>
        </html>`;

      // 1. Send customer confirmation email (full order)
      transporter.sendMail({
        from: `"LinkStore" <${process.env.EMAIL_USER}>`,
        to: customer.email,
        subject: `Order Confirmation #${orderId}`,
        html: generateEmailHtml(itemsWithFulfillment, false),
      }).catch(e => console.error("Customer email error:", e));

      // 2. Send individual vendor notifications
      for (const [vendorId, vendorItems] of Object.entries(itemsByVendor)) {
        try {
          const vendor = await VendorModel.findOne({ id: vendorId }).lean();
          if (vendor && vendor.email) {
            transporter.sendMail({
              from: `"LinkStore Marketplace" <${process.env.EMAIL_USER}>`,
              to: vendor.email,
              subject: `New Order #${orderId} - Fulfill Items`,
              html: generateEmailHtml(vendorItems, true),
            }).catch(e => console.error(`Vendor ${vendorId} email error:`, e));
          }
        } catch (fetchErr) {
          console.error(`Failed to fetch vendor ${vendorId} for email:`, fetchErr);
        }
      }

    } catch (e) {
      console.error("Critical error generating email HTML:", e);
    }

    return res.json({ message: "Order placed successfully!", orderId });
  } catch (error) {
    console.error("Place order failed:", error);
    return res.status(500).json({ error: "Failed to place order." });
  }
});

module.exports = router;
