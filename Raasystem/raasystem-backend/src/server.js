<<<<<<< HEAD
// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Import Routes
const rbtRoutes = require('./routes/rbt');
const raasRoutes = require('./routes/raas');

// Mount Routes
app.use('/api/rbt', rbtRoutes);
app.use('/api/raas', raasRoutes);

// Health Check
app.get('/api/raas/status', (req, res) => {
  res.json({ status: "ok", message: "Raasystem Unified Backend running" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error', err));

// Start Server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
=======
// ---------------------------------------------------
// 🌐 Raasystem Unified Backend — Production Build
// ---------------------------------------------------

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

// Load environment variables
dotenv.config();

// ------------------ Routes ------------------
const rbtRoutes = require('./routes/rbt');
const raaspayRoutes = require('./routes/raaspay');
const oracleRoutes = require('./routes/oracle');

// ------------------ Services ------------------
const ArbitrageService = require('./services/arbitrageService');

// ------------------ Optional ICE Adapter ------------------
let ice = null;

if (process.env.ICE_WS_URL && process.env.ICE_API_KEY) {
  console.log("🟢 ICE credentials detected — enabling ICE adapter...");
  const ICEAdapter = require('./adapters/iceAdapter');

  ice = new ICEAdapter({
    wsUrl: process.env.ICE_WS_URL,
    apiKey: process.env.ICE_API_KEY
  });

  const subscribedSymbols = ['AAPL', 'TSLA', 'GOOGL'];
  ice.subscribeToMarkets(subscribedSymbols);
} else {
  console.warn("⚠️ ICE Adapter bypassed — missing ICE_WS_URL or ICE_API_KEY.");
}

// ------------------ Express App ------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ------------------ Arbitrage Engine ------------------
const arbitrage = new ArbitrageService({
  iceAdapter: ice,
  spreadThreshold: 0.3
});

arbitrage.on('signal', signal => {
  console.log('🚀 Arbitrage Signal:', signal);
  arbitrage.executeTrade(signal);
});

// API endpoint to fetch latest arbitrage signals
app.get('/api/arbitrage/signals', (req, res) => {
  const signals = arbitrage.getLatestSignals();
  res.json({ signals });
});

// ------------------ Root & Swagger ------------------
app.get('/', (req, res) =>
  res.send('✅ Raasystem Unified Backend running. Visit /api/docs for Swagger.')
);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ------------------ Main API Routes ------------------
app.use('/api/rbt', rbtRoutes);
app.use('/api/raaspay', raaspayRoutes);
app.use('/api/oracle', oracleRoutes);

// ------------------ MongoDB Connection ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 3007;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📊 Swagger docs at http://localhost:${PORT}/api/docs`);
});
>>>>>>> ecca5b6 (Unified Backend clean production build)
