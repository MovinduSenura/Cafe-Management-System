const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.MENU_DB_URI || process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  itemID: { type: String, unique: true, required: true },
  itemName: { type: String, required: true, minlength: 2, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  category: {
    type: String,
    required: true,
    enum: ['appetizers', 'main_course', 'desserts', 'beverages', 'salads', 'soups', 'pasta', 'pizza', 'burgers', 'sandwiches', 'seafood', 'vegetarian', 'vegan', 'specials']
  },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  ingredients: [{ type: String }],
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame']
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 }
  },
  preparationTime: { type: Number, required: true, min: 1 }, // in minutes
  servingSize: { type: String, default: '1 serving' },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'very_hot'],
    default: 'mild'
  },
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'keto', 'low_carb', 'high_protein', 'halal', 'kosher']
  }],
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  imageUrl: { type: String },
  galleryImages: [{ type: String }],
  chef: { type: String },
  cuisine: {
    type: String,
    enum: ['italian', 'chinese', 'indian', 'mexican', 'american', 'mediterranean', 'thai', 'japanese', 'french', 'fusion']
  },
  portionSize: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra_large'],
    default: 'medium'
  },
  totalOrders: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  lastOrdered: { type: Date },
  seasonality: [{
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter', 'year_round']
  }],
  availableHours: {
    start: { type: String }, // "HH:MM" format
    end: { type: String }    // "HH:MM" format
  },
  discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
  tags: [{ type: String }],
  notes: { type: String, maxlength: 200 }
}, {
  timestamps: true
});

// Auto-generate item ID
menuItemSchema.pre('save', function(next) {
  if (!this.itemID) {
    this.itemID = `MENU${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Calculate final price with discount
menuItemSchema.virtual('finalPrice').get(function() {
  if (this.discountPercentage > 0) {
    return this.price * (1 - this.discountPercentage / 100);
  }
  return this.price;
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

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
    service: 'menu-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all menu items (with filtering and pagination)
app.get('/api/v1/menu-items', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { 
      category, 
      cuisine, 
      isAvailable, 
      isPopular, 
      isFeatured,
      minPrice, 
      maxPrice, 
      dietaryTags, 
      spiceLevel,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (cuisine) filter.cuisine = cuisine;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (isPopular !== undefined) filter.isPopular = isPopular === 'true';
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (spiceLevel) filter.spiceLevel = spiceLevel;
    if (dietaryTags) filter.dietaryTags = { $in: dietaryTags.split(',') };
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const menuItems = await MenuItem.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await MenuItem.countDocuments(filter);
    
    res.status(200).json({
      menuItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    logger.error('Get menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get menu item by ID
app.get('/api/v1/menu-items/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.status(200).json({ menuItem });
  } catch (error) {
    logger.error('Get menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new menu item
app.post('/api/v1/menu-items', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('write') && !req.user.permissions.includes('manage_inventory')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const menuItemData = req.body;
    
    // Check if item already exists
    const existingItem = await MenuItem.findOne({ itemName: menuItemData.itemName });
    if (existingItem) {
      return res.status(409).json({ error: 'Menu item already exists' });
    }
    
    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();
    
    logger.info(`New menu item created: ${menuItem.itemName}`);
    
    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    logger.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update menu item
app.put('/api/v1/menu-items/:id', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('write') && !req.user.permissions.includes('manage_inventory')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const updates = req.body;
    delete updates.itemID; // Prevent ID updates
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    logger.info(`Menu item updated: ${menuItem.itemName}`);
    
    res.status(200).json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    logger.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item
app.delete('/api/v1/menu-items/:id', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('delete') && !req.user.permissions.includes('manage_inventory')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    logger.info(`Menu item deleted: ${menuItem.itemName}`);
    
    res.status(200).json({
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    logger.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle availability
app.patch('/api/v1/menu-items/:id/availability', authenticateToken, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    logger.info(`Menu item availability updated: ${menuItem.itemName} - ${isAvailable}`);
    
    res.status(200).json({
      message: 'Availability updated successfully',
      menuItem: {
        itemID: menuItem.itemID,
        itemName: menuItem.itemName,
        isAvailable: menuItem.isAvailable
      }
    });
  } catch (error) {
    logger.error('Update availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item rating
app.post('/api/v1/menu-items/:id/rating', async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    // Calculate new average rating
    const newTotalRating = (menuItem.rating * menuItem.reviewCount) + rating;
    menuItem.reviewCount += 1;
    menuItem.rating = newTotalRating / menuItem.reviewCount;
    
    await menuItem.save();
    
    res.status(200).json({
      message: 'Rating updated successfully',
      menuItem: {
        itemID: menuItem.itemID,
        itemName: menuItem.itemName,
        rating: menuItem.rating,
        reviewCount: menuItem.reviewCount
      }
    });
  } catch (error) {
    logger.error('Update rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get categories
app.get('/api/v1/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    const categoryStats = await MenuItem.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      categories,
      statistics: categoryStats
    });
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get popular items
app.get('/api/v1/menu-items/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const popularItems = await MenuItem.find({ isAvailable: true })
      .sort({ totalOrders: -1, rating: -1 })
      .limit(limit);
    
    res.status(200).json({ popularItems });
  } catch (error) {
    logger.error('Get popular items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Menu service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  logger.info(`🍽️ Menu Service running on port ${PORT}`);
});

module.exports = app;