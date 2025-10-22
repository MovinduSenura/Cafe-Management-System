const Customer = require('../models/Customer');
const Feedback = require('../models/Feedback');
const logger = require('../utils/logger');

class CustomerService {
  
  // Customer CRUD operations
  async createCustomer(customerData) {
    try {
      const customer = new Customer(customerData);
      await customer.save();
      logger.info(`Customer created: ${customer.customerID}`);
      return customer;
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw error;
    }
  }

  async getAllCustomers(filters = {}) {
    try {
      const query = { isActive: true };
      
      // Apply filters
      if (filters.customerTier) {
        query.customerTier = filters.customerTier;
      }
      if (filters.search) {
        query.$or = [
          { customerName: { $regex: filters.search, $options: 'i' } },
          { customerEmail: { $regex: filters.search, $options: 'i' } },
          { customerID: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const customers = await Customer.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 100);

      return customers;
    } catch (error) {
      logger.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(customerId) {
    try {
      const customer = await Customer.findOne({ 
        $or: [
          { customerID: customerId },
          { _id: customerId }
        ],
        isActive: true 
      }).select('-__v');

      if (!customer) {
        throw new Error('Customer not found');
      }

      return customer;
    } catch (error) {
      logger.error('Error fetching customer:', error);
      throw error;
    }
  }

  async updateCustomer(customerId, updateData) {
    try {
      // Remove fields that shouldn't be updated directly
      delete updateData.customerID;
      delete updateData.loyaltyPoints;
      delete updateData.totalOrdersPlaced;
      delete updateData.totalAmountSpent;

      const customer = await Customer.findOneAndUpdate(
        { 
          $or: [
            { customerID: customerId },
            { _id: customerId }
          ],
          isActive: true 
        },
        updateData,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!customer) {
        throw new Error('Customer not found');
      }

      logger.info(`Customer updated: ${customer.customerID}`);
      return customer;
    } catch (error) {
      logger.error('Error updating customer:', error);
      throw error;
    }
  }

  async deleteCustomer(customerId) {
    try {
      const customer = await Customer.findOneAndUpdate(
        { 
          $or: [
            { customerID: customerId },
            { _id: customerId }
          ],
          isActive: true 
        },
        { isActive: false },
        { new: true }
      );

      if (!customer) {
        throw new Error('Customer not found');
      }

      logger.info(`Customer soft deleted: ${customer.customerID}`);
      return { message: 'Customer deleted successfully' };
    } catch (error) {
      logger.error('Error deleting customer:', error);
      throw error;
    }
  }

  // Customer analytics
  async updateCustomerStats(customerId, orderData) {
    try {
      const { orderValue, isNewOrder = true } = orderData;
      
      const updateFields = {
        lastVisit: new Date(),
        $inc: {}
      };

      if (isNewOrder) {
        updateFields.$inc.totalOrdersPlaced = 1;
        updateFields.$inc.totalAmountSpent = orderValue;
      }

      const customer = await Customer.findOneAndUpdate(
        { customerID: customerId },
        updateFields,
        { new: true }
      );

      if (customer) {
        // Recalculate average order value
        customer.averageOrderValue = customer.totalOrdersPlaced > 0 
          ? customer.totalAmountSpent / customer.totalOrdersPlaced 
          : 0;
        await customer.save();
      }

      return customer;
    } catch (error) {
      logger.error('Error updating customer stats:', error);
      throw error;
    }
  }

  // Feedback operations
  async createFeedback(feedbackData) {
    try {
      const feedback = new Feedback(feedbackData);
      await feedback.save();
      logger.info(`Feedback created for customer: ${feedback.customerID}`);
      return feedback;
    } catch (error) {
      logger.error('Error creating feedback:', error);
      throw error;
    }
  }

  async getAllFeedback(filters = {}) {
    try {
      const query = {};
      
      if (filters.customerId) {
        query.customerID = filters.customerId;
      }
      if (filters.rating) {
        query.rating = filters.rating;
      }
      if (filters.status) {
        query.status = filters.status;
      }

      const feedback = await Feedback.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 100);

      return feedback;
    } catch (error) {
      logger.error('Error fetching feedback:', error);
      throw error;
    }
  }

  async updateFeedback(feedbackId, updateData) {
    try {
      const feedback = await Feedback.findByIdAndUpdate(
        feedbackId,
        updateData,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!feedback) {
        throw new Error('Feedback not found');
      }

      logger.info(`Feedback updated: ${feedbackId}`);
      return feedback;
    } catch (error) {
      logger.error('Error updating feedback:', error);
      throw error;
    }
  }

  // Analytics and reporting
  async getCustomerAnalytics() {
    try {
      const analytics = await Customer.aggregate([
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            activeCustomers: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            },
            totalRevenue: { $sum: '$totalAmountSpent' },
            averageOrderValue: { $avg: '$averageOrderValue' },
            tierDistribution: {
              $push: '$customerTier'
            }
          }
        }
      ]);

      // Calculate tier distribution
      const tiers = analytics[0]?.tierDistribution || [];
      const tierCounts = tiers.reduce((acc, tier) => {
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {});

      return {
        ...analytics[0],
        tierDistribution: tierCounts
      };
    } catch (error) {
      logger.error('Error generating customer analytics:', error);
      throw error;
    }
  }
}

module.exports = new CustomerService();