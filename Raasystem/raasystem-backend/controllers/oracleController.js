const oracleService = require('../services/oracleService');

exports.getGoldPrice = async (req, res) => {
  try {
    const price = await oracleService.fetchGoldPrice();
    res.json({ goldPrice: price });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gold price' });
  }
};
