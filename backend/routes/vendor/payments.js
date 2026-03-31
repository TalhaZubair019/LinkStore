const express = require("express");
const Stripe = require("stripe");
const { transporter } = require("../../lib/mailer");
const { requireVendor } = require("../../middleware/vendor");
const { VendorModel } = require("../../lib/models");
const { connectDB } = require("../../lib/db");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/create-commission-checkout", requireVendor, async (req, res) => {
  try {
    const vendorId = req.user.id;
    await connectDB();
    const vendor = await VendorModel.findOne({ id: vendorId }).lean();

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const amount = vendor.vendorProfile.outstandingCommission || 0;
    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "No outstanding commission to pay." });
    }

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Plateform Commission Payment",
              description: `Settlement for outstanding COD commission balance for ${vendor.vendorProfile.storeName}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        type: "commission_payment",
        vendorId: vendorId,
      },
      success_url: `${appUrl}/vendor/commission-success?session_id={CHECKOUT_SESSION_ID}`,
       cancel_url: `${appUrl}/vendor/dashboard?tab=commission&stripe=cancel`,
     });
 
     res.json({ url: session.url });
   } catch (error) {
     console.error("Commission checkout error:", error);
     res.status(500).json({ message: "Failed to create checkout session" });
   }
 });
 
 router.post("/create-wallet-topup", requireVendor, async (req, res) => {
  try {
    const { amount } = req.body;
    const vendorId = req.user.id;

    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ message: "Invalid top-up amount (min $1)." });
    }

    await connectDB();
    const vendor = await VendorModel.findOne({ id: vendorId }).lean();
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Vendor Wallet Top-up",
              description: `Adding funds to ${vendor.vendorProfile.storeName} wallet balance.`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        type: "wallet_topup",
        vendorId: vendorId,
        amount: amount,
      },
      success_url: `${appUrl}/vendor/commission-success?session_id={CHECKOUT_SESSION_ID}&type=wallet_topup`,
      cancel_url: `${appUrl}/vendor/dashboard?tab=commission&stripe=cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Wallet top-up checkout error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
});

module.exports = router;
