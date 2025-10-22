const multer = require('multer');
const path = require('path');
const { ApiError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// File filter function
const fileFilter = (req, file, cb) => {
    // Allowed image types
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new ApiError(400, 'Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// Multer configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Single file upload
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new ApiError(400, 'File size too large. Maximum 5MB allowed.'));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return next(new ApiError(400, 'Too many files. Only 1 file allowed.'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new ApiError(400, 'Unexpected field name for file upload.'));
        }
        return next(new ApiError(400, 'File upload error: ' + err.message));
    }
    
    if (err) {
        logger.error('File upload error:', err);
        return next(err);
    }
    
    next();
};

module.exports = {
    upload,
    handleMulterError
};