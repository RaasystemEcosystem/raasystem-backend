const express = require('express');
const router = express.Router();
const { getGoldPrice } = require('../services/goldPriceService');

// Endpoint to fetch the current gold price
router.get('/gold-price', async (req, res) => {
    try {
        const price = await getGoldPrice();
        res.json({ price });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch gold price' });
    }
});

module.exports = router;
