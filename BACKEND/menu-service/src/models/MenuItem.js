const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  itemID: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'special'],
    lowercase: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'gluten', 'soy', 'eggs', 'shellfish', 'fish'],
    lowercase: true
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 }
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    min: 0
  },
  imageUrl: {
    type: String,
    trim: true
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ itemID: 1 });
menuItemSchema.index({ itemName: 'text', description: 'text' });

// Virtual for discounted price
menuItemSchema.virtual('discountedPrice').get(function() {
  return this.price * (1 - this.discountPercentage / 100);
});

// Pre-save middleware to generate itemID
menuItemSchema.pre('save', function(next) {
  if (!this.itemID) {
    this.itemID = 'MENU' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
