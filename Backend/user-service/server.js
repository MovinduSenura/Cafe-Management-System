const mongoose = require('mongoose');
const app = require('./src/app');
const config = require('./src/config/config');
const logger = require('./src/utils/logger');

// Connect to MongoDB
mongoose.connect(config.database.uri, config.database.options)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully'); 
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`${config.nodeEnv} server running on port ${PORT}`);
});
