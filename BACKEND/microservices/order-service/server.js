const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.ORDER_DB_URI || process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderID: { type: String, unique: true, required: true },
  customerID: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String },
  orderType: {
    type: String,
    enum: ['dine_in', 'takeaway', 'delivery'],
    required: true,
    default: 'dine_in'
  },
  tableNumber: { type: String },
  deliveryAddress: {
    street: { type: String },
    city: { type: String },
    zipCode: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  items: [{
    itemID: { type: String, required: true },
    itemName: { type: String, required: true },
    category: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    specialInstructions: { type: String, maxlength: 200 },
    customizations: [{
      name: { type: String },
      price: { type: Number, default: 0 }
    }],
    preparationTime: { type: Number }, // in minutes
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'served'],
      default: 'pending'
    }
  }],
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital_wallet', 'bank_transfer', 'split'],
    default: 'card'
  },
  subtotal: { type: Number, required: true, min: 0 },
  taxAmount: { type: Number, default: 0, min: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  deliveryFee: { type: Number, default: 0, min: 0 },
  serviceCharge: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  estimatedPreparationTime: { type: Number }, // in minutes
  actualPreparationTime: { type: Number }, // in minutes
  orderPlacedAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  preparationStartedAt: { type: Date },
  readyAt: { type: Date },
  servedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  assignedStaff: {
    waiterID: { type: String },
    waiterName: { type: String },
    chefID: { type: String },
    chefName: { type: String }
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  specialRequests: { type: String, maxlength: 500 },
  loyaltyPointsEarned: { type: Number, default: 0 },
  loyaltyPointsUsed: { type: Number, default: 0 },
  promotionApplied: {
    promotionID: { type: String },
    promotionName: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    discountValue: { type: Number }
  },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String, maxlength: 1000 },
  feedbackDate: { type: Date },
  sourceChannel: {
    type: String,
    enum: ['pos', 'mobile_app', 'website', 'phone', 'walk_in'],
    default: 'pos'
  }
}, {
  timestamps: true
});

// Auto-generate order ID
orderSchema.pre('save', function(next) {
  if (!this.orderID) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = Date.now().toString().slice(-6);
    this.orderID = `ORD${dateStr}${timeStr}`;
  }
  next();
});

// Calculate estimated preparation time based on items
orderSchema.pre('save', function(next) {
  if (!this.estimatedPreparationTime) {
    const maxPrepTime = Math.max(...this.items.map(item => item.preparationTime || 10));
    const avgPrepTime = this.items.reduce((sum, item) => sum + (item.preparationTime || 10), 0) / this.items.length;
    this.estimatedPreparationTime = Math.max(maxPrepTime, avgPrepTime + 5);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

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

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
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
    service: 'order-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all orders (with filtering and pagination)
app.get('/api/v1/orders', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { 
      customerID,
      orderStatus,
      paymentStatus,
      orderType,
      dateFrom,
      dateTo,
      staffID,
      tableNumber,
      sortBy = 'orderPlacedAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filter = {};
    
    if (customerID) filter.customerID = customerID;
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (orderType) filter.orderType = orderType;
    if (tableNumber) filter.tableNumber = tableNumber;
    if (staffID) {
      filter.$or = [
        { 'assignedStaff.waiterID': staffID },
        { 'assignedStaff.chefID': staffID }
      ];
    }
    
    if (dateFrom || dateTo) {
      filter.orderPlacedAt = {};
      if (dateFrom) filter.orderPlacedAt.$gte = new Date(dateFrom);
      if (dateTo) filter.orderPlacedAt.$lte = new Date(dateTo);
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const orders = await Order.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(filter);
    
    res.status(200).json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order by ID
app.get('/api/v1/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.status(200).json({ order });
  } catch (error) {
    logger.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
app.post('/api/v1/orders', authenticateToken, async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerID || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Customer ID and items are required' });
    }
    
    // Calculate totals
    let subtotal = 0;
    orderData.items.forEach(item => {
      item.totalPrice = item.unitPrice * item.quantity;
      const customizationTotal = item.customizations ? 
        item.customizations.reduce((sum, custom) => sum + (custom.price || 0), 0) * item.quantity : 0;
      item.totalPrice += customizationTotal;
      subtotal += item.totalPrice;
    });
    
    orderData.subtotal = subtotal;
    orderData.taxAmount = orderData.taxAmount || (subtotal * 0.1); // 10% tax
    orderData.totalAmount = subtotal + orderData.taxAmount + (orderData.deliveryFee || 0) + 
                           (orderData.serviceCharge || 0) - (orderData.discountAmount || 0);
    
    const order = new Order(orderData);
    await order.save();
    
    logger.info(`New order created: ${order.orderID} for customer ${order.customerID}`);
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
app.patch('/api/v1/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { orderStatus, staffID, staffName } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const previousStatus = order.orderStatus;
    order.orderStatus = orderStatus;
    
    // Update timestamps based on status
    const now = new Date();
    switch (orderStatus) {
      case 'confirmed':
        order.confirmedAt = now;
        break;
      case 'preparing':
        order.preparationStartedAt = now;
        if (staffID && !order.assignedStaff.chefID) {
          order.assignedStaff.chefID = staffID;
          order.assignedStaff.chefName = staffName;
        }
        break;
      case 'ready':
        order.readyAt = now;
        if (order.preparationStartedAt) {
          order.actualPreparationTime = Math.round((now - order.preparationStartedAt) / (1000 * 60));
        }
        break;
      case 'served':
        order.servedAt = now;
        if (staffID && !order.assignedStaff.waiterID) {
          order.assignedStaff.waiterID = staffID;
          order.assignedStaff.waiterName = staffName;
        }
        break;
      case 'cancelled':
        order.cancelledAt = now;
        order.cancellationReason = req.body.cancellationReason;
        break;
    }
    
    await order.save();
    
    logger.info(`Order ${order.orderID} status updated from ${previousStatus} to ${orderStatus}`);
    
    res.status(200).json({
      message: 'Order status updated successfully',
      order: {
        orderID: order.orderID,
        orderStatus: order.orderStatus,
        previousStatus,
        updatedAt: now
      }
    });
  } catch (error) {
    logger.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update payment status
app.patch('/api/v1/orders/:id/payment', async (req, res) => {
  try {
    const { paymentStatus, paymentMethod, transactionID } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (transactionID) order.transactionID = transactionID;
    
    await order.save();
    
    logger.info(`Order ${order.orderID} payment status updated to ${paymentStatus}`);
    
    res.status(200).json({
      message: 'Payment status updated successfully',
      order: {
        orderID: order.orderID,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod
      }
    });
  } catch (error) {
    logger.error('Update payment status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add feedback to order
app.post('/api/v1/orders/:id/feedback', async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        rating, 
        feedback, 
        feedbackDate: new Date() 
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    logger.info(`Feedback added to order ${order.orderID}: Rating ${rating}/5`);
    
    res.status(200).json({
      message: 'Feedback added successfully',
      order: {
        orderID: order.orderID,
        rating: order.rating,
        feedback: order.feedback
      }
    });
  } catch (error) {
    logger.error('Add feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get kitchen orders (for kitchen display)
app.get('/api/v1/orders/kitchen/active', authenticateToken, async (req, res) => {
  try {
    const activeOrders = await Order.find({
      orderStatus: { $in: ['confirmed', 'preparing'] },
      orderType: { $in: ['dine_in', 'takeaway', 'delivery'] }
    })
    .select('orderID customerName tableNumber items orderType priority estimatedPreparationTime preparationStartedAt')
    .sort({ priority: -1, orderPlacedAt: 1 });
    
    res.status(200).json({ orders: activeOrders });
  } catch (error) {
    logger.error('Get kitchen orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order analytics
app.get('/api/v1/orders/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let dateFilter = {};
    
    if (dateFrom || dateTo) {
      dateFilter.orderPlacedAt = {};
      if (dateFrom) dateFilter.orderPlacedAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.orderPlacedAt.$lte = new Date(dateTo);
    }
    
    const analytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          completedOrders: { 
            $sum: { $cond: [{ $eq: ['$orderStatus', 'served'] }, 1, 0] } 
          },
          cancelledOrders: { 
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] } 
          },
          averagePreparationTime: { $avg: '$actualPreparationTime' }
        }
      }
    ]);
    
    const statusDistribution = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const orderTypeDistribution = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$orderType',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    res.status(200).json({
      summary: analytics[0] || {},
      statusDistribution,
      orderTypeDistribution
    });
  } catch (error) {
    logger.error('Get order analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Order service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  logger.info(`🍽️ Order Service running on port ${PORT}`);
});

module.exports = app;