const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.CUSTOMER_DB_URI || process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Customer Schema
const customerSchema = new mongoose.Schema({
  customerID: { type: String, unique: true, required: true },
  customerName: { type: String, required: true, minlength: 2, maxlength: 100 },
  customerEmail: { type: String, required: true, unique: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String },
  dateOfBirth: { type: Date },
  loyaltyPoints: { type: Number, default: 0 },
  totalOrdersPlaced: { type: Number, default: 0 },
  totalAmountSpent: { type: Number, default: 0 },
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
  isActive: { type: Boolean, default: true },
  lastVisit: { type: Date },
  averageOrderValue: { type: Number, default: 0 },
  favoriteItems: [{ type: String }],
  dietaryRestrictions: [{ 
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'nut_allergy', 'halal', 'kosher']
  }],
  communicationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  },
  notes: { type: String, maxlength: 500 }
}, {
  timestamps: true
});

// Auto-generate customer ID
customerSchema.pre('save', function(next) {
  if (!this.customerID) {
    this.customerID = `CUST${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Update customer tier based on total spent
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

const Customer = mongoose.model('Customer', customerSchema);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"]
    }
  }
}));
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

app.use(limiter);

// Authentication middleware (validates token from API Gateway)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  // In microservices, token validation is typically handled by API Gateway
  // Here we just extract user info from headers set by API Gateway
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const userPermissions = req.headers['x-user-permissions'];
  
  if (!userId || !userRole) {
    return res.status(401).json({ error: 'Invalid authentication headers' });
  }
  
  req.user = {
    id: userId,
    role: userRole,
    permissions: userPermissions ? userPermissions.split(',') : []
  };
  
  next();
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'customer-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all customers (with pagination)
app.get('/api/v1/customers', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, tier, isActive } = req.query;
    
    let filter = {};
    
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tier) filter.customerTier = tier;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const customers = await Customer.find(filter)
      .select('-notes')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Customer.countDocuments(filter);
    
    res.status(200).json({
      customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    logger.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer by ID
app.get('/api/v1/customers/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.status(200).json({ customer });
  } catch (error) {
    logger.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new customer
app.post('/api/v1/customers', authenticateToken, async (req, res) => {
  try {
    const customerData = req.body;
    
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ 
      $or: [
        { customerEmail: customerData.customerEmail },
        { customerPhone: customerData.customerPhone }
      ]
    });
    
    if (existingCustomer) {
      return res.status(409).json({ error: 'Customer already exists with this email or phone' });
    }
    
    const customer = new Customer(customerData);
    await customer.save();
    
    logger.info(`New customer created: ${customer.customerEmail}`);
    
    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (error) {
    logger.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
app.put('/api/v1/customers/:id', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove fields that shouldn't be directly updated
    delete updates.customerID;
    delete updates.loyaltyPoints;
    delete updates.totalOrdersPlaced;
    delete updates.totalAmountSpent;
    delete updates.customerTier;
    
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    logger.info(`Customer updated: ${customer.customerEmail}`);
    
    res.status(200).json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    logger.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer (soft delete)
app.delete('/api/v1/customers/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    logger.info(`Customer deactivated: ${customer.customerEmail}`);
    
    res.status(200).json({
      message: 'Customer deactivated successfully'
    });
  } catch (error) {
    logger.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer loyalty points
app.post('/api/v1/customers/:id/loyalty', async (req, res) => {
  try {
    const { points, orderValue } = req.body;
    
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Update loyalty points and spending
    customer.loyaltyPoints += points;
    customer.totalOrdersPlaced += 1;
    customer.totalAmountSpent += orderValue;
    customer.lastVisit = new Date();
    customer.averageOrderValue = customer.totalAmountSpent / customer.totalOrdersPlaced;
    
    await customer.save();
    
    res.status(200).json({
      message: 'Loyalty points updated successfully',
      customer: {
        customerID: customer.customerID,
        loyaltyPoints: customer.loyaltyPoints,
        customerTier: customer.customerTier,
        totalOrdersPlaced: customer.totalOrdersPlaced,
        totalAmountSpent: customer.totalAmountSpent
      }
    });
  } catch (error) {
    logger.error('Update loyalty points error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer analytics
app.get('/api/v1/customers/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const analytics = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          activeCustomers: { $sum: { $cond: ['$isActive', 1, 0] } },
          averageOrderValue: { $avg: '$averageOrderValue' },
          totalLoyaltyPoints: { $sum: '$loyaltyPoints' },
          totalRevenue: { $sum: '$totalAmountSpent' }
        }
      }
    ]);
    
    const tierDistribution = await Customer.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$customerTier',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      summary: analytics[0] || {},
      tierDistribution
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Customer service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  logger.info(`👥 Customer Service running on port ${PORT}`);
});

module.exports = app;