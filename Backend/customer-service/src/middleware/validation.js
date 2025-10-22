const logger = require('../utils/logger');

// Validation middleware for customer creation
const validateCustomer = (req, res, next) => {
  const { customerName, customerEmail, customerPhone } = req.body;
  const errors = [];

  // Required field validation
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters long');
  }

  if (!customerEmail || typeof customerEmail !== 'string') {
    errors.push('Customer email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(customerEmail)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!customerPhone || typeof customerPhone !== 'string') {
    errors.push('Customer phone is required');
  } else {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(customerPhone)) {
      errors.push('Please provide a valid phone number');
    }
  }

  // Optional field validation
  if (req.body.loyaltyPoints && (typeof req.body.loyaltyPoints !== 'number' || req.body.loyaltyPoints < 0)) {
    errors.push('Loyalty points must be a non-negative number');
  }

  if (req.body.customerTier && !['bronze', 'silver', 'gold', 'platinum'].includes(req.body.customerTier)) {
    errors.push('Customer tier must be bronze, silver, gold, or platinum');
  }

  if (errors.length > 0) {
    logger.warn('Customer validation failed:', { errors, body: req.body });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for feedback creation
const validateFeedback = (req, res, next) => {
  const { customerID, customerName, customerEmail, Comment, rating } = req.body;
  const errors = [];

  // Required field validation
  if (!customerID || typeof customerID !== 'string') {
    errors.push('Customer ID is required');
  }

  if (!customerName || typeof customerName !== 'string') {
    errors.push('Customer name is required');
  }

  if (!customerEmail || typeof customerEmail !== 'string') {
    errors.push('Customer email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(customerEmail)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!Comment || typeof Comment !== 'string' || Comment.trim().length === 0) {
    errors.push('Feedback comment is required');
  } else if (Comment.length > 1000) {
    errors.push('Feedback comment cannot exceed 1000 characters');
  }

  if (!rating || typeof rating !== 'number') {
    errors.push('Rating is required and must be a number');
  } else if (rating < 1 || rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (errors.length > 0) {
    logger.warn('Feedback validation failed:', { errors, body: req.body });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for customer update
const validateCustomerUpdate = (req, res, next) => {
  const errors = [];

  // Validate fields that are being updated
  if (req.body.customerName !== undefined) {
    if (typeof req.body.customerName !== 'string' || req.body.customerName.trim().length < 2) {
      errors.push('Customer name must be at least 2 characters long');
    }
  }

  if (req.body.customerEmail !== undefined) {
    if (typeof req.body.customerEmail !== 'string') {
      errors.push('Customer email must be a string');
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(req.body.customerEmail)) {
        errors.push('Please provide a valid email address');
      }
    }
  }

  if (req.body.customerPhone !== undefined) {
    if (typeof req.body.customerPhone !== 'string') {
      errors.push('Customer phone must be a string');
    } else {
      const phoneRegex = /^\+?[\d\s-()]+$/;
      if (!phoneRegex.test(req.body.customerPhone)) {
        errors.push('Please provide a valid phone number');
      }
    }
  }

  if (req.body.loyaltyPoints !== undefined) {
    if (typeof req.body.loyaltyPoints !== 'number' || req.body.loyaltyPoints < 0) {
      errors.push('Loyalty points must be a non-negative number');
    }
  }

  if (req.body.customerTier !== undefined) {
    if (!['bronze', 'silver', 'gold', 'platinum'].includes(req.body.customerTier)) {
      errors.push('Customer tier must be bronze, silver, gold, or platinum');
    }
  }

  if (errors.length > 0) {
    logger.warn('Customer update validation failed:', { errors, body: req.body });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateCustomer,
  validateFeedback,
  validateCustomerUpdate
};