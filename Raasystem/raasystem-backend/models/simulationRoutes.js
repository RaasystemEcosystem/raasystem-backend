const express = require('express');
const Simulation = require('../models/Simulation');
const router = express.Router();

// Create a simulation
router.post('/', async (req, res) => {
  try {
    const { strategy_id, result } = req.body;
    const simulation = new Simulation({ strategy_id, result });
    await simulation.save();
    res.status(201).json(simulation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create simulation', error });
  }
});

// Get all simulations
router.get('/', async (req, res) => {
  try {
    const simulations = await Simulation.find().populate('strategy_id');
    res.status(200).json(simulations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch simulations', error });
  }
});

module.exports = router;
