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
