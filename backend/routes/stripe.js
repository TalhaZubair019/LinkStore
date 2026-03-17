const express = require("express");
const Stripe = require("stripe");
const { connectDB } = require("../lib/db");
const { ProductModel } = require("../lib/models");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
  try {
    const { items, customerEmail, orderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required." });
    }

    await connectDB();
    for (const item of items) {
      const dbProduct = await ProductModel.findOne({ id: item.id }).lean();
      if (!dbProduct) {
        return res.status(400).json({ 
          error: `Item "${item.name}" is no longer available.` 
        });
      }
      
      const currentStock = dbProduct.stockQuantity || 0;
      if (item.quantity > currentStock) {
        return res.status(400).json({
          error: `Sorry, we only have ${currentStock} of "${item.name}" left in stock.`
        });
      }
    }

    const appUrl = (
      req.headers.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

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
          images:
            item.image && item.image.length < 2000
              ? [ensureAbsoluteUrl(item.image)]
              : [],
        },

        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: orderId,
      success_url: `${ensureAbsoluteUrl("/thank-you")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ensureAbsoluteUrl("/checkout")}`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;
