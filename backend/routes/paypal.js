const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const authString = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("PayPal Auth Failed:", errorData);
    throw new Error(`Failed to authenticate with PayPal: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

router.post("/checkout", async (req, res) => {
  try {
    const { totalAmount, orderId } = req.body;

    if (!totalAmount || !orderId) {
      return res
        .status(400)
        .json({ error: "totalAmount and orderId are required." });
    }

    const clientUrl = (
      req.headers.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

    const accessToken = await getPayPalAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId,
            description: "PrintNest Products",
            amount: {
              currency_code: "USD",
              value: Number(totalAmount).toFixed(2),
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              brand_name: "PrintNest",
              user_action: "PAY_NOW",
              return_url: `${clientUrl}/thank-you?order=${orderId}`,
              cancel_url: `${clientUrl}/checkout?error=paypal_cancelled`,
            },
          },
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error("PayPal Order Failed:", errorData);
      throw new Error(`Failed to create PayPal order: ${orderResponse.status}`);
    }

    const orderData = await orderResponse.json();

    const approveLink = orderData.links?.find(
      (link) => link.rel === "payer-action",
    );

    if (approveLink?.href) {
      return res.json({ url: approveLink.href });
    }

    throw new Error("Could not find the PayPal approve link in the response.");
  } catch (error) {
    console.error("PayPal checkout error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
