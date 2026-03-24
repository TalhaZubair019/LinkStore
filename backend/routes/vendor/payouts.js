const express = require("express");
const Stripe = require("stripe");
const { connectDB } = require("../../lib/db");
const { VendorModel } = require("../../lib/models");
const { requireVendor } = require("../../middleware/vendor");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/vendor/payouts/onboard
router.post("/onboard", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const user = await VendorModel.findOne({ id: req.user.id });

    let stripeAccountId = user.vendorProfile?.stripeAccountId;

    // 1. Create Stripe Account if not exists
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        email: user.email,
        metadata: { userId: user.id }
      });
      stripeAccountId = account.id;
      user.vendorProfile.stripeAccountId = stripeAccountId;
      await user.save();
    }

    // 2. Create Account Link for onboarding
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
    
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${appUrl}/vendor/settings?stripe=refresh`,
      return_url: `${appUrl}/vendor/settings?stripe=success`,
      type: "account_onboarding",
    });

    return res.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Onboard Error:", error);
    return res.status(500).json({ error: "Failed to initiate Stripe onboarding" });
  }
});

// GET /api/vendor/payouts/status
router.get("/status", requireVendor, async (req, res) => {
  try {
    await connectDB();
    const user = await VendorModel.findOne({ id: req.user.id });
    const stripeAccountId = user.vendorProfile?.stripeAccountId;

    if (!stripeAccountId) {
      return res.json({ stripeOnboardingComplete: false });
    }

    // Retrieve account from Stripe to check status
    const account = await stripe.accounts.retrieve(stripeAccountId);

    const isComplete = account.details_submitted && account.charges_enabled && account.payouts_enabled;

    if (isComplete && !user.vendorProfile.stripeOnboardingComplete) {
      user.vendorProfile.stripeOnboardingComplete = true;
      await user.save();
    }

    return res.json({ 
      stripeOnboardingComplete: user.vendorProfile.stripeOnboardingComplete,
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled
    });
  } catch (error) {
    console.error("Stripe Status Error:", error);
    return res.status(500).json({ error: "Failed to check Stripe status" });
  }
});

module.exports = router;
