require('dotenv').config();

module.exports = {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  xdcRpcUrl: process.env.XDC_RPC_URL,
  goldOracleAddress: process.env.GOLD_ORACLE_CONTRACT_ADDRESS,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY
};
