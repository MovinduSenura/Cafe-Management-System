const logger = require('../utils/logger');

const validateUser = (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if (req.body.role && !['admin', 'staff', 'manager'].includes(req.body.role)) {
    errors.push('Role must be admin, staff, or manager');
  }

  if (errors.length > 0) {
    logger.warn('User validation failed:', { errors, body: req.body });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateUserUpdate = (req, res, next) => {
  const errors = [];

  if (req.body.username !== undefined) {
    if (typeof req.body.username !== 'string' || req.body.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
  }

  if (req.body.email !== undefined) {
    if (typeof req.body.email !== 'string') {
      errors.push('Email must be a string');
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(req.body.email)) {
        errors.push('Please provide a valid email address');
      }
    }
  }

  if (req.body.role !== undefined) {
    if (!['admin', 'staff', 'manager'].includes(req.body.role)) {
      errors.push('Role must be admin, staff, or manager');
    }
  }

  if (errors.length > 0) {
    logger.warn('User update validation failed:', { errors, body: req.body });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    logger.warn('Login validation failed:', { errors });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateUser,
  validateUserUpdate,
  validateLogin
};
