// src/models/Payment.js
const mongoose = require('mongoose');

// Define the Payment schema
const PaymentSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'RAASKOIN' },
    txHash: { type: String, required: true }
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  }
);

// Export the Payment model
module.exports = mongoose.model('Payment', PaymentSchema);
