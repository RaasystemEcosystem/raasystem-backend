const express = require('express');
const Trade = require('../models/Trade');
const router = express.Router();

// Create a trade
router.post('/', async (req, res) => {
  try {
    const { strategy_id, action, amount, price, status } = req.body;
    const trade = new Trade({ strategy_id, action, amount, price, status });
    await trade.save();
    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create trade', error });
  }
});

// Get all trades
router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find().populate('strategy_id');
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trades', error });
  }
});

module.exports = router;
