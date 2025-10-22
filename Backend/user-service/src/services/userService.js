const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

class UserService {
  
  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      logger.info(`User created: ${user.userID}`);
      
      // Don't return password in response
      const userResponse = user.toObject();
      delete userResponse.password;
      return userResponse;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers(filters = {}) {
    try {
      const query = { isActive: true };
      
      if (filters.role) {
        query.role = filters.role;
      }
      if (filters.search) {
        query.$or = [
          { username: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 100);

      return users;
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findOne({ 
        $or: [
          { userID: userId },
          { _id: userId }
        ],
        isActive: true 
      }).select('-password -__v');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      // Remove sensitive fields
      delete updateData.userID;
      delete updateData.password;

      const user = await User.findOneAndUpdate(
        { 
          $or: [
            { userID: userId },
            { _id: userId }
          ],
          isActive: true 
        },
        updateData,
        { new: true, runValidators: true }
      ).select('-password -__v');

      if (!user) {
        throw new Error('User not found');
      }

      logger.info(`User updated: ${user.userID}`);
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findOneAndUpdate(
        { 
          $or: [
            { userID: userId },
            { _id: userId }
          ],
          isActive: true 
        },
        { isActive: false },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      logger.info(`User soft deleted: ${user.userID}`);
      return { message: 'User deleted successfully' };
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email, isActive: true });
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.userID, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      const userResponse = user.toObject();
      delete userResponse.password;

      return { user: userResponse, token };
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findOne({ 
        $or: [
          { userID: userId },
          { _id: userId }
        ],
        isActive: true 
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.userID}`);
      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
