const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.PAYMENT_DB_URI || process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  paymentID: { type: String, unique: true, required: true },
  orderID: { type: String, required: true },
  customerID: { type: String, required: true },
  customerName: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD', maxlength: 3 },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'digital_wallet', 'bank_transfer', 'gift_card', 'loyalty_points'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionID: { type: String, unique: true },
  externalTransactionID: { type: String }, // From payment gateway
  paymentGateway: {
    type: String,
    enum: ['stripe', 'paypal', 'square', 'authorize_net', 'internal'],
    default: 'internal'
  },
  cardDetails: {
    lastFourDigits: { type: String, maxlength: 4 },
    cardType: { 
      type: String, 
      enum: ['visa', 'mastercard', 'amex', 'discover', 'other'] 
    },
    expiryMonth: { type: Number, min: 1, max: 12 },
    expiryYear: { type: Number },
    cardholderName: { type: String, maxlength: 100 }
  },
  digitalWalletDetails: {
    walletType: { 
      type: String, 
      enum: ['apple_pay', 'google_pay', 'samsung_pay', 'paypal', 'venmo'] 
    },
    walletID: { type: String }
  },
  bankTransferDetails: {
    bankName: { type: String, maxlength: 100 },
    accountNumber: { type: String, maxlength: 20 },
    routingNumber: { type: String, maxlength: 20 },
    transferType: { 
      type: String, 
      enum: ['ach', 'wire', 'instant'] 
    }
  },
  splitPayments: [{
    method: { 
      type: String, 
      enum: ['cash', 'card', 'digital_wallet', 'gift_card', 'loyalty_points'] 
    },
    amount: { type: Number, min: 0 },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'] 
    },
    transactionID: { type: String }
  }],
  taxAmount: { type: Number, default: 0, min: 0 },
  tipAmount: { type: Number, default: 0, min: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  refundAmount: { type: Number, default: 0, min: 0 },
  processingFee: { type: Number, default: 0, min: 0 },
  netAmount: { type: Number, min: 0 }, // Amount after fees and taxes
  paymentDate: { type: Date, default: Date.now },
  processedAt: { type: Date },
  completedAt: { type: Date },
  failedAt: { type: Date },
  refundedAt: { type: Date },
  failureReason: { type: String, maxlength: 500 },
  receiptNumber: { type: String, unique: true },
  receiptURL: { type: String },
  invoiceNumber: { type: String },
  isRecurring: { type: Boolean, default: false },
  recurringSchedule: {
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'yearly'] 
    },
    nextPaymentDate: { type: Date },
    endDate: { type: Date }
  },
  metadata: {
    userAgent: { type: String },
    ipAddress: { type: String },
    deviceType: { 
      type: String, 
      enum: ['mobile', 'tablet', 'desktop', 'pos'] 
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  securityChecks: {
    cvvVerified: { type: Boolean },
    avsVerified: { type: Boolean },
    fraudScore: { type: Number, min: 0, max: 100 },
    is3DSecure: { type: Boolean, default: false }
  },
  loyaltyPointsUsed: { type: Number, default: 0, min: 0 },
  loyaltyPointsEarned: { type: Number, default: 0, min: 0 },
  giftCardCode: { type: String },
  promotionCode: { type: String },
  staffID: { type: String }, // Staff who processed the payment
  staffName: { type: String },
  notes: { type: String, maxlength: 500 }
}, {
  timestamps: true
});

// Auto-generate payment ID
paymentSchema.pre('save', function(next) {
  if (!this.paymentID) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = Date.now().toString().slice(-6);
    this.paymentID = `PAY${dateStr}${timeStr}`;
  }
  next();
});

// Auto-generate transaction ID
paymentSchema.pre('save', function(next) {
  if (!this.transactionID) {
    this.transactionID = crypto.randomBytes(16).toString('hex').toUpperCase();
  }
  next();
});

// Auto-generate receipt number
paymentSchema.pre('save', function(next) {
  if (!this.receiptNumber && this.paymentStatus === 'completed') {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = Date.now().toString().slice(-4);
    this.receiptNumber = `RCP${dateStr}${timeStr}`;
  }
  next();
});

// Calculate net amount
paymentSchema.pre('save', function(next) {
  this.netAmount = this.amount - this.processingFee - this.refundAmount;
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

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

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 payment attempts per window
  message: { error: 'Too many payment attempts, please try again later.' }
});

app.use('/api/v1/payments', paymentLimiter);

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
    service: 'payment-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Process payment
app.post('/api/v1/payments', authenticateToken, async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Validate required fields
    if (!paymentData.orderID || !paymentData.amount || !paymentData.paymentMethod) {
      return res.status(400).json({ error: 'Order ID, amount, and payment method are required' });
    }
    
    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({ orderID: paymentData.orderID });
    if (existingPayment && existingPayment.paymentStatus === 'completed') {
      return res.status(409).json({ error: 'Payment already completed for this order' });
    }
    
    // Set processing staff
    paymentData.staffID = req.user.id;
    paymentData.staffName = req.headers['x-user-name'];
    
    const payment = new Payment(paymentData);
    
    // Process payment based on method
    await processPaymentByMethod(payment);
    
    await payment.save();
    
    logger.info(`Payment processed: ${payment.paymentID} for order ${payment.orderID}`);
    
    res.status(201).json({
      message: 'Payment processed successfully',
      payment: {
        paymentID: payment.paymentID,
        transactionID: payment.transactionID,
        paymentStatus: payment.paymentStatus,
        amount: payment.amount,
        receiptNumber: payment.receiptNumber
      }
    });
  } catch (error) {
    logger.error('Process payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get payment by ID
app.get('/api/v1/payments/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.status(200).json({ payment });
  } catch (error) {
    logger.error('Get payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payments by order ID
app.get('/api/v1/payments/order/:orderID', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ orderID: req.params.orderID })
      .sort({ paymentDate: -1 });
    
    res.status(200).json({ payments });
  } catch (error) {
    logger.error('Get payments by order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process refund
app.post('/api/v1/payments/:id/refund', authenticateToken, async (req, res) => {
  try {
    const { refundAmount, reason } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    if (payment.paymentStatus !== 'completed') {
      return res.status(400).json({ error: 'Can only refund completed payments' });
    }
    
    const totalRefunded = payment.refundAmount + refundAmount;
    if (totalRefunded > payment.amount) {
      return res.status(400).json({ error: 'Refund amount exceeds payment amount' });
    }
    
    // Process refund with payment gateway
    const refundResult = await processRefund(payment, refundAmount);
    
    if (refundResult.success) {
      payment.refundAmount = totalRefunded;
      payment.paymentStatus = totalRefunded === payment.amount ? 'refunded' : 'partially_refunded';
      payment.refundedAt = new Date();
      payment.notes = (payment.notes || '') + `\nRefund: $${refundAmount} - ${reason}`;
      
      await payment.save();
      
      logger.info(`Refund processed: $${refundAmount} for payment ${payment.paymentID}`);
      
      res.status(200).json({
        message: 'Refund processed successfully',
        payment: {
          paymentID: payment.paymentID,
          refundAmount: payment.refundAmount,
          paymentStatus: payment.paymentStatus
        }
      });
    } else {
      res.status(400).json({ error: 'Refund processing failed' });
    }
  } catch (error) {
    logger.error('Process refund error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment analytics
app.get('/api/v1/payments/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let dateFilter = {};
    
    if (dateFrom || dateTo) {
      dateFilter.paymentDate = {};
      if (dateFrom) dateFilter.paymentDate.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.paymentDate.$lte = new Date(dateTo);
    }
    
    const analytics = await Payment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalRefunds: { $sum: '$refundAmount' },
          averagePayment: { $avg: '$amount' },
          completedPayments: { 
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } 
          },
          failedPayments: { 
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] } 
          }
        }
      }
    ]);
    
    const methodDistribution = await Payment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    const statusDistribution = await Payment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      summary: analytics[0] || {},
      methodDistribution,
      statusDistribution
    });
  } catch (error) {
    logger.error('Get payment analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment processing functions
async function processPaymentByMethod(payment) {
  switch (payment.paymentMethod) {
    case 'cash':
      payment.paymentStatus = 'completed';
      payment.completedAt = new Date();
      break;
      
    case 'credit_card':
    case 'debit_card':
      await processCreditCardPayment(payment);
      break;
      
    case 'digital_wallet':
      await processDigitalWalletPayment(payment);
      break;
      
    case 'bank_transfer':
      payment.paymentStatus = 'processing';
      break;
      
    case 'gift_card':
      await processGiftCardPayment(payment);
      break;
      
    case 'loyalty_points':
      await processLoyaltyPointsPayment(payment);
      break;
      
    default:
      throw new Error('Unsupported payment method');
  }
}

async function processCreditCardPayment(payment) {
  // Simulate payment gateway processing
  // In real implementation, integrate with Stripe, PayPal, etc.
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      payment.paymentStatus = 'completed';
      payment.completedAt = new Date();
      payment.externalTransactionID = `ext_${crypto.randomBytes(8).toString('hex')}`;
      payment.processingFee = payment.amount * 0.029; // 2.9% processing fee
    } else {
      payment.paymentStatus = 'failed';
      payment.failedAt = new Date();
      payment.failureReason = 'Card declined by issuer';
    }
  } catch (error) {
    payment.paymentStatus = 'failed';
    payment.failedAt = new Date();
    payment.failureReason = error.message;
  }
}

async function processDigitalWalletPayment(payment) {
  // Similar to credit card processing
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      payment.paymentStatus = 'completed';
      payment.completedAt = new Date();
      payment.externalTransactionID = `wallet_${crypto.randomBytes(8).toString('hex')}`;
      payment.processingFee = payment.amount * 0.025; // 2.5% processing fee
    } else {
      payment.paymentStatus = 'failed';
      payment.failedAt = new Date();
      payment.failureReason = 'Digital wallet transaction failed';
    }
  } catch (error) {
    payment.paymentStatus = 'failed';
    payment.failedAt = new Date();
    payment.failureReason = error.message;
  }
}

async function processGiftCardPayment(payment) {
  // Simulate gift card validation
  const isValid = payment.giftCardCode && payment.giftCardCode.length === 16;
  
  if (isValid) {
    payment.paymentStatus = 'completed';
    payment.completedAt = new Date();
  } else {
    payment.paymentStatus = 'failed';
    payment.failedAt = new Date();
    payment.failureReason = 'Invalid gift card code';
  }
}

async function processLoyaltyPointsPayment(payment) {
  // Validate loyalty points balance
  // In real implementation, check with customer service
  
  if (payment.loyaltyPointsUsed > 0) {
    payment.paymentStatus = 'completed';
    payment.completedAt = new Date();
  } else {
    payment.paymentStatus = 'failed';
    payment.failedAt = new Date();
    payment.failureReason = 'Insufficient loyalty points';
  }
}

async function processRefund(payment, refundAmount) {
  // Simulate refund processing with payment gateway
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate refund success (95% success rate)
    const isSuccess = Math.random() > 0.05;
    
    return {
      success: isSuccess,
      refundTransactionID: isSuccess ? `ref_${crypto.randomBytes(8).toString('hex')}` : null,
      error: isSuccess ? null : 'Refund processing failed'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Payment service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  logger.info(`💳 Payment Service running on port ${PORT}`);
});

module.exports = app;