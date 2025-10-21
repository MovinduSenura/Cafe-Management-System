const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
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
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  DayVisited: {
    type: String,
    required: true,
    trim: true
  },
  TimeVisited: {
    type: String,
    required: true,
    trim: true   
  },
  Comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reply: {
    type: String,
    default: "pending",
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'responded'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['service', 'food', 'ambiance', 'pricing', 'cleanliness', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
feedbackSchema.index({ customerEmail: 1 });
feedbackSchema.index({ customerID: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ createdAt: -1 });

// Pre-save middleware to update status when reply is added
feedbackSchema.pre('save', function(next) {
  if (this.reply && this.reply !== 'pending' && this.status === 'pending') {
    this.status = 'responded';
  }
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);