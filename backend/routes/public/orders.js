const express = require("express");
const jwt = require("jsonwebtoken");
const { connectDB } = require("../../lib/db");
const {
  OrderModel,
  UserModel,
  AdminModel,
  VendorModel,
  ProductModel,
} = require("../../lib/models");
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
    const { customer, items, totalAmount, userId = "guest" } = req.body;

    await connectDB();
    const validProductIds = items.map((i) => i.id);

    for (const item of items) {
      if (!validProductIds.includes(item.id)) {
        return res.status(400).json({
          error: `Product "${item.name}" is no longer available. Please remove it from your cart.`,
        });
      }
    }

    let effectiveUserId = userId;
    const authHeader = req.headers["authorization"];
    const cookieHeader = req.headers["cookie"] || "";
    const cookieMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
    const token =
      (authHeader || "").replace("Bearer ", "") ||
      (cookieMatch ? cookieMatch[1] : null);

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        effectiveUserId = decoded.id;
      } catch (_) {}
    }

    const productIds = items.map((i) => i.id);
    const dbProducts = await ProductModel.find({ id: { $in: productIds } });
    
    const fulfillmentDetails = [];
    const bulkUpdateOps = [];

    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.id);
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
      
      bulkUpdateOps.push({
        updateOne: {
          filter: { id: item.id },
          update: {
            $set: { warehouseInventory: updatedInventory },
            $inc: { stockQuantity: -item.quantity },
          }
        }
      });

      // Handle Low Stock Alert (Async)
      if (newTotalStock <= (product.lowStockThreshold || 5)) {
        console.log(
          `[ALERT] Product ${product.title} (ID: ${product.id}) is low on stock: ${newTotalStock} remaining.`,
        );
        VendorModel.findOne({ id: product.vendorId }).lean().then(vendor => {
          const recipientEmail = vendor?.email || process.env.EMAIL_USER;

          const alertHtml = `
            <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #fee2e2; border-radius: 24px; background: #ffffff;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #e11d48; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">LinkStore</h1>
              </div>
              <h2 style="color: #991b1b; font-size: 20px; font-weight: 700; margin-bottom: 16px; text-align: center;">⚠️ Low Stock Alert</h2>
              <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Your product <strong>"${product.title}"</strong> has reached its low stock threshold. Please restock soon to ensure uninterrupted sales.</p>
              
              <div style="background: #fff1f2; padding: 24px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #fecaca;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #991b1b; font-weight: 600;">Remaining Quantity:</td>
                    <td style="padding: 8px 0; font-size: 18px; color: #e11d48; font-weight: 900; text-align: right;">${newTotalStock}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #64748b;">SKU:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: 600; text-align: right;">${product.sku || "N/A"}</td>
                  </tr>
                </table>
              </div>
              
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} LinkStore Inventory Management.</p>
            </div>
          `;

          transporter
            .sendMail({
              from: `"LinkStore" <${process.env.EMAIL_USER}>`,
              to: recipientEmail,
              subject: `⚠️ Low Stock Alert: ${product.title}`,
              html: alertHtml,
            })
            .catch((e) => console.error("Alert email error:", e));
        }).catch(e => console.error("Failed to fetch vendor for low stock alert:", e));
      }

      fulfillmentDetails.push({
        productId: item.id,
        name: item.name,
        vendorId: product.vendorId,
        vendorStoreName: product.vendorStoreName,
        fulfilledFromWarehouse: itemFulfillmentList,
      });
    }

    if (bulkUpdateOps.length > 0) {
      await ProductModel.bulkWrite(bulkUpdateOps);
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
    const uniqueVendorIds = [
      ...new Set(itemsWithFulfillment.map((item) => item.vendorId)),
    ].filter(Boolean);
    const vendorStatuses = uniqueVendorIds.map((vId) => ({
      vendorId: vId,
      status: "Pending",
    }));

    const selectedTotal = Math.round(itemsWithFulfillment.reduce(
      (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0,
    ) * 100) / 100;

    const orderId = Date.now().toString();
    const platformFee = Math.round(selectedTotal * 0.1 * 100) / 100;
    const vendorPayout = Math.round(selectedTotal * 0.9 * 100) / 100;

    const newOrder = {
      id: orderId,
      userId: effectiveUserId,
      customer: {
        ...customer,
        name: `${customer.firstName} ${customer.lastName}`,
      },
      items: itemsWithFulfillment,
      total: selectedTotal,
      platformFee,
      vendorPayout,
      status: "Pending",
      date: new Date().toISOString(),
      vendorStatuses,
      trackingNumber: "Pending",
      trackingUrl: "",
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
    
    // Return response immediately to prevent proxy timeouts
    res.json({ message: "Order placed successfully!", orderId });

    // --- EVERYTHING BELOW RUNS IN BACKGROUND ---
    
    if (effectiveUserId !== "guest") {
      try {
        await Promise.all([
          UserModel.findOneAndUpdate({ id: effectiveUserId }, { cart: [] }),
          AdminModel.findOneAndUpdate({ id: effectiveUserId }, { cart: [] }),
          VendorModel.findOneAndUpdate({ id: effectiveUserId }, { cart: [] }),
        ]);
      } catch (err) { console.error("Failed to clear cart:", err); }
    }

    if (customer.paymentMethod === "cod") {
      const vendorSums = itemsWithFulfillment.reduce((acc, item) => {
        if (item.vendorId) {
          const itemTotal =
            (Number(item.price) || 0) * (Number(item.quantity) || 1);
          acc[item.vendorId] = (acc[item.vendorId] || 0) + itemTotal;
        }
        return acc;
      }, {});

      for (const [vId, vTotal] of Object.entries(vendorSums)) {
        const commission = Math.round(vTotal * 0.1 * 100) / 100;
        try {
          await VendorModel.findOneAndUpdate(
            { id: vId },
            { $inc: { "vendorProfile.outstandingCommission": commission } },
          );
        } catch (err) {
          console.error(`[Commission] Failed to update debt for vendor ${vId}:`, err);
        }
      }
    }

    try {
      const itemsByVendor = itemsWithFulfillment.reduce((acc, item) => {
        if (item.vendorId) {
          if (!acc[item.vendorId]) acc[item.vendorId] = [];
          acc[item.vendorId].push(item);
        }
        return acc;
      }, {});

      const generateEmailHtml = (orderItems, isVendor = false) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${isVendor ? "New Order" : "Order Confirmation"} - LinkStore</title>
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
            .info-grid { width: 100%; border-collapse: collapse; }
            .info-grid td { padding-bottom: 16px; vertical-align: top; width: 50%; }
            .label { font-size: 11px; color: #94a3b8; font-weight: 700; margin-bottom: 4px; display: block; text-transform: uppercase; }
            .value { font-size: 14px; color: #1e293b; font-weight: 700; line-height: 1.5; }
            .items-table { width: 100%; border-collapse: collapse; }
            .items-table td { padding: 16px 0; border-bottom: 1px solid #f8fafc; }
            .product-name { font-size: 14px; font-weight: 700; color: #1e293b; display: block; margin-bottom: 2px; }
            .product-qty { font-size: 12px; color: #64748b; font-weight: 600; }
            .price { font-size: 14px; font-weight: 800; color: #1e293b; text-align: right; }
            .summary-box { background: #f8fafc; border-radius: 20px; padding: 24px; margin-top: 16px; border: 1px solid #f1f5f9; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #64748b; }
            .summary-row.total { margin-top: 16px; padding-top: 16px; border-top: 1px dashed #e2e8f0; font-size: 18px; font-weight: 900; color: #7c3aed; }
            .footer { padding: 32px 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f8fafc; }
            @media (max-width: 600px) { .header { padding: 32px 20px; } .content { padding: 0 24px 32px; } .info-grid td { width: 100%; display: block; } }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>LinkStore</h1>
                <p>${isVendor ? "You have a new order to fulfill." : "Your order has been successfully placed."}</p>
              </div>
              <div class="content">
                <div style="text-align: center;">
                  <div class="status-badge">${isVendor ? "Action Required" : "Confirmed"}</div>
                </div>

                <div class="section">
                  <div class="section-title">Order Details</div>
                  <table class="info-grid">
                    <tr>
                      <td>
                        <span class="label">Order Number</span>
                        <span class="value">#${orderId}</span>
                      </td>
                      <td>
                        <span class="label">Placement Date</span>
                        <span class="value">${newOrder.date}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="label">Payment</span>
                        <span class="value">${customer.paymentMethod?.toUpperCase()}</span>
                      </td>
                      ${!isVendor ? `
                      <td>
                        <span class="label">Contact Email</span>
                        <span class="value">${customer.email}</span>
                      </td>
                      ` : ""}
                    </tr>
                  </table>
                </div>

                <div class="section">
                  <div class="section-title">Shipping To</div>
                  <div class="value">
                    ${customer.firstName} ${customer.lastName}<br>
                    <span style="font-weight: 500; font-size: 13px; color: #64748b;">
                      ${customer.address}${customer.apartment ? `, ${customer.apartment}` : ""}<br>
                      ${customer.city}, ${customer.province} ${customer.postcode}<br>
                      ${customer.country}
                    </span>
                  </div>
                </div>

                <div class="section" style="margin-bottom: 0;">
                  <div class="section-title">${isVendor ? "Items to Fulfill" : "Order Summary"}</div>
                  <table class="items-table">
                    <tbody>
                      ${orderItems.map((i) => {
                        const price = Number(i.price) || 0;
                        const qty = Number(i.quantity) || 1;
                        return `
                          <tr>
                            <td>
                              <span class="product-name">${i.name || "Product"}</span>
                              <span class="product-qty">${qty} unit${qty > 1 ? 's' : ''} × $${price.toFixed(2)}</span>
                            </td>
                            <td class="price">$${(price * qty).toFixed(2)}</td>
                          </tr>
                        `;
                      }).join("")}
                    </tbody>
                  </table>

                  <div class="summary-box">
                    <div class="summary-row total">
                      <span>${isVendor ? "Vendor Total" : "Order Total"}</span>
                      <span>$${orderItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0).toFixed(2)}</span>
                    </div>
                    ${isVendor ? `
                      <div class="summary-row" style="margin-top: 12px; color: #e11d48; font-size: 12px;">
                        <span>Commission (10%)</span>
                        <span>-$${(orderItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0) * 0.1).toFixed(2)}</span>
                      </div>
                      <div style="margin-top: 12px; padding: 12px; background: #ecfdf5; border-radius: 12px; display: flex; justify-content: space-between; font-weight: 900; color: #059669; font-size: 15px;">
                        <span>Your Earnings</span>
                        <span>$${(orderItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0) * 0.9).toFixed(2)}</span>
                      </div>
                    ` : ""}
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

      transporter.sendMail({
        from: `"LinkStore" <${process.env.EMAIL_USER}>`,
        to: customer.email,
        subject: `Order Confirmation #${orderId}`,
        html: generateEmailHtml(itemsWithFulfillment, false),
      }).catch((e) => console.error("Customer email error:", e));

      for (const [vendorId, vendorItems] of Object.entries(itemsByVendor)) {
        VendorModel.findOne({ id: vendorId }).lean()
          .then((vendor) => {
            if (vendor && vendor.email) {
              return transporter.sendMail({
                from: `"LinkStore" <${process.env.EMAIL_USER}>`,
                to: vendor.email,
                subject: `New Order #${orderId} - Fulfill Items`,
                html: generateEmailHtml(vendorItems, true),
              });
            }
          })
          .catch((e) => console.error(`Vendor ${vendorId} email error:`, e));
      }
    } catch (e) {
      console.error("Critical error generating email HTML:", e);
    }
    return; // Already responded
  } catch (error) {
    console.error("Place order failed:", error);
    return res.status(500).json({ error: "Failed to place order." });
  }
});

module.exports = router;
