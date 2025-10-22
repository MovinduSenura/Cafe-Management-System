const mongoose = require("mongoose");
const logger = require('./logger');

const ConnectDB = async () => {
    try {
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false
        };

        const conn = await mongoose.connect(process.env.MONGO_URL, options);
        
        logger.info(`🎯 Database Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('Database connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Database disconnected');
        });

        // Handle app termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('Database connection closed due to app termination');
            process.exit(0);
        });

    } catch (err) {
        logger.error(`Database connection failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = { ConnectDB };