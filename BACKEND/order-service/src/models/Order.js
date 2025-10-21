const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemID: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  specialInstructions: { type: String, trim: true }
});

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  customerID: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending'
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    required: true
  },
  tableNumber: {
    type: String,
    trim: true
  },
  estimatedTime: {
    type: Number, // in minutes
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ customerID: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderType: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate orderID
orderSchema.pre('save', function(next) {
  if (!this.orderID) {
    this.orderID = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  
  // Calculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.totalAmount = this.subtotal + this.tax - this.discount;
  
  next();
});

module.exports = mongoose.model('Order', orderSchema);
