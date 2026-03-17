const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const axios = require("axios"); // using axios for consistency
const { Order, Product } = require("../models");
const { verifyToken } = require("../middleware/auth");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Checkout Session
router.post("/stripe/create-session", verifyToken, async (req, res) => {
  try {
    const { items, orderId } = req.body;
    
    const lineItems = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: { orderId: orderId.toString() },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PayPal Order Creation
router.post("/paypal/create-order", verifyToken, async (req, res) => {
  try {
    const { totalAmount, orderId } = req.body;
    
    // In a real app, you'd get a PayPal access token first
    // This is a simplified version of the logic found in PrintNest
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
    
    const tokenResponse = await axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token", "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });

    const accessToken = tokenResponse.data.access_token;

    const orderResponse = await axios.post("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: orderId,
        amount: {
          currency_code: "USD",
          value: totalAmount.toFixed(2),
        }
      }],
      application_context: {
        brand_name: "LinkStore",
        return_url: `${process.env.FRONTEND_URL}/thank-you?order=${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      }
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    });

    const approveLink = orderResponse.data.links.find(link => link.rel === "approve");
    res.json({ url: approveLink.href });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
