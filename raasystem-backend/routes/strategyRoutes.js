const express = require('express');
const Strategy = require('../models/Strategy');
const router = express.Router();

// Create a strategy
router.post('/', async (req, res) => {
  try {
    const { name, description, parameters } = req.body;
    const strategy = new Strategy({ name, description, parameters });
    await strategy.save();
    res.status(201).json(strategy);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create strategy', error });
  }
});

// Get all strategies
router.get('/', async (req, res) => {
  try {
    const strategies = await Strategy.find();
    res.status(200).json(strategies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch strategies', error });
  }
});

module.exports = router;
