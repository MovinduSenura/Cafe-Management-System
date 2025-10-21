const express = require('express');
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate, validateLogin } = require('../middleware/validation');
const router = express.Router();

// Authentication routes
router.post('/auth/login', validateLogin, userController.login);

// User management routes
router.post('/users', validateUser, userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', validateUserUpdate, userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.post('/users/:id/change-password', userController.changePassword);

// Health check
router.get('/health', userController.healthCheck);

module.exports = router;
