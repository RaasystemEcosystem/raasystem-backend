// src/routes/raaspay.js
const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();

// GET: health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// GET: list payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: create payment
router.post('/transfer', async (req, res) => {
  try {
    const { from, to, amount, currency } = req.body;
    const payment = new Payment({
      from,
      to,
      amount,
      currency: currency || 'RAASKOIN',
      txHash: '0xFAKE' + Date.now()
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: fake balance
router.get('/balance/:address', (req, res) => {
  res.json({ address: req.params.address, balance: (Math.random() * 100).toFixed(2) });
});

module.exports = router;

