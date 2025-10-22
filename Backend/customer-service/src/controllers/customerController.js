const customerService = require('../services/customerService');
const logger = require('../utils/logger');

class CustomerController {
  
  // Create a new customer
  async createCustomer(req, res) {
    try {
      const customer = await customerService.createCustomer(req.body);
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      logger.error('Error in createCustomer:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating customer',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get all customers with optional filtering
  async getAllCustomers(req, res) {
    try {
      const filters = {
        customerTier: req.query.tier,
        search: req.query.search,
        limit: parseInt(req.query.limit) || 100
      };

      const customers = await customerService.getAllCustomers(filters);
      res.status(200).json({
        success: true,
        message: 'Customers fetched successfully',
        data: customers,
        count: customers.length
      });
    } catch (error) {
      logger.error('Error in getAllCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching customers',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get customer by ID
  async getCustomerById(req, res) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Customer fetched successfully',
        data: customer
      });
    } catch (error) {
      logger.error('Error in getCustomerById:', error);
      const statusCode = error.message === 'Customer not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching customer',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Update customer by ID
  async updateCustomer(req, res) {
    try {
      const customer = await customerService.updateCustomer(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      logger.error('Error in updateCustomer:', error);
      const statusCode = error.message === 'Customer not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error updating customer',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Delete customer (soft delete)
  async deleteCustomer(req, res) {
    try {
      const result = await customerService.deleteCustomer(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Error in deleteCustomer:', error);
      const statusCode = error.message === 'Customer not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error deleting customer',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Update customer statistics (called by other services)
  async updateCustomerStats(req, res) {
    try {
      const { customerId } = req.params;
      const orderData = req.body;
      
      const customer = await customerService.updateCustomerStats(customerId, orderData);
      res.status(200).json({
        success: true,
        message: 'Customer statistics updated successfully',
        data: customer
      });
    } catch (error) {
      logger.error('Error in updateCustomerStats:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error updating customer statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Create feedback
  async createFeedback(req, res) {
    try {
      const feedback = await customerService.createFeedback(req.body);
      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: feedback
      });
    } catch (error) {
      logger.error('Error in createFeedback:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating feedback',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get all feedback with optional filtering
  async getAllFeedback(req, res) {
    try {
      const filters = {
        customerId: req.query.customerId,
        rating: req.query.rating ? parseInt(req.query.rating) : undefined,
        status: req.query.status,
        limit: parseInt(req.query.limit) || 100
      };

      const feedback = await customerService.getAllFeedback(filters);
      res.status(200).json({
        success: true,
        message: 'Feedback fetched successfully',
        data: feedback,
        count: feedback.length
      });
    } catch (error) {
      logger.error('Error in getAllFeedback:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching feedback',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Update feedback (add reply, change status)
  async updateFeedback(req, res) {
    try {
      const feedback = await customerService.updateFeedback(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Feedback updated successfully',
        data: feedback
      });
    } catch (error) {
      logger.error('Error in updateFeedback:', error);
      const statusCode = error.message === 'Feedback not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error updating feedback',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(req, res) {
    try {
      const analytics = await customerService.getCustomerAnalytics();
      res.status(200).json({
        success: true,
        message: 'Customer analytics fetched successfully',
        data: analytics
      });
    } catch (error) {
      logger.error('Error in getCustomerAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching customer analytics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // Health check for the customer service
  async healthCheck(req, res) {
    try {
      res.status(200).json({
        status: 'healthy',
        service: 'customer-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        service: 'customer-service',
        error: error.message
      });
    }
  }
}

module.exports = new CustomerController();