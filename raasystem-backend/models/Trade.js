const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  strategy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strategy',
    required: true,
  },
  action: {
    type: String, // Buy or Sell
  },
  amount: {
    type: Number,
  },
  price: {
    type: Number,
  },
  status: {
    type: String, // e.g., Completed, Pending
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
