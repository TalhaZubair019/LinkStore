const express = require("express");
const Stripe = require("stripe");
const { connectDB } = require("../lib/db");
const { ProductModel } = require("../lib/models");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/checkout
router.post("/checkout", async (req, res) => {
  try {
    const { items, customerEmail, orderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required." });
    }

    await connectDB();
    // Verify stock and collect vendor info
    for (const item of items) {
      const dbProduct = await ProductModel.findOne({ id: item.id }).lean();
      if (!dbProduct) {
        return res.status(400).json({ error: `Item "${item.name}" is no longer available.` });
      }
      
      const currentStock = dbProduct.stockQuantity || 0;
      if (item.quantity > currentStock) {
        return res.status(400).json({ error: `Sorry, we only have ${currentStock} of "${item.name}" left in stock.` });
      }
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

    const ensureAbsoluteUrl = (url) => {
      if (!url) return url;
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      const baseUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
      const path = url.startsWith("/") ? url : `/${url}`;
      return `${baseUrl}${path}`;
    };

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [ensureAbsoluteUrl(item.image)] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    // Create a unique transfer group for this order
    const transferGroup = `ORDER_${orderId || Date.now()}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: orderId,
      payment_intent_data: {
        transfer_group: transferGroup,
      },
      success_url: `${ensureAbsoluteUrl("/thank-you")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ensureAbsoluteUrl("/checkout")}`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// WEBHOOK HANDLER (Automated Payouts)
// Note: This route requires raw body. We'll handle body parsing in server.js or via specific middleware
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.client_reference_id;
    const transferGroup = session.payment_intent_data?.transfer_group || session.transfer_group;

    try {
      const { OrderModel, UserModel } = require("../lib/models");
      await connectDB();
      
      const order = await OrderModel.findOne({ id: orderId });
      if (!order) {
        console.error(`Webhook: Order ${orderId} not found`);
        return res.status(404).json({ error: "Order not found" });
      }

      // Calculate payouts per vendor
      const vendorPayouts = {};
      for (const item of order.items) {
        if (!item.vendorId) continue;
        const amount = Math.round(item.price * item.quantity * 100);
        vendorPayouts[item.vendorId] = (vendorPayouts[item.vendorId] || 0) + amount;
      }

      // Execute transfers
      for (const [vendorId, totalAmount] of Object.entries(vendorPayouts)) {
        const vendor = await UserModel.findOne({ id: vendorId });
        
        if (vendor?.vendorProfile?.stripeAccountId && vendor.vendorProfile.stripeOnboardingComplete) {
          // Calculate 90% for vendor (10% platform fee)
          const transferAmount = Math.round(totalAmount * 0.9);
          
          await stripe.transfers.create({
            amount: transferAmount,
            currency: "usd",
            destination: vendor.vendorProfile.stripeAccountId,
            transfer_group: transferGroup,
            description: `Payout for order #${orderId}`,
            metadata: { orderId: orderId }
          });
          
          console.log(`Sent transfer of $${(transferAmount / 100).toFixed(2)} to vendor ${vendorId}`);
        } else {
          console.warn(`Vendor ${vendorId} not eligible for automatic payout (Stripe not connected)`);
        }
      }
    } catch (err) {
      console.error("Error processing webhook payouts:", err.message);
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  res.json({ received: true });
});

module.exports = router;
