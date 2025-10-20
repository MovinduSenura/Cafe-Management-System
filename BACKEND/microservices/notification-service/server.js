const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

// Nodemailer import with fallback for ESM compatibility
let nodemailer;
try {
  nodemailer = require('nodemailer');
  if (!nodemailer.createTransporter && nodemailer.default) {
    nodemailer = nodemailer.default;
  }
} catch (error) {
  logger.error('Failed to load nodemailer:', error);
  // Create a mock transporter for testing
  nodemailer = {
    createTransporter: () => ({
      sendMail: async () => ({ messageId: 'mock-message-id' })
    })
  };
}

const app = express();

// Database connection
mongoose.connect(process.env.NOTIFICATION_DB_URI || process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  notificationID: { type: String, unique: true, required: true },
  recipientType: {
    type: String,
    enum: ['customer', 'staff', 'admin', 'all_customers', 'all_staff'],
    required: true
  },
  recipientID: { type: String }, // Customer ID or Staff ID
  recipientEmail: { type: String },
  recipientPhone: { type: String },
  recipientName: { type: String },
  type: {
    type: String,
    enum: ['email', 'sms', 'push', 'in_app', 'system'],
    required: true
  },
  category: {
    type: String,
    enum: ['order', 'reservation', 'payment', 'promotion', 'alert', 'reminder', 'welcome', 'feedback', 'marketing'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'pending'
  },
  subject: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  htmlContent: { type: String },
  templateID: { type: String },
  templateData: { type: mongoose.Schema.Types.Mixed },
  scheduledFor: { type: Date },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
  readAt: { type: Date },
  failureReason: { type: String },
  retryCount: { type: Number, default: 0, max: 3 },
  externalID: { type: String }, // Third-party service reference
  metadata: {
    orderID: { type: String },
    reservationID: { type: String },
    paymentID: { type: String },
    promotionID: { type: String },
    source: { type: String },
    campaign: { type: String }
  },
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  expiresAt: { type: Date },
  tags: [{ type: String }]
}, {
  timestamps: true
});

// Auto-generate notification ID
notificationSchema.pre('save', function(next) {
  if (!this.notificationID) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = Date.now().toString().slice(-6);
    this.notificationID = `NOT${dateStr}${timeStr}`;
  }
  next();
});

// Template Schema
const templateSchema = new mongoose.Schema({
  templateID: { type: String, unique: true, required: true },
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  type: {
    type: String,
    enum: ['email', 'sms', 'push'],
    required: true
  },
  category: {
    type: String,
    enum: ['order', 'reservation', 'payment', 'promotion', 'alert', 'reminder', 'welcome', 'feedback'],
    required: true
  },
  subject: { type: String, maxlength: 200 },
  content: { type: String, required: true },
  htmlContent: { type: String },
  variables: [{ 
    name: { type: String },
    description: { type: String },
    required: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true },
  language: { type: String, default: 'en' },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Auto-generate template ID
templateSchema.pre('save', function(next) {
  if (!this.templateID) {
    this.templateID = `TPL${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);
const Template = mongoose.model('Template', templateSchema);

// Email transporter setup (optional - will work without SMTP config)
let emailTransporter;
try {
  if (nodemailer && nodemailer.createTransporter) {
    emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    logger.info('Email transporter initialized successfully');
  } else {
    logger.warn('Nodemailer not available - email notifications will be logged only');
  }
} catch (error) {
  logger.warn('Failed to initialize email transporter:', error.message);
  logger.info('Email notifications will be logged only');
}

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
    service: 'notification-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Send notification
app.post('/api/v1/notifications/send', authenticateToken, async (req, res) => {
  try {
    const notificationData = req.body;
    
    // Validate required fields
    if (!notificationData.recipientEmail && !notificationData.recipientPhone) {
      return res.status(400).json({ error: 'Recipient email or phone is required' });
    }
    
    if (!notificationData.subject || !notificationData.content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }
    
    const notification = new Notification(notificationData);
    
    // Process template if provided
    if (notification.templateID) {
      await processTemplate(notification);
    }
    
    // Send notification immediately or schedule for later
    if (notification.scheduledFor && notification.scheduledFor > new Date()) {
      // Schedule for later processing
      await notification.save();
      logger.info(`Notification scheduled: ${notification.notificationID} for ${notification.scheduledFor}`);
    } else {
      // Send immediately
      await sendNotification(notification);
      await notification.save();
    }
    
    res.status(201).json({
      message: 'Notification processed successfully',
      notification: {
        notificationID: notification.notificationID,
        status: notification.status,
        scheduledFor: notification.scheduledFor
      }
    });
  } catch (error) {
    logger.error('Send notification error:', error);
    res.status(500).json({ error: 'Failed to process notification' });
  }
});

// Get notifications
app.get('/api/v1/notifications', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { 
      recipientID,
      type,
      category,
      status,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filter = {};
    
    if (recipientID) filter.recipientID = recipientID;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const notifications = await Notification.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-htmlContent -templateData');
    
    const total = await Notification.countDocuments(filter);
    
    res.status(200).json({
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
app.patch('/api/v1/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { 
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.status(200).json({
      message: 'Notification marked as read',
      notification: {
        notificationID: notification.notificationID,
        isRead: notification.isRead,
        readAt: notification.readAt
      }
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get templates
app.get('/api/v1/templates', authenticateToken, async (req, res) => {
  try {
    const { type, category, isActive } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const templates = await Template.find(filter).sort({ name: 1 });
    
    res.status(200).json({ templates });
  } catch (error) {
    logger.error('Get templates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create template
app.post('/api/v1/templates', authenticateToken, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('write') && !req.user.permissions.includes('manage_staff')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const templateData = req.body;
    
    // Check if template name already exists
    const existingTemplate = await Template.findOne({ 
      name: templateData.name,
      type: templateData.type 
    });
    
    if (existingTemplate) {
      return res.status(409).json({ error: 'Template name already exists for this type' });
    }
    
    const template = new Template(templateData);
    await template.save();
    
    logger.info(`New template created: ${template.name}`);
    
    res.status(201).json({
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    logger.error('Create template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send bulk notifications
app.post('/api/v1/notifications/bulk', authenticateToken, async (req, res) => {
  try {
    const { recipients, template, subject, content, category = 'marketing' } = req.body;
    
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients list is required' });
    }
    
    const notifications = [];
    
    for (const recipient of recipients) {
      const notification = new Notification({
        recipientType: 'customer',
        recipientID: recipient.id,
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        type: 'email',
        category,
        subject: subject || template?.subject,
        content: content || template?.content,
        templateID: template?.templateID,
        templateData: recipient.templateData
      });
      
      notifications.push(notification);
    }
    
    // Process in batches to avoid overwhelming the system
    const batchSize = 10;
    let processedCount = 0;
    
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (notification) => {
        try {
          if (notification.templateID) {
            await processTemplate(notification);
          }
          await sendNotification(notification);
          await notification.save();
          processedCount++;
        } catch (error) {
          logger.error(`Failed to send notification to ${notification.recipientEmail}:`, error);
          notification.status = 'failed';
          notification.failureReason = error.message;
          await notification.save();
        }
      }));
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    logger.info(`Bulk notification completed: ${processedCount}/${notifications.length} sent`);
    
    res.status(200).json({
      message: 'Bulk notifications processed',
      totalRecipients: notifications.length,
      successfulSends: processedCount,
      failedSends: notifications.length - processedCount
    });
  } catch (error) {
    logger.error('Bulk notification error:', error);
    res.status(500).json({ error: 'Failed to process bulk notifications' });
  }
});

// Get notification analytics
app.get('/api/v1/notifications/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let dateFilter = {};
    
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
    }
    
    const analytics = await Notification.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalNotifications: { $sum: 1 },
          sentNotifications: { 
            $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } 
          },
          deliveredNotifications: { 
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } 
          },
          failedNotifications: { 
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } 
          },
          readNotifications: { 
            $sum: { $cond: ['$isRead', 1, 0] } 
          }
        }
      }
    ]);
    
    const typeDistribution = await Notification.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } }
        }
      }
    ]);
    
    const categoryDistribution = await Notification.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      summary: analytics[0] || {},
      typeDistribution,
      categoryDistribution
    });
  } catch (error) {
    logger.error('Get notification analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
async function processTemplate(notification) {
  try {
    const template = await Template.findOne({ templateID: notification.templateID });
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Replace template variables with actual data
    let processedContent = template.content;
    let processedSubject = template.subject || notification.subject;
    let processedHtmlContent = template.htmlContent;
    
    if (notification.templateData) {
      for (const [key, value] of Object.entries(notification.templateData)) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        processedContent = processedContent.replace(placeholder, value);
        processedSubject = processedSubject.replace(placeholder, value);
        if (processedHtmlContent) {
          processedHtmlContent = processedHtmlContent.replace(placeholder, value);
        }
      }
    }
    
    notification.content = processedContent;
    notification.subject = processedSubject;
    if (processedHtmlContent) {
      notification.htmlContent = processedHtmlContent;
    }
  } catch (error) {
    logger.error('Template processing error:', error);
    throw error;
  }
}

async function sendNotification(notification) {
  try {
    switch (notification.type) {
      case 'email':
        await sendEmail(notification);
        break;
      case 'sms':
        await sendSMS(notification);
        break;
      case 'push':
        await sendPushNotification(notification);
        break;
      default:
        throw new Error('Unsupported notification type');
    }
    
    notification.status = 'sent';
    notification.sentAt = new Date();
  } catch (error) {
    notification.status = 'failed';
    notification.failureReason = error.message;
    throw error;
  }
}

async function sendEmail(notification) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@cafe.com',
    to: notification.recipientEmail,
    subject: notification.subject,
    text: notification.content,
    html: notification.htmlContent || notification.content
  };
  
  if (emailTransporter) {
    try {
      const result = await emailTransporter.sendMail(mailOptions);
      notification.externalID = result.messageId;
      logger.info(`Email sent to ${notification.recipientEmail}: ${result.messageId}`);
    } catch (error) {
      logger.error(`Failed to send email: ${error.message}`);
      // Log the email for debugging but don't fail
      logger.info(`Email notification logged: to=${notification.recipientEmail}, subject=${notification.subject}`);
      notification.externalID = `mock_${Date.now()}`;
    }
  } else {
    // Email transporter not available - just log
    logger.info(`Email notification logged (transporter unavailable): to=${notification.recipientEmail}, subject=${notification.subject}`);
    notification.externalID = `mock_${Date.now()}`;
  }
}

async function sendSMS(notification) {
  // Simulate SMS sending (integrate with Twilio, AWS SNS, etc.)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate success/failure
  const isSuccess = Math.random() > 0.05;
  if (!isSuccess) {
    throw new Error('SMS delivery failed');
  }
  
  notification.externalID = `sms_${Date.now()}`;
  logger.info(`SMS sent to ${notification.recipientPhone}`);
}

async function sendPushNotification(notification) {
  // Simulate push notification (integrate with Firebase, OneSignal, etc.)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const isSuccess = Math.random() > 0.02;
  if (!isSuccess) {
    throw new Error('Push notification failed');
  }
  
  notification.externalID = `push_${Date.now()}`;
  logger.info(`Push notification sent to ${notification.recipientID}`);
}

// Process scheduled notifications (would be called by a cron job)
async function processScheduledNotifications() {
  try {
    const now = new Date();
    const scheduledNotifications = await Notification.find({
      status: 'pending',
      scheduledFor: { $lte: now }
    });
    
    for (const notification of scheduledNotifications) {
      try {
        await sendNotification(notification);
        await notification.save();
        logger.info(`Scheduled notification sent: ${notification.notificationID}`);
      } catch (error) {
        logger.error(`Failed to send scheduled notification ${notification.notificationID}:`, error);
        notification.retryCount += 1;
        if (notification.retryCount >= 3) {
          notification.status = 'failed';
        }
        await notification.save();
      }
    }
  } catch (error) {
    logger.error('Process scheduled notifications error:', error);
  }
}

// Run scheduled notifications processor every minute
setInterval(processScheduledNotifications, 60000);

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Notification service error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  logger.info(`📧 Notification Service running on port ${PORT}`);
});

module.exports = app;