const userService = require('../services/userService');
const logger = require('../utils/logger');

class UserController {
  
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      logger.error('Error in createUser:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating user',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const filters = {
        role: req.query.role,
        search: req.query.search,
        limit: parseInt(req.query.limit) || 100
      };

      const users = await userService.getAllUsers(filters);
      res.status(200).json({
        success: true,
        message: 'Users fetched successfully',
        data: users,
        count: users.length
      });
    } catch (error) {
      logger.error('Error in getAllUsers:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: user
      });
    } catch (error) {
      logger.error('Error in getUserById:', error);
      const statusCode = error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching user',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      logger.error('Error in updateUser:', error);
      const statusCode = error.message === 'User not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error updating user',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Error in deleteUser:', error);
      const statusCode = error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error deleting user',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.authenticateUser(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      logger.error('Error in login:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(req.params.id, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Error in changePassword:', error);
      const statusCode = error.message === 'User not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error changing password',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async healthCheck(req, res) {
    try {
      res.status(200).json({
        status: 'healthy',
        service: 'user-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        service: 'user-service',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
