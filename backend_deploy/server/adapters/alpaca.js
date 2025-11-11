const axios = require('axios');

const ALPACA_BASE = 'https://paper-api.alpaca.markets';

async function placeAlpacaOrder(symbol, qty, side = 'buy') {
  try {
    const res = await axios.post(`${ALPACA_BASE}/v2/orders`, {
      symbol,
      qty,
      side,
      type: 'market',
      time_in_force: 'gtc',
    }, {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_KEY,
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    console.error('Alpaca order error', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { placeAlpacaOrder };
