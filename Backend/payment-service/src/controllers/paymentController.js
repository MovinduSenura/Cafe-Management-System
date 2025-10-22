const paymentService = require('../services/paymentService');
const logger = require('../utils/logger');

class PaymentController {
  
  async processPayment(req, res) {
    try {
      const payment = await paymentService.processPayment(req.body);
      res.status(201).json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } catch (error) {
      logger.error('Error in processPayment:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error processing payment',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getAllPayments(req, res) {
    try {
      const filters = {
        customerID: req.query.customerID,
        orderID: req.query.orderID,
        status: req.query.status,
        method: req.query.method,
        limit: parseInt(req.query.limit) || 100
      };

      const payments = await paymentService.getAllPayments(filters);
      res.status(200).json({
        success: true,
        message: 'Payments fetched successfully',
        data: payments,
        count: payments.length
      });
    } catch (error) {
      logger.error('Error in getAllPayments:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching payments',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getPaymentById(req, res) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Payment fetched successfully',
        data: payment
      });
    } catch (error) {
      logger.error('Error in getPaymentById:', error);
      const statusCode = error.message === 'Payment not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching payment',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async refundPayment(req, res) {
    try {
      const payment = await paymentService.refundPayment(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment
      });
    } catch (error) {
      logger.error('Error in refundPayment:', error);
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error refunding payment',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getPaymentAnalytics(req, res) {
    try {
      const analytics = await paymentService.getPaymentAnalytics();
      res.status(200).json({
        success: true,
        message: 'Payment analytics fetched successfully',
        data: analytics
      });
    } catch (error) {
      logger.error('Error in getPaymentAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching payment analytics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async healthCheck(req, res) {
    try {
      res.status(200).json({
        status: 'healthy',
        service: 'payment-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        service: 'payment-service',
        error: error.message
      });
    }
  }
}

module.exports = new PaymentController();
