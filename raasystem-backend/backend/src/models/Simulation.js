const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  strategy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strategy',
    required: true,
  },
  result: {
    type: String, // or any other type depending on how you want to structure results
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Simulation = mongoose.model('Simulation', simulationSchema);

module.exports = Simulation;
