const MenuItem = require('../models/MenuItem');
const logger = require('../utils/logger');

class MenuService {
  
  async createMenuItem(itemData) {
    try {
      const menuItem = new MenuItem(itemData);
      await menuItem.save();
      logger.info(`Menu item created: ${menuItem.itemID}`);
      return menuItem;
    } catch (error) {
      logger.error('Error creating menu item:', error);
      throw error;
    }
  }

  async getAllMenuItems(filters = {}) {
    try {
      const query = {};
      
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.isAvailable !== undefined) {
        query.isAvailable = filters.isAvailable;
      }
      if (filters.isVegetarian !== undefined) {
        query.isVegetarian = filters.isVegetarian;
      }
      if (filters.isVegan !== undefined) {
        query.isVegan = filters.isVegan;
      }
      if (filters.search) {
        query.$text = { $search: filters.search };
      }
      if (filters.maxPrice) {
        query.price = { $lte: filters.maxPrice };
      }

      let sortOptions = { createdAt: -1 };
      if (filters.sortBy === 'price') {
        sortOptions = { price: 1 };
      } else if (filters.sortBy === 'popularity') {
        sortOptions = { popularity: -1 };
      }

      const menuItems = await MenuItem.find(query)
        .select('-__v')
        .sort(sortOptions)
        .limit(filters.limit || 100);

      return menuItems;
    } catch (error) {
      logger.error('Error fetching menu items:', error);
      throw error;
    }
  }

  async getMenuItemById(itemId) {
    try {
      const menuItem = await MenuItem.findOne({ 
        $or: [
          { itemID: itemId },
          { _id: itemId }
        ]
      }).select('-__v');

      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      return menuItem;
    } catch (error) {
      logger.error('Error fetching menu item:', error);
      throw error;
    }
  }

  async updateMenuItem(itemId, updateData) {
    try {
      delete updateData.itemID; // Prevent itemID from being updated

      const menuItem = await MenuItem.findOneAndUpdate(
        { 
          $or: [
            { itemID: itemId },
            { _id: itemId }
          ]
        },
        updateData,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      logger.info(`Menu item updated: ${menuItem.itemID}`);
      return menuItem;
    } catch (error) {
      logger.error('Error updating menu item:', error);
      throw error;
    }
  }

  async deleteMenuItem(itemId) {
    try {
      const menuItem = await MenuItem.findOneAndUpdate(
        { 
          $or: [
            { itemID: itemId },
            { _id: itemId }
          ]
        },
        { isAvailable: false },
        { new: true }
      );

      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      logger.info(`Menu item disabled: ${menuItem.itemID}`);
      return { message: 'Menu item removed from availability' };
    } catch (error) {
      logger.error('Error deleting menu item:', error);
      throw error;
    }
  }

  async getMenuByCategory() {
    try {
      const menuByCategory = await MenuItem.aggregate([
        { $match: { isAvailable: true } },
        {
          $group: {
            _id: '$category',
            items: { $push: '$$ROOT' },
            count: { $sum: 1 },
            averagePrice: { $avg: '$price' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      return menuByCategory;
    } catch (error) {
      logger.error('Error fetching menu by category:', error);
      throw error;
    }
  }

  async updatePopularity(itemId, increment = 1) {
    try {
      const menuItem = await MenuItem.findOneAndUpdate(
        { itemID: itemId },
        { $inc: { popularity: increment } },
        { new: true }
      );

      if (menuItem) {
        logger.info(`Popularity updated for item: ${itemId}`);
      }

      return menuItem;
    } catch (error) {
      logger.error('Error updating popularity:', error);
      throw error;
    }
  }
}

module.exports = new MenuService();
