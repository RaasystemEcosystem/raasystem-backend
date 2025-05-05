const dotenv = require('dotenv');
dotenv.config(); // ✅ MUST come before using process.env

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const strategyRoutes = require('./routes/strategyRoutes');

// ✅ Load MongoDB connection from env
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// Init Express
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/strategies', strategyRoutes);

// Root
app.get('/', (req, res) => {
  res.send('✅ Raasystem API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

