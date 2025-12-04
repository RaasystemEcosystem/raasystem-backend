const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// ✅ Load environment variables
dotenv.config();

// ------------------- Environment Validation -------------------
const requiredEnv = ['MONGO_URI', 'PORT', 'GOLD_ORACLE_CONTRACT_ADDRESS'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ ${key} is not defined in .env. Exiting...`);
    process.exit(1);
  }
});

// ------------------- Routes -------------------
const rbtRoutes = require(path.join(__dirname, '../routes/rbt'));
const raaspayRoutes = require(path.join(__dirname, '../routes/raaspay'));
const oracleRoutes = require(path.join(__dirname, '../routes/oracle'));

// ------------------- ICE Adapter -------------------
const ICEAdapter = require(path.join(__dirname, 'adapters/iceAdapter'));
let ice;

const useMockICE = process.env.MOCK_ICE === 'true';
const iceWsUrl = useMockICE
  ? 'ws://host.docker.internal:8081' // For Docker containers connecting to host
  : process.env.ICE_WS_URL;
const iceApiKey = useMockICE ? 'mock-key' : process.env.ICE_API_KEY;

if (!iceWsUrl || !iceApiKey) {
  console.error('❌ ICE WebSocket URL or API key missing. Exiting...');
  process.exit(1);
}

try {
  ice = new ICEAdapter({
    wsUrl: iceWsUrl,
    apiKey: iceApiKey
  });

  ice.on('open', () => {
    const subscribedSymbols = ['AAPL', 'TSLA', 'GOOGL'];
    ice.subscribeToMarkets(subscribedSymbols);
    console.log('✅ Subscribed to ICE markets:', subscribedSymbols.join(', '));
  });

  ice.on('marketData', data => {
    console.log('🟢 ICE Market Update:', data.symbol, 'Bid:', data.bid, 'Ask:', data.ask);
  });

  ice.on('error', err => console.error('❌ ICE WebSocket error:', err));
  ice.on('close', () => console.warn('⚠️ ICE WebSocket disconnected'));

} catch (err) {
  console.error('❌ Failed to initialize ICE Adapter:', err);
  process.exit(1);
}

// ------------------- Arbitrage Service -------------------
const ArbitrageService = require(path.join(__dirname, '../services/arbitrageService'));
const arbitrage = new ArbitrageService({
  iceAdapter: ice,
  spreadThreshold: 0.2
});

arbitrage.on('signal', signal => {
  console.log('🚀 Arbitrage Signal:', signal);
  arbitrage.executeTrade(signal);
});

// ------------------- Express App -------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ------------------- Arbitrage Endpoint -------------------
app.get('/api/arbitrage/signals', (req, res) => {
  const signals = arbitrage.getLatestSignals();
  if (!signals.length) return res.status(404).json({ message: 'No arbitrage signals currently' });
  res.json(signals);
});

// ------------------- Root & Health -------------------
app.get('/', (req, res) => res.send('✅ Raasystem Backend API is running. Visit /api/docs for Swagger UI.'));
app.get('/api/raaspay/health', (req, res) => res.json({ status: 'ok' }));

// ------------------- Swagger -------------------
const swaggerDocument = require(path.join(__dirname, '../docs/swagger.json'));
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/docs/swagger.json', (req, res) => res.json(swaggerDocument));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: { url: '/api/docs/swagger.json' }
  }));
}

// ------------------- Other Routes -------------------
app.use('/api/rbt', rbtRoutes);
app.use('/api/raaspay', raaspayRoutes);
app.use('/api/oracle', oracleRoutes);

// ------------------- MongoDB -------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📊 Swagger docs at http://0.0.0.0:${PORT}/api/docs`);
  }
});
