const customerModel = require('../models/customer.model');
const { ApiError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

class CustomerService {
  // Create a new customer
  async createCustomer(customerData) {
    try {
      const existingCustomer = await customerModel.findOne({
        $or: [
          { customerEmail: customerData.customerEmail },
          { customerPhone: customerData.customerPhone }
        ]
      });

      if (existingCustomer) {
        throw new ApiError(409, 'Customer with this email or phone already exists');
      }

      const customer = new customerModel(customerData);
      await customer.save();
      
      logger.info(`Customer created: ${customer.customerID}`);
      return customer;
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw error;
    }
  }

  // Get all customers with pagination
  async getAllCustomers(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      
      // Build query
      const query = { isDeleted: false };
      
      if (filters.search) {
        query.$or = [
          { customerName: { $regex: filters.search, $options: 'i' } },
          { customerEmail: { $regex: filters.search, $options: 'i' } },
          { customerPhone: { $regex: filters.search, $options: 'i' } }
        ];
      }

      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      const [customers, total] = await Promise.all([
        customerModel.find(query)
          .select('-isDeleted')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        customerModel.countDocuments(query)
      ]);

      return {
        customers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error fetching customers:', error);
      throw new ApiError(500, 'Failed to fetch customers');
    }
  }

  // Get customer by ID
  async getCustomerById(customerId) {
    try {
      const customer = await customerModel.findOne({
        _id: customerId,
        isDeleted: false
      }).select('-isDeleted');

      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }

      return customer;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error fetching customer:', error);
      throw new ApiError(500, 'Failed to fetch customer');
    }
  }

  // Update customer
  async updateCustomer(customerId, updateData) {
    try {
      // Check if customer exists
      const existingCustomer = await this.getCustomerById(customerId);

      // Check for duplicate email/phone if being updated
      if (updateData.customerEmail || updateData.customerPhone) {
        const duplicateQuery = {
          _id: { $ne: customerId },
          isDeleted: false,
          $or: []
        };

        if (updateData.customerEmail) {
          duplicateQuery.$or.push({ customerEmail: updateData.customerEmail });
        }
        if (updateData.customerPhone) {
          duplicateQuery.$or.push({ customerPhone: updateData.customerPhone });
        }

        const duplicate = await customerModel.findOne(duplicateQuery);
        if (duplicate) {
          throw new ApiError(409, 'Customer with this email or phone already exists');
        }
      }

      const updatedCustomer = await customerModel.findByIdAndUpdate(
        customerId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-isDeleted');

      logger.info(`Customer updated: ${updatedCustomer.customerID}`);
      return updatedCustomer;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating customer:', error);
      throw new ApiError(500, 'Failed to update customer');
    }
  }

  // Soft delete customer
  async deleteCustomer(customerId) {
    try {
      const customer = await this.getCustomerById(customerId);
      
      await customerModel.findByIdAndUpdate(
        customerId,
        { 
          isDeleted: true,
          deletedAt: new Date(),
          isActive: false
        }
      );

      logger.info(`Customer deleted: ${customer.customerID}`);
      return { message: 'Customer deleted successfully' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error deleting customer:', error);
      throw new ApiError(500, 'Failed to delete customer');
    }
  }

  // Search customers
  async searchCustomers(searchTerm, page = 1, limit = 10) {
    try {
      return await this.getAllCustomers(page, limit, { search: searchTerm });
    } catch (error) {
      logger.error('Error searching customers:', error);
      throw new ApiError(500, 'Failed to search customers');
    }
  }

  // Get customer statistics
  async getCustomerStats() {
    try {
      const stats = await customerModel.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            activeCustomers: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            },
            totalLoyaltyPoints: { $sum: '$loyaltyPoints' },
            avgLoyaltyPoints: { $avg: '$loyaltyPoints' }
          }
        }
      ]);

      return stats[0] || {
        totalCustomers: 0,
        activeCustomers: 0,
        totalLoyaltyPoints: 0,
        avgLoyaltyPoints: 0
      };
    } catch (error) {
      logger.error('Error fetching customer stats:', error);
      throw new ApiError(500, 'Failed to fetch customer statistics');
    }
  }
}

module.exports = new CustomerService();