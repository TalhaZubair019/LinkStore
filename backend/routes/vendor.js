const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken, isVendor } = require('../middleware/auth');
const { Store } = require('../models');

// Vendor Onboarding
router.post('/onboard', [verifyToken, isVendor], async (req, res) => {
  try {
    const store = await Store.findOne({ vendorId: req.user._id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    let stripeAccountId = store.stripeAccountId;

    if (!stripeAccountId) {
      // Create a Stripe Express account
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;
      store.stripeAccountId = stripeAccountId;
      await store.save();
    }

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.FRONTEND_URL}/vendor/onboard`,
      return_url: `${process.env.FRONTEND_URL}/vendor/dashboard`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
