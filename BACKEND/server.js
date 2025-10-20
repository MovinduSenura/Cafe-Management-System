const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require('path');
require("dotenv").config();

const { ConnectDB } = require("./utils/connection");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const logger = require("./utils/logger");

// Route imports
const CustomerRouter = require('./routes/customer.routes');
const menuItemRouter = require('./routes/menuItems.routes');
const promotionAllRoutes = require("./routes/promotion.routes");
const OrderRouter = require('./routes/Order.routes');
const paymentRouter = require('./routes/payment.routes');
const staffRouter = require('./routes/staff.routes');
const stockRouter = require('./routes/stock.routes');
const profitRouter = require("./routes/profit.routes");
const tablesRouter = require("./routes/tables.routes");
const reservationRouter = require('./routes/reservation.routes');

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disable for PDF generation
}));

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More lenient in development
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            res.status(400).json({
                success: false,
                message: 'Invalid JSON format'
            });
            return;
        }
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware
app.use('/docs', express.static(path.join(__dirname, 'docs'), {
    maxAge: '1d',
    etag: false
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1d',
    etag: false
}));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes with versioning
app.use('/api/v1/customers', CustomerRouter);
app.use('/api/v1/menu-items', menuItemRouter);
app.use('/api/v1/orders', OrderRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/tables', tablesRouter);
app.use('/api/v1/stock', stockRouter);
app.use('/api/v1/promotions', promotionAllRoutes);
app.use('/api/v1/profit', profitRouter);
app.use('/api/v1/staff', staffRouter);

// Legacy routes (for backward compatibility)
app.use('/customer', CustomerRouter);
app.use('/menu', menuItemRouter);
app.use('/promotion', promotionAllRoutes);
app.use('/order', OrderRouter);
app.use('/payment', paymentRouter);
app.use('/staff', staffRouter);
app.use('/stock', stockRouter);
app.use('/profit', profitRouter);
app.use('/table', tablesRouter);
app.use('/reservation', reservationRouter);

// 404 handler for undefined routes
app.use('*', notFound);

// Global error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        // Connect to database
        await ConnectDB();
        
        // Start server
        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });

        // Set server timeout
        server.timeout = 30000; // 30 seconds

        return server;
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
if (require.main === module) {
    startServer();
}

module.exports = app;
