require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/notification_service',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    }
  },
  
  // Redis configuration (if needed)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // CORS configuration  
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
  }
};
