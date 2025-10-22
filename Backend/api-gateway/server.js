const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const logger = require('./utils/logger');

const app = express();

// Redis client for rate limiting and caching
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
});

// Connect to Redis with error handling
redisClient.connect().catch((err) => {
  logger.warn('Redis connection failed:', err.message);
});

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
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new rateLimit.MemoryStore(),
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api', globalLimiter);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Service Discovery Configuration
const services = {
  user: {
    target: process.env.USER_SERVICE_URL || 'http://user-service:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/auth': '/api/v1' },
    timeout: 10000,
    retries: 3
  },
  customer: {
    target: process.env.CUSTOMER_SERVICE_URL || 'http://customer-service:3002',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/customers': '/api/v1' },
    timeout: 10000,
    retries: 3
  },
  menu: {
    target: process.env.MENU_SERVICE_URL || 'http://menu-service:3003',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/menu': '/api/v1' },
    timeout: 10000,
    retries: 3
  },
  order: {
    target: process.env.ORDER_SERVICE_URL || 'http://order-service:3004',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/orders': '/api/v1' },
    timeout: 10000,
    retries: 3
  },
  payment: {
    target: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/payments': '/api/v1' },
    timeout: 10000,
    retries: 3
  },
  inventory: {
    target: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3006',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/inventory': '/api/v1' },
    timeout: 10000,
    retries: 3
  },
  reservation: {
    target: process.env.RESERVATION_SERVICE_URL || 'http://reservation-service:3007',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/reservations': '/api/v1' },
    timeout: 10000,
    retries: 3
  },
  notification: {
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3008',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/notifications': '/api/v1' },
    timeout: 10000,
    retries: 3
  },
  report: {
    target: process.env.REPORT_SERVICE_URL || 'http://report-service:3009',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/reports': '/api/v1' },
    timeout: 10000,
    retries: 3
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: Object.keys(services),
    legacyRoutesSupported: true,
    uptime: process.uptime()
  });
});

// API Gateway Routes

// Public routes (no authentication required)
app.use('/api/v1/auth/login', createProxyMiddleware(services.user));
app.use('/api/v1/auth/register', createProxyMiddleware(services.user));
app.use('/api/v1/menu/public', createProxyMiddleware(services.menu));

// Legacy route support (previously on port 8000)
// This approach preserves the original path structure and forwards it directly to microservices
app.use('/customer', createProxyMiddleware({
  target: process.env.CUSTOMER_SERVICE_URL || 'http://customer-service:3002',
  changeOrigin: true,
  pathRewrite: (path) => path
}));

app.use('/menu', createProxyMiddleware({
  target: process.env.MENU_SERVICE_URL || 'http://menu-service:3003',
  changeOrigin: true,
  pathRewrite: (path) => path
}));

app.use('/order', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL || 'http://order-service:3004',
  changeOrigin: true,
  pathRewrite: (path) => path
}));

app.use('/payment', createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005',
  changeOrigin: true,
  pathRewrite: (path) => path
}));

app.use('/stock', createProxyMiddleware({
  target: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3006',
  changeOrigin: true,
  pathRewrite: (path) => path
}));

app.use('/promotion', createProxyMiddleware({
  target: process.env.MENU_SERVICE_URL || 'http://menu-service:3003',
  changeOrigin: true,
  pathRewrite: (path) => path
}));

app.use('/feedback', createProxyMiddleware({
  target: process.env.CUSTOMER_SERVICE_URL || 'http://customer-service:3002',
  changeOrigin: true,
  pathRewrite: (path) => path
}));

// Protected routes (authentication required)
app.use('/api/v1/auth', authenticateToken, createProxyMiddleware(services.user));
app.use('/api/v1/customers', authenticateToken, createProxyMiddleware(services.customer));
app.use('/api/v1/menu', authenticateToken, createProxyMiddleware(services.menu));
app.use('/api/v1/orders', authenticateToken, createProxyMiddleware(services.order));
app.use('/api/v1/payments', authenticateToken, createProxyMiddleware(services.payment));
app.use('/api/v1/inventory', authenticateToken, createProxyMiddleware(services.inventory));
app.use('/api/v1/reservations', authenticateToken, createProxyMiddleware(services.reservation));
app.use('/api/v1/notifications', authenticateToken, createProxyMiddleware(services.notification));
app.use('/api/v1/reports', authenticateToken, createProxyMiddleware(services.report));

// Circuit breaker pattern - commented out for now
// const circuitBreaker = (_serviceName) => {
//   return (req, res, next) => {
//     // Simple circuit breaker implementation
//     // In production, use a library like 'opossum'
//     const _failureThreshold = 5;
//     const _resetTimeout = 60000; // 1 minute
    
//     // Circuit breaker logic would go here
//     next();
//   };
// };

// Error handling middleware
app.use((error, req, res, _next) => {
  logger.error('API Gateway error:', error);
  
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'The requested service is currently unavailable. Please try again later.'
    });
  }
  
  if (error.code === 'ETIMEDOUT') {
    return res.status(504).json({
      error: 'Gateway timeout',
      message: 'The service took too long to respond.'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Proxying to ${Object.keys(services).length} microservices`);
});

module.exports = app;