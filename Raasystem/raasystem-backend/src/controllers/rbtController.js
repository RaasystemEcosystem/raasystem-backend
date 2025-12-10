// src/controllers/rbtController.js
const RBT = require('../models/rbt'); // Your RBT model
const RAAS = require('../models/raas'); // For conversions

module.exports = {
  status: (req, res) => {
    res.json({ status: "ok", message: "RBT module active" });
  },

  listHoldings: async (req, res) => {
    const { wallet_address } = req.query;
    const holdings = await RBT.getHoldings(wallet_address); // Implement in model
    res.json(holdings);
  },

  mint: async (req, res) => {
    const { wallet_address, amount, composition } = req.body;
    const minted = await RBT.mint(wallet_address, amount, composition);
    res.json(minted);
  },

  burn: async (req, res) => {
    const { wallet_address, amount } = req.body;
    const burned = await RBT.burn(wallet_address, amount);
    res.json({ status: "success", burned });
  },

  adjust: async (req, res) => {
    const { wallet_address, composition } = req.body;
    const adjusted = await RBT.adjustComposition(wallet_address, composition);
    res.json(adjusted);
  },

  value: async (req, res) => {
    const { wallet_address } = req.query;
    const total_rbt = await RBT.getTotalValue(wallet_address);
    res.json({ wallet_address, total_rbt });
  },

  composition: async (req, res) => {
    const { wallet_address } = req.query;
    const composition = await RBT.getComposition(wallet_address);
    res.json(composition);
  },

  transfer: async (req, res) => {
    const { fromWallet, toWallet, amount } = req.body;
    const transfer = await RBT.transfer(fromWallet, toWallet, amount);
    res.json(transfer);
  },

  supply: async (req, res) => {
    const total_supply = await RBT.getTotalSupply();
    res.json({ total_supply });
  },

  convertFromRAAS: async (req, res) => {
    const { from, to, amount, wallet_address } = req.body;
    if (from !== 'RAAS' || to !== 'RBT') {
      return res.status(400).json({ error: "Only RAAS → RBT conversion allowed" });
    }
    const conversion = await RBT.convertFromRAAS(wallet_address, amount);
    res.json(conversion);
  }
};
