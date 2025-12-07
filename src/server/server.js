// ------------------- Node Modules -------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const http = require('http');
const WebSocket = require('ws');
const os = require('os');

// ------------------- Local Modules -------------------
const ICEAdapter = require('./adapters/iceAdapter.js');
const ArbitrageService = require('../services/arbitrageService.js');
const rbtRoutes = require('../routes/rbt.js');
const raaspayRoutes = require('../routes/raaspay.js');
const oracleRoutes = require('../routes/oracle.js');
const swaggerDocument = require('../docs/swagger.json');

// ------------------- Load environment variables -------------------
dotenv.config();

// ------------------- Environment Validation -------------------
const requiredEnv = ['MONGO_URI', 'PORT', 'GOLD_ORACLE_CONTRACT_ADDRESS'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ ${key} is not defined in .env. Exiting...`);
    process.exit(1);
  }
});

// ------------------- Express App -------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ------------------- WebSocket Server -------------------
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = (data) => {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
};

// ------------------- ICE Adapter -------------------
const useMockICE = process.env.MOCK_ICE === 'true';
const iceWsUrl = useMockICE ? 'ws://host.docker.internal:8081' : process.env.ICE_WS_URL;
const iceApiKey = useMockICE ? 'mock-key' : process.env.ICE_API_KEY;

if (!iceWsUrl || !iceApiKey) {
  console.error('❌ ICE WebSocket URL or API key missing. Exiting...');
  process.exit(1);
}

const ice = new ICEAdapter({ wsUrl: iceWsUrl, apiKey: iceApiKey });

// ------------------- Dynamic ICE Symbols -------------------
let iceSymbols = [];
const symbolsFile = path.join(__dirname, 'config/iceSymbols.json');

const loadSymbols = () => {
  try {
    const data = fs.readFileSync(symbolsFile);
    const json = JSON.parse(data);
    iceSymbols = json.symbols || [];
    if (ice.socket.readyState === WebSocket.OPEN) {
      ice.unsubscribeAll();
      if (iceSymbols.length > 0) {
        ice.subscribeToMarkets(iceSymbols);
        console.log('✅ Subscribed to ICE markets:', iceSymbols.join(', '));
      }
    }
  } catch (err) {
    console.error('❌ Failed to load ICE symbols:', err);
  }
};

chokidar.watch(symbolsFile).on('change', () => {
  console.log('♻️ ICE symbols file changed, updating subscriptions...');
  loadSymbols();
});

// ------------------- ICE Event Handlers -------------------
ice.on('open', () => {
  console.log('✅ ICE WebSocket connected');
  loadSymbols();
});

ice.on('marketData', data => {
  console.log('🟢 ICE Market Update:', data.symbol, 'Bid:', data.bid, 'Ask:', data.ask);
  wss.broadcast({ type: 'ice-market', payload: data });
});

ice.on('error', err => console.error('❌ ICE WebSocket error:', err));
ice.on('close', () => console.warn('⚠️ ICE WebSocket disconnected'));

// ------------------- Arbitrage Service -------------------
const arbitrage = new ArbitrageService({ iceAdapter: ice, spreadThreshold: 0.2 });

arbitrage.on('signal', signal => {
  console.log('🚀 Arbitrage Signal:', signal);
  arbitrage.executeTrade(signal);
  wss.broadcast({ type: 'arbitrage-signal', payload: signal });
});

// ------------------- Routes -------------------
app.use('/api/rbt', rbtRoutes);
app.use('/api/raaspay', raaspayRoutes);
app.use('/api/oracle', oracleRoutes);

// ------------------- Root & Health -------------------
app.get('/', (req, res) => res.send('✅ Raasystem Backend API is running. Visit /api/docs for Swagger UI.'));
app.get('/api/raaspay/health', (req, res) => res.json({ status: 'ok' }));

// ------------------- Swagger UI -------------------
swaggerDocument.servers = process.env.NODE_ENV === 'production'
  ? [
      { url: 'https://api.raasystem.io', description: 'Production API Server' },
      { url: 'http://raasystem-docs.s3-website-us-west-2.amazonaws.com', description: 'Live Documentation' }
    ]
  : [
      { url: `http://localhost:${process.env.PORT || 8000}`, description: 'Local Development Server' }
    ];

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ------------------- MongoDB -------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 8000;
server.listen(PORT, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let lanIp = 'localhost';
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        lanIp = iface.address;
        break;
      }
    }
  }

  console.log(`🚀 Server running on:`);
  console.log(`   🔹 Localhost: http://localhost:${PORT}`);
  console.log(`   🔹 LAN IP:   http://${lanIp}:${PORT}`);
  console.log(`📊 Swagger docs at http://localhost:${PORT}/api/docs`);
  console.log(`📡 WebSocket ready for ICE and Arbitrage updates`);
});
