const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  parameters: {
    type: Object,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Strategy = mongoose.model('Strategy', strategySchema);

module.exports = Strategy;
