// routes/marketData.js
const express = require('express');
const router = express.Router();
const RabexABI = require('../abi/Rabex.json');   // You must save your compiled ABI here
const { ethers } = require('ethers');

// Connect to your XDC testnet provider
const provider = new ethers.providers.JsonRpcProvider('https://erpc.apothem.network'); 

// Rabex contract address from your deployed contracts
const RABEX_CONTRACT_ADDRESS = '0xdbb02cfc864c3d0b485a3f0cdf45eeccc573a212';

// Create contract instance
const rabex = new ethers.Contract(RABEX_CONTRACT_ADDRESS, RabexABI, provider);

// GET /api/market-data/live
router.get('/live', async (req, res) => {
  try {
    // Example calls — replace with actual Rabex contract methods
    const marketDepth = await rabex.getMarketDepth(); 
    const lastPrice = await rabex.getLastPrice();  

    res.json({
      marketDepth,
      lastPrice
    });
  } catch (error) {
    console.error('Failed to fetch Rabex market data:', error);
    res.status(500).json({ error: 'Failed to fetch Rabex market data' });
  }
});

module.exports = router;
