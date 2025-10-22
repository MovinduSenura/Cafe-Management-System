const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerID: { 
    type: String, 
    unique: true, 
    required: true,
    trim: true
  },
  customerName: { 
    type: String, 
    required: true, 
    minlength: 2, 
    maxlength: 100,
    trim: true
  },
  customerEmail: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  customerPhone: { 
    type: String, 
    required: true,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  customerAddress: { 
    type: String,
    trim: true
  },
  dateOfBirth: { 
    type: Date 
  },
  loyaltyPoints: { 
    type: Number, 
    default: 0,
    min: 0
  },
  totalOrdersPlaced: { 
    type: Number, 
    default: 0,
    min: 0
  },
  totalAmountSpent: { 
    type: Number, 
    default: 0,
    min: 0
  },
  preferredPaymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital_wallet', 'bank_transfer'],
    default: 'card'
  },
  customerTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastVisit: { 
    type: Date 
  },
  averageOrderValue: { 
    type: Number, 
    default: 0,
    min: 0
  },
  favoriteItems: [{ 
    type: String 
  }],
  dietaryRestrictions: [{ 
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'nut_allergy', 'halal', 'kosher']
  }],
  communicationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
customerSchema.index({ customerEmail: 1 });
customerSchema.index({ customerID: 1 });
customerSchema.index({ customerTier: 1 });
customerSchema.index({ isActive: 1 });

// Virtual for customer age
customerSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to generate customerID
customerSchema.pre('save', function(next) {
  if (!this.customerID) {
    this.customerID = 'CUST' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Pre-save middleware to calculate customer tier based on total spent
customerSchema.pre('save', function(next) {
  if (this.totalAmountSpent >= 10000) {
    this.customerTier = 'platinum';
  } else if (this.totalAmountSpent >= 5000) {
    this.customerTier = 'gold';
  } else if (this.totalAmountSpent >= 1000) {
    this.customerTier = 'silver';
  } else {
    this.customerTier = 'bronze';
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema);