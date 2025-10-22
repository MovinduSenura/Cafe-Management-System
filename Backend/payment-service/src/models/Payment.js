const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentID: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  orderID: {
    type: String,
    required: true,
    trim: true
  },
  customerID: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  method: {
    type: String,
    enum: ['cash', 'card', 'digital_wallet', 'bank_transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionID: {
    type: String,
    trim: true
  },
  cardDetails: {
    lastFourDigits: { type: String, trim: true },
    cardType: { 
      type: String, 
      enum: ['visa', 'mastercard', 'amex', 'discover']
    }
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  refundReason: {
    type: String,
    trim: true
  },
  processingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  gateway: {
    type: String,
    enum: ['stripe', 'paypal', 'square', 'internal'],
    default: 'internal'
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ orderID: 1 });
paymentSchema.index({ customerID: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ method: 1 });

// Pre-save middleware to generate paymentID
paymentSchema.pre('save', function(next) {
  if (!this.paymentID) {
    this.paymentID = 'PAY' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
