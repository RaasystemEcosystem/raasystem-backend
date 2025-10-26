// src/routes/oracle.js
const express = require('express');
const { getGoldPrice } = require('../services/oracleService');

const router = express.Router();

router.get('/price', async (req, res) => {
  try {
    const price = await getGoldPrice();
    res.json({ price });
  } catch (error) {
    console.error('❌ Error fetching gold price:', error);
    res.status(500).json({ error: 'Failed to fetch gold price' });
  }
});

module.exports = router;
