// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching products.' });
  }
});

// POST a new product
router.post('/', async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const product = new Product({ name, price, description });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: 'Invalid product data.' });
  }
});

module.exports = router;
