const Order = require('../models/Order');
const logger = require('../utils/logger');

class OrderService {
  
  async createOrder(orderData) {
    try {
      // Calculate item totals
      if (orderData.items) {
        orderData.items.forEach(item => {
          item.totalPrice = item.quantity * item.unitPrice;
        });
      }

      const order = new Order(orderData);
      await order.save();
      logger.info(`Order created: ${order.orderID}`);
      return order;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  }

  async getAllOrders(filters = {}) {
    try {
      const query = {};
      
      if (filters.customerID) {
        query.customerID = filters.customerID;
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.orderType) {
        query.orderType = filters.orderType;
      }
      if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
      }

      const orders = await Order.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 100);

      return orders;
    } catch (error) {
      logger.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const order = await Order.findOne({ 
        $or: [
          { orderID: orderId },
          { _id: orderId }
        ]
      }).select('-__v');

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      logger.error('Error fetching order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findOneAndUpdate(
        { 
          $or: [
            { orderID: orderId },
            { _id: orderId }
          ]
        },
        { status },
        { new: true, runValidators: true }
      ).select('-__v');

      if (!order) {
        throw new Error('Order not found');
      }

      logger.info(`Order status updated: ${order.orderID} -> ${status}`);
      return order;
    } catch (error) {
      logger.error('Error updating order status:', error);
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      const order = await Order.findOneAndUpdate(
        { 
          $or: [
            { orderID: orderId },
            { _id: orderId }
          ],
          status: { $in: ['pending', 'confirmed'] }
        },
        { status: 'cancelled' },
        { new: true }
      );

      if (!order) {
        throw new Error('Order not found or cannot be cancelled');
      }

      logger.info(`Order cancelled: ${order.orderID}`);
      return order;
    } catch (error) {
      logger.error('Error cancelling order:', error);
      throw error;
    }
  }

  async getOrderAnalytics() {
    try {
      const analytics = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            ordersByStatus: {
              $push: '$status'
            },
            ordersByType: {
              $push: '$orderType'
            }
          }
        }
      ]);

      return analytics[0] || {};
    } catch (error) {
      logger.error('Error generating order analytics:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();
