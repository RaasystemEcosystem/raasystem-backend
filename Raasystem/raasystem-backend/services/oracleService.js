const axios = require('axios');

exports.fetchGoldPrice = async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd');
  return response.data['pax-gold'].usd;
};
