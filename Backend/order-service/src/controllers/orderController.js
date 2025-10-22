const orderService = require('../services/orderService');
const logger = require('../utils/logger');

class OrderController {
  
  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in createOrder:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating order',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getAllOrders(req, res) {
    try {
      const filters = {
        customerID: req.query.customerID,
        status: req.query.status,
        orderType: req.query.orderType,
        paymentStatus: req.query.paymentStatus,
        limit: parseInt(req.query.limit) || 100
      };

      const orders = await orderService.getAllOrders(filters);
      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        data: orders,
        count: orders.length
      });
    } catch (error) {
      logger.error('Error in getAllOrders:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching orders',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Order fetched successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in getOrderById:', error);
      const statusCode = error.message === 'Order not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching order',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in updateOrderStatus:', error);
      const statusCode = error.message === 'Order not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error updating order status',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async cancelOrder(req, res) {
    try {
      const order = await orderService.cancelOrder(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in cancelOrder:', error);
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error cancelling order',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getOrderAnalytics(req, res) {
    try {
      const analytics = await orderService.getOrderAnalytics();
      res.status(200).json({
        success: true,
        message: 'Order analytics fetched successfully',
        data: analytics
      });
    } catch (error) {
      logger.error('Error in getOrderAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching order analytics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async healthCheck(req, res) {
    try {
      res.status(200).json({
        status: 'healthy',
        service: 'order-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        service: 'order-service',
        error: error.message
      });
    }
  }
}

module.exports = new OrderController();
