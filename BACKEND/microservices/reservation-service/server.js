const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.RESERVATION_DB_URI || process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Table Schema
const tableSchema = new mongoose.Schema({
  tableID: { type: String, unique: true, required: true },
  tableNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true, min: 1, max: 20 },
  location: {
    type: String,
    enum: ['indoor', 'outdoor', 'private_room', 'bar', 'terrace'],
    default: 'indoor'
  },
  section: { type: String, maxlength: 50 },
  floor: { type: Number, min: 1, default: 1 },
  isActive: { type: Boolean, default: true },
  amenities: [{
    type: String,
    enum: ['window_view', 'wheelchair_accessible', 'high_chair_available', 'power_outlet', 'privacy_screen']
  }],
  shape: {
    type: String,
    enum: ['round', 'square', 'rectangular', 'booth'],
    default: 'rectangular'
  },
  notes: { type: String, maxlength: 200 }
}, {
  timestamps: true
});

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  reservationID: { type: String, unique: true, required: true },
  customerID: { type: String, required: true },
  customerName: { type: String, required: true, minlength: 2, maxlength: 100 },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1, max: 50 },
  reservationDate: { type: Date, required: true },
  reservationTime: { type: String, required: true }, // "HH:MM" format
  duration: { type: Number, default: 120 }, // duration in minutes
  endTime: { type: String }, // calculated end time
  tableID: { type: String },
  tableNumber: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  reservationType: {
    type: String,
    enum: ['regular', 'special_occasion', 'business', 'date_night', 'family', 'group'],
    default: 'regular'
  },
  specialRequests: { type: String, maxlength: 500 },
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'nut_allergy', 'halal', 'kosher']
  }],
  occasion: {
    type: String,
    enum: ['birthday', 'anniversary', 'date', 'business_meeting', 'celebration', 'other']
  },
  preferredSeating: {
    type: String,
    enum: ['window', 'quiet_area', 'private', 'outdoor', 'bar', 'no_preference'],
    default: 'no_preference'
  },
  source: {
    type: String,
    enum: ['phone', 'website', 'app', 'walk_in', 'third_party'],
    default: 'phone'
  },
  depositRequired: { type: Boolean, default: false },
  depositAmount: { type: Number, min: 0, default: 0 },
  depositPaid: { type: Boolean, default: false },
  prepaymentAmount: { type: Number, min: 0, default: 0 },
  estimatedBill: { type: Number, min: 0 },
  actualBill: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  seatedAt: { type: Date },
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String, maxlength: 200 },
  waitlistPosition: { type: Number },
  isWaitlisted: { type: Boolean, default: false },
  notifications: {
    confirmationSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    followUpSent: { type: Boolean, default: false }
  },
  staffAssigned: {
    hostID: { type: String },
    hostName: { type: String },
    waiterID: { type: String },
    waiterName: { type: String }
  },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String, maxlength: 1000 },
  feedbackDate: { type: Date },
  tags: [{ type: String, maxlength: 30 }],
  notes: { type: String, maxlength: 500 }
}, {
  timestamps: true
});

// Auto-generate table ID
tableSchema.pre('save', function(next) {
  if (!this.tableID) {
    this.tableID = `TBL${this.tableNumber.padStart(3, '0')}`;
  }
  next();
});

// Auto-generate reservation ID
reservationSchema.pre('save', function(next) {
  if (!this.reservationID) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = Date.now().toString().slice(-6);
    this.reservationID = `RES${dateStr}${timeStr}`;
  }
  next();
});

// Calculate end time based on reservation time and duration
reservationSchema.pre('save', function(next) {
  if (this.reservationTime && this.duration) {
    const [hours, minutes] = this.reservationTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + this.duration, 0, 0);
    this.endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  }
  next();
});

const Table = mongoose.model('Table', tableSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);

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
    service: 'reservation-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all tables
app.get('/api/v1/tables', authenticateToken, async (req, res) => {
  try {
    const { location, capacity, isActive, floor } = req.query;
    
    let filter = {};
    if (location) filter.location = location;
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (floor) filter.floor = parseInt(floor);
    
    const tables = await Table.find(filter).sort({ tableNumber: 1 });
    
    res.status(200).json({ tables });
  } catch (error) {
    logger.error('Get tables error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new table
app.post('/api/v1/tables', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('write') && !req.user.permissions.includes('manage_inventory')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const tableData = req.body;
    
    // Check if table number already exists
    const existingTable = await Table.findOne({ tableNumber: tableData.tableNumber });
    if (existingTable) {
      return res.status(409).json({ error: 'Table number already exists' });
    }
    
    const table = new Table(tableData);
    await table.save();
    
    logger.info(`New table added: ${table.tableNumber}`);
    
    res.status(201).json({
      message: 'Table added successfully',
      table
    });
  } catch (error) {
    logger.error('Add table error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check table availability
app.get('/api/v1/tables/availability', async (req, res) => {
  try {
    const { date, time, duration = 120, partySize } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time are required' });
    }
    
    const reservationDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Calculate time range for conflict checking
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + parseInt(duration);
    
    // Find conflicting reservations
    const conflictingReservations = await Reservation.find({
      reservationDate,
      status: { $in: ['confirmed', 'seated'] },
      $expr: {
        $and: [
          { $lt: [{ $add: [{ $multiply: [{ $toInt: { $substr: ['$reservationTime', 0, 2] } }, 60] }, { $toInt: { $substr: ['$reservationTime', 3, 2] } }] }, endMinutes] },
          { $gt: [{ $add: [{ $multiply: [{ $toInt: { $substr: ['$reservationTime', 0, 2] } }, 60] }, { $toInt: { $substr: ['$reservationTime', 3, 2] } }, '$duration'] }, startMinutes] }
        ]
      }
    });
    
    const occupiedTableIDs = conflictingReservations.map(res => res.tableID);
    
    // Find available tables
    let tableFilter = { isActive: true };
    if (partySize) tableFilter.capacity = { $gte: parseInt(partySize) };
    
    const availableTables = await Table.find({
      ...tableFilter,
      tableID: { $nin: occupiedTableIDs }
    }).sort({ capacity: 1, tableNumber: 1 });
    
    res.status(200).json({ 
      availableTables,
      totalAvailable: availableTables.length
    });
  } catch (error) {
    logger.error('Check availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reservations (with filtering and pagination)
app.get('/api/v1/reservations', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { 
      date,
      status,
      customerID,
      tableNumber,
      sortBy = 'reservationDate',
      sortOrder = 'asc'
    } = req.query;
    
    let filter = {};
    
    if (date) {
      const queryDate = new Date(date);
      filter.reservationDate = {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lte: new Date(queryDate.setHours(23, 59, 59, 999))
      };
    }
    
    if (status) filter.status = status;
    if (customerID) filter.customerID = customerID;
    if (tableNumber) filter.tableNumber = tableNumber;
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const reservations = await Reservation.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await Reservation.countDocuments(filter);
    
    res.status(200).json({
      reservations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    logger.error('Get reservations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new reservation
app.post('/api/v1/reservations', async (req, res) => {
  try {
    const reservationData = req.body;
    
    // Validate required fields
    if (!reservationData.customerName || !reservationData.customerEmail || 
        !reservationData.reservationDate || !reservationData.reservationTime || 
        !reservationData.partySize) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check table availability
    const { reservationDate, reservationTime, duration = 120, partySize } = reservationData;
    
    const availabilityResponse = await checkTableAvailability(reservationDate, reservationTime, duration, partySize);
    
    if (availabilityResponse.availableTables.length === 0) {
      // Add to waitlist
      reservationData.isWaitlisted = true;
      reservationData.status = 'pending';
      
      const waitlistCount = await Reservation.countDocuments({
        reservationDate: new Date(reservationDate),
        isWaitlisted: true,
        status: 'pending'
      });
      
      reservationData.waitlistPosition = waitlistCount + 1;
    } else {
      // Assign best available table
      const bestTable = availabilityResponse.availableTables[0];
      reservationData.tableID = bestTable.tableID;
      reservationData.tableNumber = bestTable.tableNumber;
      reservationData.status = 'confirmed';
      reservationData.confirmedAt = new Date();
    }
    
    const reservation = new Reservation(reservationData);
    await reservation.save();
    
    logger.info(`New reservation created: ${reservation.reservationID} for ${reservation.customerName}`);
    
    res.status(201).json({
      message: reservation.isWaitlisted ? 'Added to waitlist' : 'Reservation confirmed',
      reservation
    });
  } catch (error) {
    logger.error('Create reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reservation status
app.patch('/api/v1/reservations/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, staffID, staffName, cancellationReason } = req.body;
    
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    const previousStatus = reservation.status;
    reservation.status = status;
    
    // Update timestamps based on status
    const now = new Date();
    switch (status) {
      case 'confirmed':
        reservation.confirmedAt = now;
        if (staffID) {
          reservation.staffAssigned.hostID = staffID;
          reservation.staffAssigned.hostName = staffName;
        }
        break;
      case 'seated':
        reservation.seatedAt = now;
        if (staffID) {
          reservation.staffAssigned.waiterID = staffID;
          reservation.staffAssigned.waiterName = staffName;
        }
        break;
      case 'completed':
        reservation.completedAt = now;
        break;
      case 'cancelled':
        reservation.cancelledAt = now;
        if (cancellationReason) {
          reservation.cancellationReason = cancellationReason;
        }
        // Free up the table for others
        await processWaitlist(reservation.reservationDate, reservation.reservationTime);
        break;
    }
    
    await reservation.save();
    
    logger.info(`Reservation ${reservation.reservationID} status updated from ${previousStatus} to ${status}`);
    
    res.status(200).json({
      message: 'Reservation status updated successfully',
      reservation: {
        reservationID: reservation.reservationID,
        status: reservation.status,
        previousStatus
      }
    });
  } catch (error) {
    logger.error('Update reservation status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add feedback to reservation
app.post('/api/v1/reservations/:id/feedback', async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { 
        rating, 
        feedback, 
        feedbackDate: new Date() 
      },
      { new: true }
    );
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    logger.info(`Feedback added to reservation ${reservation.reservationID}: Rating ${rating}/5`);
    
    res.status(200).json({
      message: 'Feedback added successfully',
      reservation: {
        reservationID: reservation.reservationID,
        rating: reservation.rating,
        feedback: reservation.feedback
      }
    });
  } catch (error) {
    logger.error('Add feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reservation analytics
app.get('/api/v1/reservations/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let dateFilter = {};
    
    if (dateFrom || dateTo) {
      dateFilter.reservationDate = {};
      if (dateFrom) dateFilter.reservationDate.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.reservationDate.$lte = new Date(dateTo);
    }
    
    const analytics = await Reservation.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalReservations: { $sum: 1 },
          confirmedReservations: { 
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } 
          },
          completedReservations: { 
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
          },
          cancelledReservations: { 
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } 
          },
          noShowReservations: { 
            $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] } 
          },
          averagePartySize: { $avg: '$partySize' },
          totalGuests: { $sum: '$partySize' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    
    const statusDistribution = await Reservation.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const timeSlotDistribution = await Reservation.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$reservationTime',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      summary: analytics[0] || {},
      statusDistribution,
      timeSlotDistribution
    });
  } catch (error) {
    logger.error('Get reservation analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
async function checkTableAvailability(date, time, duration, partySize) {
  const reservationDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  
  const startMinutes = hours * 60 + minutes;
  const endMinutes = startMinutes + parseInt(duration);
  
  const conflictingReservations = await Reservation.find({
    reservationDate,
    status: { $in: ['confirmed', 'seated'] },
    $expr: {
      $and: [
        { $lt: [{ $add: [{ $multiply: [{ $toInt: { $substr: ['$reservationTime', 0, 2] } }, 60] }, { $toInt: { $substr: ['$reservationTime', 3, 2] } }] }, endMinutes] },
        { $gt: [{ $add: [{ $multiply: [{ $toInt: { $substr: ['$reservationTime', 0, 2] } }, 60] }, { $toInt: { $substr: ['$reservationTime', 3, 2] } }, '$duration'] }, startMinutes] }
      ]
    }
  });
  
  const occupiedTableIDs = conflictingReservations.map(res => res.tableID);
  
  let tableFilter = { isActive: true };
  if (partySize) tableFilter.capacity = { $gte: parseInt(partySize) };
  
  const availableTables = await Table.find({
    ...tableFilter,
    tableID: { $nin: occupiedTableIDs }
  }).sort({ capacity: 1, tableNumber: 1 });
  
  return { availableTables };
}

async function processWaitlist(date, time) {
  // Check if any waitlisted reservations can now be accommodated
  const waitlistedReservations = await Reservation.find({
    reservationDate: date,
    isWaitlisted: true,
    status: 'pending'
  }).sort({ waitlistPosition: 1 });
  
  for (const reservation of waitlistedReservations) {
    const availability = await checkTableAvailability(
      reservation.reservationDate,
      reservation.reservationTime,
      reservation.duration,
      reservation.partySize
    );
    
    if (availability.availableTables.length > 0) {
      const table = availability.availableTables[0];
      reservation.tableID = table.tableID;
      reservation.tableNumber = table.tableNumber;
      reservation.isWaitlisted = false;
      reservation.status = 'confirmed';
      reservation.confirmedAt = new Date();
      
      await reservation.save();
      
      logger.info(`Waitlisted reservation ${reservation.reservationID} confirmed with table ${table.tableNumber}`);
      break;
    }
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Reservation service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  logger.info(`🪑 Reservation Service running on port ${PORT}`);
});

module.exports = app;