// src/controllers/raasController.js
const RAAS = require('../models/raas');

module.exports = {
  price: async (req, res) => {
    const price = await RAAS.getCurrentPrice();
    res.json({ price });
  },

  mint: async (req, res) => {
    const { wallet_address, amount } = req.body;
    const minted = await RAAS.mint(wallet_address, amount);
    res.json(minted);
  },

  burn: async (req, res) => {
    const { wallet_address, amount } = req.body;
    const burned = await RAAS.burn(wallet_address, amount);
    res.json({ status: "success", burned });
  }
};
