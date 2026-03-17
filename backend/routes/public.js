const express = require('express');
const router = express.Router();
const { Product, Store } = require('../models');

// GET /api/public/products - Fetch approved products for the homepage
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ status: 'approved' })
      .populate('storeId', 'name slug logoUrl')
      .sort({ createdAt: -1 })
      .limit(12);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/public/categories - Fetch dynamically retrieved categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { status: 'approved' });
    // Structure them into an array of objects for the frontend
    const formattedCategories = categories.map((cat, index) => ({
      id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: cat
    }));
    
    // Prepend 'All Categories' as requested in UI overhaul
    formattedCategories.unshift({ id: 'all', name: 'All Categories' });
    
    res.json(formattedCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
