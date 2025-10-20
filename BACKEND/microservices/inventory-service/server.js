const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.INVENTORY_DB_URI || process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Inventory Item Schema
const inventorySchema = new mongoose.Schema({
  itemID: { type: String, unique: true, required: true },
  itemName: { type: String, required: true, minlength: 2, maxlength: 100 },
  category: {
    type: String,
    required: true,
    enum: ['ingredients', 'beverages', 'dairy', 'meat', 'vegetables', 'spices', 'grains', 'packaging', 'cleaning', 'equipment', 'other']
  },
  subCategory: { type: String, maxlength: 50 },
  brand: { type: String, maxlength: 50 },
  description: { type: String, maxlength: 500 },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'pieces', 'boxes', 'bags', 'bottles', 'cans', 'packets']
  },
  currentStock: { type: Number, required: true, min: 0 },
  minimumStock: { type: Number, required: true, min: 0 },
  maximumStock: { type: Number, required: true },
  reorderLevel: { type: Number, required: true, min: 0 },
  reorderQuantity: { type: Number, required: true, min: 1 },
  unitCost: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, min: 0 },
  supplierInfo: {
    supplierID: { type: String },
    supplierName: { type: String, maxlength: 100 },
    supplierContact: { type: String },
    supplierEmail: { type: String },
    leadTime: { type: Number, min: 1 }, // days
    minimumOrderQuantity: { type: Number, min: 1 }
  },
  storageRequirements: {
    temperature: {
      type: String,
      enum: ['frozen', 'refrigerated', 'room_temperature', 'cool_dry']
    },
    humidity: { type: String },
    specialConditions: { type: String, maxlength: 200 }
  },
  expiryDate: { type: Date },
  batchNumber: { type: String, maxlength: 50 },
  manufacturingDate: { type: Date },
  location: {
    warehouse: { type: String, maxlength: 50 },
    aisle: { type: String, maxlength: 10 },
    shelf: { type: String, maxlength: 10 },
    position: { type: String, maxlength: 10 }
  },
  isActive: { type: Boolean, default: true },
  isPerishable: { type: Boolean, default: false },
  trackExpiry: { type: Boolean, default: false },
  barcodeNumber: { type: String, unique: true, sparse: true },
  skuNumber: { type: String, unique: true, sparse: true },
  lastRestockedDate: { type: Date },
  lastUsedDate: { type: Date },
  averageConsumption: { type: Number, min: 0 }, // per day
  totalConsumed: { type: Number, default: 0, min: 0 },
  totalPurchased: { type: Number, default: 0, min: 0 },
  wasteAmount: { type: Number, default: 0, min: 0 },
  wasteReason: [{
    date: { type: Date },
    quantity: { type: Number, min: 0 },
    reason: { 
      type: String, 
      enum: ['expired', 'damaged', 'contaminated', 'overproduction', 'theft', 'other'] 
    },
    notes: { type: String, maxlength: 200 }
  }],
  stockMovements: [{
    date: { type: Date, default: Date.now },
    type: { 
      type: String, 
      enum: ['purchase', 'usage', 'waste', 'transfer', 'adjustment'] 
    },
    quantity: { type: Number },
    previousStock: { type: Number },
    newStock: { type: Number },
    reference: { type: String }, // Order ID, Transfer ID, etc.
    staffID: { type: String },
    notes: { type: String, maxlength: 200 }
  }],
  alerts: [{
    type: { 
      type: String, 
      enum: ['low_stock', 'expiry_warning', 'overstock', 'reorder_needed'] 
    },
    message: { type: String },
    severity: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'] 
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    acknowledgedAt: { type: Date },
    acknowledgedBy: { type: String }
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    sodium: { type: Number, min: 0 }
  },
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame']
  }],
  tags: [{ type: String, maxlength: 30 }],
  notes: { type: String, maxlength: 500 }
}, {
  timestamps: true
});

// Auto-generate item ID
inventorySchema.pre('save', function(next) {
  if (!this.itemID) {
    this.itemID = `INV${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Check stock levels and create alerts
inventorySchema.pre('save', function(next) {
  this.alerts = this.alerts.filter(alert => alert.isActive);
  
  // Low stock alert
  if (this.currentStock <= this.minimumStock) {
    const existingAlert = this.alerts.find(alert => alert.type === 'low_stock' && alert.isActive);
    if (!existingAlert) {
      this.alerts.push({
        type: 'low_stock',
        message: `Low stock: ${this.itemName} has only ${this.currentStock} ${this.unit} remaining`,
        severity: this.currentStock === 0 ? 'critical' : 'high'
      });
    }
  }
  
  // Reorder needed alert
  if (this.currentStock <= this.reorderLevel) {
    const existingAlert = this.alerts.find(alert => alert.type === 'reorder_needed' && alert.isActive);
    if (!existingAlert) {
      this.alerts.push({
        type: 'reorder_needed',
        message: `Reorder needed: ${this.itemName} has reached reorder level`,
        severity: 'medium'
      });
    }
  }
  
  // Expiry warning (for perishable items)
  if (this.isPerishable && this.expiryDate) {
    const daysUntilExpiry = Math.ceil((this.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 3 && daysUntilExpiry >= 0) {
      const existingAlert = this.alerts.find(alert => alert.type === 'expiry_warning' && alert.isActive);
      if (!existingAlert) {
        this.alerts.push({
          type: 'expiry_warning',
          message: `Expiry warning: ${this.itemName} expires in ${daysUntilExpiry} days`,
          severity: daysUntilExpiry === 0 ? 'critical' : 'high'
        });
      }
    }
  }
  
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

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
    service: 'inventory-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all inventory items (with filtering and pagination)
app.get('/api/v1/inventory', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { 
      category,
      isActive,
      lowStock,
      expiringSoon,
      search,
      sortBy = 'itemName',
      sortOrder = 'asc'
    } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$currentStock', '$minimumStock'] };
    }
    if (expiringSoon === 'true') {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      filter.expiryDate = { $lte: threeDaysFromNow };
      filter.isPerishable = true;
    }
    
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { barcodeNumber: { $regex: search, $options: 'i' } },
        { skuNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const inventoryItems = await Inventory.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await Inventory.countDocuments(filter);
    
    res.status(200).json({
      inventory: inventoryItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    logger.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get inventory item by ID
app.get('/api/v1/inventory/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    res.status(200).json({ item });
  } catch (error) {
    logger.error('Get inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new inventory item
app.post('/api/v1/inventory', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('write') && !req.user.permissions.includes('manage_inventory')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const itemData = req.body;
    
    // Check if item already exists
    const existingItem = await Inventory.findOne({ 
      $or: [
        { itemName: itemData.itemName },
        { barcodeNumber: itemData.barcodeNumber },
        { skuNumber: itemData.skuNumber }
      ]
    });
    
    if (existingItem) {
      return res.status(409).json({ error: 'Inventory item already exists' });
    }
    
    const item = new Inventory(itemData);
    
    // Add initial stock movement
    if (item.currentStock > 0) {
      item.stockMovements.push({
        type: 'purchase',
        quantity: item.currentStock,
        previousStock: 0,
        newStock: item.currentStock,
        staffID: req.user.id,
        notes: 'Initial stock entry'
      });
    }
    
    await item.save();
    
    logger.info(`New inventory item added: ${item.itemName}`);
    
    res.status(201).json({
      message: 'Inventory item added successfully',
      item
    });
  } catch (error) {
    logger.error('Add inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update inventory item
app.put('/api/v1/inventory/:id', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('write') && !req.user.permissions.includes('manage_inventory')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const updates = req.body;
    delete updates.itemID; // Prevent ID updates
    delete updates.stockMovements; // Prevent direct stock movement updates
    
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    logger.info(`Inventory item updated: ${item.itemName}`);
    
    res.status(200).json({
      message: 'Inventory item updated successfully',
      item
    });
  } catch (error) {
    logger.error('Update inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update stock levels
app.patch('/api/v1/inventory/:id/stock', authenticateToken, async (req, res) => {
  try {
    const { quantity, type, reference, notes } = req.body;
    
    if (!quantity || !type) {
      return res.status(400).json({ error: 'Quantity and type are required' });
    }
    
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    const previousStock = item.currentStock;
    let newStock;
    
    switch (type) {
      case 'purchase':
        newStock = previousStock + Math.abs(quantity);
        item.lastRestockedDate = new Date();
        item.totalPurchased += Math.abs(quantity);
        break;
      case 'usage':
        newStock = Math.max(0, previousStock - Math.abs(quantity));
        item.lastUsedDate = new Date();
        item.totalConsumed += Math.abs(quantity);
        break;
      case 'waste':
        newStock = Math.max(0, previousStock - Math.abs(quantity));
        item.wasteAmount += Math.abs(quantity);
        break;
      case 'adjustment':
        newStock = Math.max(0, quantity);
        break;
      default:
        return res.status(400).json({ error: 'Invalid stock movement type' });
    }
    
    item.currentStock = newStock;
    
    // Add stock movement record
    item.stockMovements.push({
      type,
      quantity: type === 'usage' || type === 'waste' ? -Math.abs(quantity) : Math.abs(quantity),
      previousStock,
      newStock,
      reference,
      staffID: req.user.id,
      notes
    });
    
    await item.save();
    
    logger.info(`Stock updated for ${item.itemName}: ${previousStock} → ${newStock} ${item.unit}`);
    
    res.status(200).json({
      message: 'Stock updated successfully',
      item: {
        itemID: item.itemID,
        itemName: item.itemName,
        previousStock,
        currentStock: item.currentStock,
        unit: item.unit
      }
    });
  } catch (error) {
    logger.error('Update stock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get low stock items
app.get('/api/v1/inventory/alerts/low-stock', authenticateToken, async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$currentStock', '$minimumStock'] },
      isActive: true
    })
    .select('itemID itemName currentStock minimumStock unit category')
    .sort({ currentStock: 1 });
    
    res.status(200).json({ items: lowStockItems });
  } catch (error) {
    logger.error('Get low stock items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expiring items
app.get('/api/v1/inventory/alerts/expiring', authenticateToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    const expiringItems = await Inventory.find({
      isPerishable: true,
      expiryDate: { $lte: expiryDate, $gte: new Date() },
      isActive: true
    })
    .select('itemID itemName expiryDate currentStock unit category')
    .sort({ expiryDate: 1 });
    
    res.status(200).json({ items: expiringItems });
  } catch (error) {
    logger.error('Get expiring items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get inventory analytics
app.get('/api/v1/inventory/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const analytics = await Inventory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$currentStock', '$unitCost'] } },
          lowStockItems: { 
            $sum: { $cond: [{ $lte: ['$currentStock', '$minimumStock'] }, 1, 0] } 
          },
          outOfStockItems: { 
            $sum: { $cond: [{ $eq: ['$currentStock', 0] }, 1, 0] } 
          },
          totalWaste: { $sum: '$wasteAmount' },
          averageConsumption: { $avg: '$averageConsumption' }
        }
      }
    ]);
    
    const categoryDistribution = await Inventory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$currentStock', '$unitCost'] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const expiringCount = await Inventory.countDocuments({
      isPerishable: true,
      expiryDate: { 
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        $gte: new Date()
      },
      isActive: true
    });
    
    res.status(200).json({
      summary: {
        ...analytics[0],
        expiringItems: expiringCount
      },
      categoryDistribution
    });
  } catch (error) {
    logger.error('Get inventory analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Inventory service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  logger.info(`📦 Inventory Service running on port ${PORT}`);
});

module.exports = app;