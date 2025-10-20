const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.REPORT_DB_URI || process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Report Schema
const reportSchema = new mongoose.Schema({
  reportID: { type: String, unique: true, required: true },
  reportName: { type: String, required: true, maxlength: 100 },
  reportType: {
    type: String,
    enum: ['sales', 'financial', 'inventory', 'customer', 'staff', 'operational', 'analytics'],
    required: true
  },
  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
    required: true
  },
  dateRange: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  filters: {
    customerType: [{ type: String }],
    paymentMethod: [{ type: String }],
    orderStatus: [{ type: String }],
    staffRole: [{ type: String }],
    menuCategory: [{ type: String }],
    location: [{ type: String }]
  },
  data: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'scheduled'],
    default: 'generating'
  },
  generatedBy: { type: String, required: true },
  generatedByName: { type: String },
  generatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  fileUrl: { type: String },
  fileFormat: {
    type: String,
    enum: ['json', 'csv', 'excel', 'pdf'],
    default: 'json'
  },
  isScheduled: { type: Boolean, default: false },
  scheduleConfig: {
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly'] 
    },
    time: { type: String }, // "HH:MM" format
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday
    dayOfMonth: { type: Number, min: 1, max: 31 },
    recipients: [{ type: String }] // Email addresses
  },
  summary: {
    totalRecords: { type: Number, default: 0 },
    keyMetrics: { type: mongoose.Schema.Types.Mixed },
    insights: [{ type: String }]
  },
  isArchived: { type: Boolean, default: false },
  expiresAt: { type: Date },
  tags: [{ type: String }],
  notes: { type: String, maxlength: 500 }
}, {
  timestamps: true
});

// Auto-generate report ID
reportSchema.pre('save', function(next) {
  if (!this.reportID) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = Date.now().toString().slice(-6);
    this.reportID = `RPT${dateStr}${timeStr}`;
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

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
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window (reports can be resource intensive)
  message: { error: 'Too many report requests, please try again later.' }
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

// Permission check for reports
const checkReportPermission = (req, res, next) => {
  if (!req.user.permissions.includes('view_reports') && 
      !req.user.permissions.includes('manage_staff')) {
    return res.status(403).json({ error: 'Insufficient permissions to access reports' });
  }
  next();
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'report-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Generate sales report
app.post('/api/v1/reports/sales', authenticateToken, checkReportPermission, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day', includeDetails = false } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const reportData = await generateSalesReport(startDate, endDate, groupBy, includeDetails);
    
    const report = new Report({
      reportName: `Sales Report - ${startDate} to ${endDate}`,
      reportType: 'sales',
      category: 'custom',
      dateRange: { startDate: new Date(startDate), endDate: new Date(endDate) },
      data: reportData,
      status: 'completed',
      completedAt: new Date(),
      generatedBy: req.user.id,
      generatedByName: req.headers['x-user-name']
    });
    
    await report.save();
    
    logger.info(`Sales report generated: ${report.reportID}`);
    
    res.status(200).json({
      message: 'Sales report generated successfully',
      report: {
        reportID: report.reportID,
        data: reportData
      }
    });
  } catch (error) {
    logger.error('Generate sales report error:', error);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
});

// Generate financial report
app.post('/api/v1/reports/financial', authenticateToken, checkReportPermission, async (req, res) => {
  try {
    const { startDate, endDate, includeBreakdown = true } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const reportData = await generateFinancialReport(startDate, endDate, includeBreakdown);
    
    const report = new Report({
      reportName: `Financial Report - ${startDate} to ${endDate}`,
      reportType: 'financial',
      category: 'custom',
      dateRange: { startDate: new Date(startDate), endDate: new Date(endDate) },
      data: reportData,
      status: 'completed',
      completedAt: new Date(),
      generatedBy: req.user.id,
      generatedByName: req.headers['x-user-name']
    });
    
    await report.save();
    
    logger.info(`Financial report generated: ${report.reportID}`);
    
    res.status(200).json({
      message: 'Financial report generated successfully',
      report: {
        reportID: report.reportID,
        data: reportData
      }
    });
  } catch (error) {
    logger.error('Generate financial report error:', error);
    res.status(500).json({ error: 'Failed to generate financial report' });
  }
});

// Generate inventory report
app.post('/api/v1/reports/inventory', authenticateToken, checkReportPermission, async (req, res) => {
  try {
    const { includeMovements = false, lowStockOnly = false } = req.body;
    
    const reportData = await generateInventoryReport(includeMovements, lowStockOnly);
    
    const report = new Report({
      reportName: `Inventory Report - ${new Date().toISOString().split('T')[0]}`,
      reportType: 'inventory',
      category: 'custom',
      dateRange: { 
        startDate: new Date(), 
        endDate: new Date() 
      },
      data: reportData,
      status: 'completed',
      completedAt: new Date(),
      generatedBy: req.user.id,
      generatedByName: req.headers['x-user-name']
    });
    
    await report.save();
    
    logger.info(`Inventory report generated: ${report.reportID}`);
    
    res.status(200).json({
      message: 'Inventory report generated successfully',
      report: {
        reportID: report.reportID,
        data: reportData
      }
    });
  } catch (error) {
    logger.error('Generate inventory report error:', error);
    res.status(500).json({ error: 'Failed to generate inventory report' });
  }
});

// Generate customer analytics report
app.post('/api/v1/reports/customer-analytics', authenticateToken, checkReportPermission, async (req, res) => {
  try {
    const { startDate, endDate, segmentBy = 'tier' } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const reportData = await generateCustomerAnalyticsReport(startDate, endDate, segmentBy);
    
    const report = new Report({
      reportName: `Customer Analytics - ${startDate} to ${endDate}`,
      reportType: 'customer',
      category: 'custom',
      dateRange: { startDate: new Date(startDate), endDate: new Date(endDate) },
      data: reportData,
      status: 'completed',
      completedAt: new Date(),
      generatedBy: req.user.id,
      generatedByName: req.headers['x-user-name']
    });
    
    await report.save();
    
    logger.info(`Customer analytics report generated: ${report.reportID}`);
    
    res.status(200).json({
      message: 'Customer analytics report generated successfully',
      report: {
        reportID: report.reportID,
        data: reportData
      }
    });
  } catch (error) {
    logger.error('Generate customer analytics report error:', error);
    res.status(500).json({ error: 'Failed to generate customer analytics report' });
  }
});

// Generate staff performance report
app.post('/api/v1/reports/staff-performance', authenticateToken, checkReportPermission, async (req, res) => {
  try {
    const { startDate, endDate, includeIndividual = true } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const reportData = await generateStaffPerformanceReport(startDate, endDate, includeIndividual);
    
    const report = new Report({
      reportName: `Staff Performance - ${startDate} to ${endDate}`,
      reportType: 'staff',
      category: 'custom',
      dateRange: { startDate: new Date(startDate), endDate: new Date(endDate) },
      data: reportData,
      status: 'completed',
      completedAt: new Date(),
      generatedBy: req.user.id,
      generatedByName: req.headers['x-user-name']
    });
    
    await report.save();
    
    logger.info(`Staff performance report generated: ${report.reportID}`);
    
    res.status(200).json({
      message: 'Staff performance report generated successfully',
      report: {
        reportID: report.reportID,
        data: reportData
      }
    });
  } catch (error) {
    logger.error('Generate staff performance report error:', error);
    res.status(500).json({ error: 'Failed to generate staff performance report' });
  }
});

// Get dashboard metrics
app.get('/api/v1/reports/dashboard', authenticateToken, checkReportPermission, async (req, res) => {
  try {
    const { period = 'today' } = req.query;
    
    const dashboardData = await generateDashboardMetrics(period);
    
    res.status(200).json({
      dashboard: dashboardData,
      generatedAt: new Date()
    });
  } catch (error) {
    logger.error('Get dashboard metrics error:', error);
    res.status(500).json({ error: 'Failed to generate dashboard metrics' });
  }
});

// Get all reports
app.get('/api/v1/reports', authenticateToken, checkReportPermission, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { reportType, category, status, dateFrom, dateTo } = req.query;
    
    let filter = { isArchived: false };
    
    if (reportType) filter.reportType = reportType;
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    if (dateFrom || dateTo) {
      filter.generatedAt = {};
      if (dateFrom) filter.generatedAt.$gte = new Date(dateFrom);
      if (dateTo) filter.generatedAt.$lte = new Date(dateTo);
    }
    
    const reports = await Report.find(filter)
      .select('-data') // Exclude large data field
      .sort({ generatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Report.countDocuments(filter);
    
    res.status(200).json({
      reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    logger.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get report by ID
app.get('/api/v1/reports/:id', authenticateToken, checkReportPermission, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.status(200).json({ report });
  } catch (error) {
    logger.error('Get report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions for report generation

async function generateSalesReport(startDate, endDate, groupBy, includeDetails) {
  const matchStage = {
    orderPlacedAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    orderStatus: 'served'
  };
  
  let groupStage;
  switch (groupBy) {
    case 'hour':
      groupStage = {
        _id: {
          year: { $year: '$orderPlacedAt' },
          month: { $month: '$orderPlacedAt' },
          day: { $dayOfMonth: '$orderPlacedAt' },
          hour: { $hour: '$orderPlacedAt' }
        }
      };
      break;
    case 'day':
      groupStage = {
        _id: {
          year: { $year: '$orderPlacedAt' },
          month: { $month: '$orderPlacedAt' },
          day: { $dayOfMonth: '$orderPlacedAt' }
        }
      };
      break;
    case 'week':
      groupStage = {
        _id: {
          year: { $year: '$orderPlacedAt' },
          week: { $week: '$orderPlacedAt' }
        }
      };
      break;
    case 'month':
      groupStage = {
        _id: {
          year: { $year: '$orderPlacedAt' },
          month: { $month: '$orderPlacedAt' }
        }
      };
      break;
    default:
      groupStage = { _id: null };
  }
  
  groupStage.totalRevenue = { $sum: '$totalAmount' };
  groupStage.totalOrders = { $sum: 1 };
  groupStage.averageOrderValue = { $avg: '$totalAmount' };
  groupStage.totalTax = { $sum: '$taxAmount' };
  groupStage.totalDiscount = { $sum: '$discountAmount' };
  
  // Mock aggregation result (replace with actual MongoDB connection)
  const salesData = [
    {
      _id: groupBy === 'day' ? { year: 2025, month: 10, day: 15 } : null,
      totalRevenue: 15420.50,
      totalOrders: 142,
      averageOrderValue: 108.60,
      totalTax: 1542.05,
      totalDiscount: 542.30
    }
  ];
  
  const summary = {
    totalRevenue: salesData.reduce((sum, item) => sum + item.totalRevenue, 0),
    totalOrders: salesData.reduce((sum, item) => sum + item.totalOrders, 0),
    averageOrderValue: salesData.reduce((sum, item) => sum + item.averageOrderValue, 0) / salesData.length,
    totalTax: salesData.reduce((sum, item) => sum + item.totalTax, 0),
    totalDiscount: salesData.reduce((sum, item) => sum + item.totalDiscount, 0)
  };
  
  return {
    summary,
    breakdown: salesData,
    period: { startDate, endDate },
    groupBy
  };
}

async function generateFinancialReport(startDate, endDate, includeBreakdown) {
  // Mock financial data
  const financialData = {
    revenue: {
      total: 45600.00,
      food: 32400.00,
      beverages: 9100.00,
      delivery: 1800.00,
      other: 2300.00
    },
    expenses: {
      total: 28400.00,
      ingredients: 15200.00,
      labor: 8900.00,
      rent: 3200.00,
      utilities: 800.00,
      other: 300.00
    },
    profit: {
      gross: 17200.00,
      net: 14850.00,
      margin: 32.57
    },
    taxes: {
      sales: 4560.00,
      income: 1790.00,
      total: 6350.00
    }
  };
  
  return {
    summary: financialData,
    period: { startDate, endDate },
    generatedAt: new Date()
  };
}

async function generateInventoryReport(includeMovements, lowStockOnly) {
  // Mock inventory data
  const inventoryData = {
    summary: {
      totalItems: 127,
      totalValue: 23450.00,
      lowStockItems: 12,
      outOfStockItems: 3,
      expiringItems: 8
    },
    categories: [
      { category: 'ingredients', count: 45, value: 8900.00 },
      { category: 'beverages', count: 32, value: 5600.00 },
      { category: 'dairy', count: 18, value: 2100.00 },
      { category: 'meat', count: 15, value: 4200.00 },
      { category: 'vegetables', count: 17, value: 2650.00 }
    ],
    alerts: {
      lowStock: [
        { itemName: 'Tomatoes', currentStock: 5, minimumStock: 20, unit: 'kg' },
        { itemName: 'Coffee Beans', currentStock: 2, minimumStock: 10, unit: 'bags' }
      ],
      expiring: [
        { itemName: 'Milk', expiryDate: '2025-10-17', currentStock: 12, unit: 'l' },
        { itemName: 'Chicken Breast', expiryDate: '2025-10-18', currentStock: 8, unit: 'kg' }
      ]
    }
  };
  
  return inventoryData;
}

async function generateCustomerAnalyticsReport(startDate, endDate, segmentBy) {
  // Mock customer analytics
  const customerData = {
    summary: {
      totalCustomers: 1245,
      newCustomers: 89,
      returningCustomers: 456,
      averageOrderValue: 87.50,
      customerLifetimeValue: 324.60
    },
    segments: {
      byTier: [
        { tier: 'bronze', count: 789, revenue: 34560.00 },
        { tier: 'silver', count: 321, revenue: 28900.00 },
        { tier: 'gold', count: 98, revenue: 19800.00 },
        { tier: 'platinum', count: 37, revenue: 15240.00 }
      ]
    },
    trends: {
      acquisition: [
        { month: '2025-08', newCustomers: 67 },
        { month: '2025-09', newCustomers: 78 },
        { month: '2025-10', newCustomers: 89 }
      ],
      retention: {
        rate: 68.5,
        averageVisitFrequency: 2.3
      }
    }
  };
  
  return customerData;
}

async function generateStaffPerformanceReport(startDate, endDate, includeIndividual) {
  // Mock staff performance data
  const staffData = {
    summary: {
      totalStaff: 24,
      activeStaff: 22,
      averageOrdersPerStaff: 15.6,
      totalHoursWorked: 1680,
      averageCustomerRating: 4.3
    },
    departments: [
      { department: 'kitchen', staff: 8, ordersCompleted: 892, avgPreparationTime: 12.5 },
      { department: 'service', staff: 10, ordersServed: 945, avgServiceTime: 3.2 },
      { department: 'management', staff: 4, performanceScore: 91.2 }
    ],
    topPerformers: [
      { staffName: 'John Smith', role: 'chef', ordersCompleted: 156, rating: 4.8 },
      { staffName: 'Sarah Wilson', role: 'waiter', ordersServed: 189, rating: 4.6 },
      { staffName: 'Mike Johnson', role: 'cashier', transactionsProcessed: 234, rating: 4.5 }
    ]
  };
  
  return staffData;
}

async function generateDashboardMetrics(period) {
  // Mock dashboard data
  const dashboard = {
    today: {
      revenue: 2340.50,
      orders: 42,
      customers: 38,
      averageOrderValue: 55.73
    },
    trends: {
      revenueGrowth: 8.5,
      orderGrowth: 12.3,
      customerGrowth: 6.7
    },
    alerts: {
      lowStock: 3,
      pendingOrders: 8,
      unreadFeedback: 5
    },
    topItems: [
      { name: 'Margherita Pizza', orders: 12, revenue: 180.00 },
      { name: 'Caesar Salad', orders: 8, revenue: 96.00 },
      { name: 'Cappuccino', orders: 15, revenue: 67.50 }
    ]
  };
  
  return dashboard;
}

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Report service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3009;

app.listen(PORT, () => {
  logger.info(`📊 Report Service running on port ${PORT}`);
});

module.exports = app;