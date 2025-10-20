const jwt = require('jsonwebtoken');
const staffModel = require('../models/staff.model');
const { ApiError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.replace('Bearer ', '');
        
        if (!token) {
            throw new ApiError(401, "Access token is required");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const staff = await staffModel.findById(decoded.id).select('-staffPassword');
        
        if (!staff || !staff.isActive) {
            throw new ApiError(401, "Invalid access token");
        }

        // Update last login
        staff.lastLogin = new Date();
        await staff.save();

        req.staff = staff;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid access token");
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token expired");
        }
        if (error instanceof ApiError) {
            throw error;
        }
        logger.error('Authentication error:', error);
        throw new ApiError(401, "Authentication failed");
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.staff) {
            throw new ApiError(401, "Authentication required");
        }
        
        if (!roles.includes(req.staff.staffRole)) {
            throw new ApiError(403, "Access denied. Insufficient permissions");
        }
        next();
    };
};

const checkPermissions = (...permissions) => {
    return (req, res, next) => {
        if (!req.staff) {
            throw new ApiError(401, "Authentication required");
        }
        
        const hasPermission = permissions.some(permission => 
            req.staff.permissions.includes(permission) || 
            req.staff.staffRole === 'admin'
        );
        
        if (!hasPermission) {
            throw new ApiError(403, "Access denied. Required permissions not found");
        }
        next();
    };
};

// Optional authentication - doesn't throw error if no token
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const staff = await staffModel.findById(decoded.id).select('-staffPassword');
            
            if (staff && staff.isActive) {
                req.staff = staff;
            }
        }
    } catch (error) {
        // Silently fail for optional auth
        logger.debug('Optional auth failed:', error.message);
    }
    next();
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    checkPermissions,
    optionalAuth
};