// src/routes/goldPriceRoute.js
const express = require('express');
const router = express.Router();
const { fetchGoldPrice } = require('../services/goldPriceService');

// @route   GET /api/gold-price
// @desc    Get the latest gold price from the XDC oracle
// @access  Public
router.get('/gold-price', async (req, res) => {
  try {
    const data = await fetchGoldPrice();
    res.status(200).json({
      success: true,
      message: 'Latest gold price fetched successfully',
      data
    });
  } catch (error) {
    console.error('Error fetching gold price:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gold price from oracle',
      error: error.message
    });
  }
});

module.exports = router;
