const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 8000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  XDC_RPC_URL: process.env.XDC_RPC_URL,
  GOLD_ORACLE_CONTRACT_ADDRESS: process.env.GOLD_ORACLE_CONTRACT_ADDRESS,
  MINTER_PRIVATE_KEY: process.env.MINTER_PRIVATE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  ICE_WS_URL: process.env.ICE_WS_URL,
  ICE_API_KEY: process.env.ICE_API_KEY,
};
