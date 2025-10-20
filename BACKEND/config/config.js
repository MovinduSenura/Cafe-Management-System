const path = require('path');
require('dotenv').config();

const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,

  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe_management',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    }
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutTime: parseInt(process.env.LOCKOUT_TIME) || 15 * 60 * 1000, // 15 minutes
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    tempDir: process.env.TEMP_DIR || './temp'
  },

  // Email Configuration (for future use)
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },

  // Payment Gateway (for future use)
  payment: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
    datePattern: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD'
  },

  // Cache (Redis - for future use)
  cache: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB) || 0,
    ttl: parseInt(process.env.CACHE_TTL) || 3600 // 1 hour
  },

  // API Configuration
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
    version: process.env.API_VERSION || '1.0.0',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000, // 30 seconds
    bodyLimit: process.env.BODY_LIMIT || '50mb'
  },

  // Business Configuration
  business: {
    name: process.env.BUSINESS_NAME || 'Cafe Management System',
    timezone: process.env.TIMEZONE || 'UTC',
    currency: process.env.CURRENCY || 'USD',
    taxRate: parseFloat(process.env.TAX_RATE) || 0.1, // 10%
    serviceCharge: parseFloat(process.env.SERVICE_CHARGE) || 0.05 // 5%
  },

  // Feature Flags
  features: {
    enableLogging: process.env.ENABLE_LOGGING !== 'false',
    enableCache: process.env.ENABLE_CACHE === 'true',
    enablePayments: process.env.ENABLE_PAYMENTS === 'true',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true'
  }
};

// Validation
const validateConfig = () => {
  const requiredEnvVars = ['JWT_SECRET'];
  
  if (config.NODE_ENV === 'production') {
    requiredEnvVars.push('MONGODB_URI');
  }

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Environment-specific overrides
if (config.NODE_ENV === 'test') {
  config.database.uri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/cafe_management_test';
  config.logging.level = 'error';
}

if (config.NODE_ENV === 'production') {
  config.security.rateLimitMax = 50; // Stricter rate limiting in production
  config.logging.level = 'warn';
}

// Validate configuration on load
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error.message);
  process.exit(1);
}

module.exports = config;