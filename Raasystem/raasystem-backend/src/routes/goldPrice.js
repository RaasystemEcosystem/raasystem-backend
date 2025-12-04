const express = require('express');
const { getGoldPrice } = require('../services/goldPriceService'); // We'll create this service next
const router = express.Router();

// Route to fetch the latest gold price from the Oracle
router.get('/gold-price', async (req, res) => {
    try {
        const price = await getGoldPrice();
        res.json({ goldPrice: price });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gold price' });
    }
});

module.exports = router;
