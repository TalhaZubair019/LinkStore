const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken, isVendor } = require('../middleware/auth');
const { Store } = require('../models.js');

// Get Vendor Store
router.get('/my-store', [verifyToken, isVendor], async (req, res) => {
  try {
    const store = await Store.findOne({ vendorId: req.user.id });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Vendor Products
router.get('/my-products', [verifyToken, isVendor], async (req, res) => {
  try {
    const { Product } = require('../models.js'); // Use correct models file
    const store = await Store.findOne({ vendorId: req.user.id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const products = await Product.find({ storeId: store._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Vendor Orders (Sales)
router.get('/my-orders', [verifyToken, isVendor], async (req, res) => {
  try {
    const { Order } = require('../models.js');
    const store = await Store.findOne({ vendorId: req.user.id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // Find orders that contain items from this store
    const orders = await Order.find({ 'items.storeId': store._id })
      .sort({ createdAt: -1 })
      .populate('customerId', 'name email image');
    
    // Filter items to only show those belonging to this store
    const storeOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => item.storeId.toString() === store._id.toString());
      return orderObj;
    });

    res.json(storeOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Vendor Product
router.post('/my-products', [verifyToken, isVendor], async (req, res) => {
  try {
    const { Product } = require('../models.js');
    const store = await Store.findOne({ vendorId: req.user.id });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const product = new Product({
      ...req.body,
      storeId: store._id,
      status: 'pending' // Force pending for admin approval
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
