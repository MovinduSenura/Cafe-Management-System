const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Staff Schema
const staffSchema = new mongoose.Schema({
  staffID: { type: String, unique: true, required: true },
  staffName: { type: String, required: true, minlength: 2, maxlength: 100 },
  staffEmail: { type: String, required: true, unique: true },
  staffPassword: { type: String, required: true, minlength: 6 },
  staffRole: { 
    type: String, 
    required: true,
    enum: ['admin', 'manager', 'chef', 'cashier', 'waiter', 'cleaner']
  },
  staffPhone: { type: String, required: true },
  staffAddress: { type: String, required: true },
  department: {
    type: String,
    enum: ['kitchen', 'service', 'management', 'cleaning'],
    required: true
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  refreshToken: { type: String },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'manage_orders', 'manage_inventory', 'manage_staff', 'view_reports']
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Pre-save middleware for password hashing
staffSchema.pre('save', async function(next) {
  if (!this.isModified('staffPassword')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.staffPassword = await bcrypt.hash(this.staffPassword, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate staff ID
staffSchema.pre('save', function(next) {
  if (!this.staffID) {
    this.staffID = `STAFF${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const Staff = mongoose.model('Staff', staffSchema);

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

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Utility functions
const generateTokens = (staff) => {
  const accessToken = jwt.sign(
    { 
      id: staff._id, 
      email: staff.staffEmail, 
      role: staff.staffRole,
      permissions: staff.permissions 
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: staff._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// User registration (admin only in production)
app.post('/api/v1/register', async (req, res) => {
  try {
    const { staffName, staffEmail, staffPassword, staffRole, staffPhone, staffAddress, department } = req.body;
    
    // Check if user already exists
    const existingStaff = await Staff.findOne({ staffEmail });
    if (existingStaff) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create new staff member
    const staff = new Staff({
      staffName,
      staffEmail,
      staffPassword,
      staffRole,
      staffPhone,
      staffAddress,
      department,
      permissions: getPermissionsByRole(staffRole)
    });
    
    await staff.save();
    
    logger.info(`New staff member registered: ${staff.staffEmail}`);
    
    res.status(201).json({
      message: 'Staff member registered successfully',
      staff: {
        id: staff._id,
        staffID: staff.staffID,
        staffName: staff.staffName,
        staffEmail: staff.staffEmail,
        staffRole: staff.staffRole,
        department: staff.department
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/v1/login', authLimiter, async (req, res) => {
  try {
    const { staffEmail, staffPassword } = req.body;
    
    if (!staffEmail || !staffPassword) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find staff member
    const staff = await Staff.findOne({ staffEmail });
    if (!staff) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if account is locked
    if (staff.lockUntil && staff.lockUntil > Date.now()) {
      return res.status(423).json({ error: 'Account temporarily locked due to too many failed attempts' });
    }
    
    // Check if account is active
    if (!staff.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(staffPassword, staff.staffPassword);
    if (!isValidPassword) {
      // Increment login attempts
      staff.loginAttempts += 1;
      if (staff.loginAttempts >= 5) {
        staff.lockUntil = Date.now() + (15 * 60 * 1000); // Lock for 15 minutes
      }
      await staff.save();
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Reset login attempts and generate tokens
    staff.loginAttempts = 0;
    staff.lockUntil = undefined;
    staff.lastLogin = new Date();
    
    const { accessToken, refreshToken } = generateTokens(staff);
    staff.refreshToken = refreshToken;
    await staff.save();
    
    logger.info(`Staff member logged in: ${staff.staffEmail}`);
    
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: staff._id,
        staffID: staff.staffID,
        staffName: staff.staffName,
        staffEmail: staff.staffEmail,
        staffRole: staff.staffRole,
        department: staff.department,
        permissions: staff.permissions
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token refresh
app.post('/api/v1/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const staff = await Staff.findById(decoded.id);
    
    if (!staff || staff.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(staff);
    staff.refreshToken = newRefreshToken;
    await staff.save();
    
    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// Logout
app.post('/api/v1/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await Staff.updateOne(
        { refreshToken },
        { $unset: { refreshToken: 1 } }
      );
    }
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/v1/profile', authenticateToken, async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id).select('-staffPassword -refreshToken');
    
    if (!staff) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user: staff });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Helper function to get permissions by role
function getPermissionsByRole(role) {
  const rolePermissions = {
    admin: ['read', 'write', 'delete', 'manage_orders', 'manage_inventory', 'manage_staff', 'view_reports'],
    manager: ['read', 'write', 'manage_orders', 'manage_inventory', 'view_reports'],
    chef: ['read', 'manage_orders'],
    cashier: ['read', 'write', 'manage_orders'],
    waiter: ['read', 'manage_orders'],
    cleaner: ['read']
  };
  
  return rolePermissions[role] || ['read'];
}

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('User service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`🔐 User Service running on port ${PORT}`);
});

module.exports = app;