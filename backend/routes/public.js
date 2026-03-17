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

// GET /api/public/search - Advanced search and filtering
router.get('/products/search/all', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    
    // Build filter query
    const query = { status: 'approved' };
    
    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Build sort options
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    
    const products = await Product.find(query)
      .populate('storeId', 'name slug logoUrl')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));
      
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/public/products/:id - Fetch single product details with vendor info
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('storeId', 'name slug logoUrl description');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
