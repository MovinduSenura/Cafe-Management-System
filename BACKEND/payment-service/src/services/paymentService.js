const Payment = require('../models/Payment');
const logger = require('../utils/logger');

class PaymentService {
  
  async processPayment(paymentData) {
    try {
      const payment = new Payment(paymentData);
      
      // Simulate payment processing
      if (payment.method === 'cash') {
        payment.status = 'completed';
        payment.transactionID = 'CASH_' + Date.now();
      } else {
        payment.status = 'processing';
        // In real implementation, integrate with payment gateway
        setTimeout(async () => {
          payment.status = 'completed';
          payment.transactionID = 'TXN_' + Date.now();
          await payment.save();
        }, 2000);
      }
      
      await payment.save();
      logger.info(`Payment processed: ${payment.paymentID}`);
      return payment;
    } catch (error) {
      logger.error('Error processing payment:', error);
      throw error;
    }
  }

  async getAllPayments(filters = {}) {
    try {
      const query = {};
      
      if (filters.customerID) {
        query.customerID = filters.customerID;
      }
      if (filters.orderID) {
        query.orderID = filters.orderID;
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.method) {
        query.method = filters.method;
      }

      const payments = await Payment.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 100);

      return payments;
    } catch (error) {
      logger.error('Error fetching payments:', error);
      throw error;
    }
  }

  async getPaymentById(paymentId) {
    try {
      const payment = await Payment.findOne({ 
        $or: [
          { paymentID: paymentId },
          { _id: paymentId }
        ]
      }).select('-__v');

      if (!payment) {
        throw new Error('Payment not found');
      }

      return payment;
    } catch (error) {
      logger.error('Error fetching payment:', error);
      throw error;
    }
  }

  async refundPayment(paymentId, refundData) {
    try {
      const payment = await Payment.findOne({ 
        $or: [
          { paymentID: paymentId },
          { _id: paymentId }
        ],
        status: 'completed'
      });

      if (!payment) {
        throw new Error('Payment not found or cannot be refunded');
      }

      if (refundData.amount > payment.amount) {
        throw new Error('Refund amount cannot exceed payment amount');
      }

      payment.status = 'refunded';
      payment.refundAmount = refundData.amount;
      payment.refundReason = refundData.reason;
      
      await payment.save();
      
      logger.info(`Payment refunded: ${payment.paymentID}`);
      return payment;
    } catch (error) {
      logger.error('Error refunding payment:', error);
      throw error;
    }
  }

  async getPaymentAnalytics() {
    try {
      const analytics = await Payment.aggregate([
        {
          $group: {
            _id: null,
            totalPayments: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalRefunds: { $sum: '$refundAmount' },
            averagePayment: { $avg: '$amount' },
            paymentsByMethod: {
              $push: '$method'
            },
            paymentsByStatus: {
              $push: '$status'
            }
          }
        }
      ]);

      return analytics[0] || {};
    } catch (error) {
      logger.error('Error generating payment analytics:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
