const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

// ✅ Routes
const rrwaRoutes = require('../server/routes/rrwaRoutes');
const raaspayRoutes = require('./routes/raaspay');
const oracleRoutes = require('./routes/oracle');

// ✅ Adapters
const AlpacaAdapter = require('../server/adapters/alpacaAdapter');

// Optional ICE Adapter only if configured
let ICEAdapter, ice = null;
if (process.env.ICE_WS_URL) {
  ICEAdapter = require('../server/adapters/iceAdapter');
  ice = new ICEAdapter({
    wsUrl: process.env.ICE_WS_URL,
    apiKey: process.env.ICE_API_KEY
  });

  const subscribedSymbols = ['AAPL', 'TSLA', 'GOOGL'];
  ice.subscribeToMarkets(subscribedSymbols);
  ice.on('marketData', data => {
    console.log('🟢 ICE Market Update:', data.symbol, 'Bid:', data.bid, 'Ask:', data.ask);
  });
} else {
  console.warn('⚠️ ICE WS URL not defined — ICEAdapter skipped.');
}

// ✅ Services
const ArbitrageService = require('../services/arbitrageService');

// ✅ Load environment variables
dotenv.config();

// ✅ Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ----------------- Alpaca Adapter -----------------
const alpaca = new AlpacaAdapter({
  keyId: process.env.ALPACA_KEY,
  secretKey: process.env.ALPACA_SECRET,
  paper: true,
  baseUrl: process.env.APCA_API_BASE_URL,
  retryLimit: 3
});

// --------- Stock Endpoints ----------
app.get('/api/stocks/price', (req, res) => {
  const { symbol } = req.query;
  const quote = alpaca.getQuote(symbol);
  if (!quote) return res.status(404).json({ error: 'Quote not found' });
  res.json(quote);
});

app.post('/api/stocks/order', async (req, res) => {
  const { symbol, qty, side, type, action, orderId } = req.body;
  try {
    if (action === 'cancel') {
      const result = await alpaca.cancelOrder(orderId);
      return res.json(result);
    }
    const order = await alpaca.placeOrder(symbol, qty, side, type);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------- ICE Market Feed Endpoint ----------
if (ice) {
  app.get('/api/stocks/market-feed', (req, res) => {
    const { symbol } = req.query;
    const data = ice.getMarketData(symbol);
    if (!data) return res.status(404).json({ error: 'Market data not available' });
    res.json(data);
  });
}

// ----------------- Arbitrage Service -----------------
const arbitrage = new ArbitrageService({
  alpacaAdapter: alpaca,
  iceAdapter: ice,
  spreadThreshold: 0.2
});

arbitrage.on('signal', signal => {
  console.log('🚀 Arbitrage Signal:', signal);
  arbitrage.executeTrade(signal);
});

app.get('/api/arbitrage/signals', (req, res) => {
  const signals = arbitrage.getLatestSignals();
  if (!signals.length) return res.status(404).json({ message: 'No arbitrage signals currently' });
  res.json(signals);
});

// ✅ Root & Swagger
app.get('/', (req, res) => res.send('✅ Raasystem Backend API is running. Visit /api/docs for Swagger UI.'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Other Routes
app.use('/api/rrwa', rrwaRoutes);
app.use('/api/raaspay', raaspayRoutes);
app.use('/api/oracle', oracleRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// ✅ Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Swagger docs at http://localhost:${PORT}/api/docs`);
});
