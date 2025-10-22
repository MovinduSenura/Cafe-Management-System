const menuService = require('../services/menuService');
const logger = require('../utils/logger');

class MenuController {
  
  async createMenuItem(req, res) {
    try {
      const menuItem = await menuService.createMenuItem(req.body);
      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        data: menuItem
      });
    } catch (error) {
      logger.error('Error in createMenuItem:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating menu item',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getAllMenuItems(req, res) {
    try {
      const filters = {
        category: req.query.category,
        isAvailable: req.query.available === 'true' ? true : req.query.available === 'false' ? false : undefined,
        isVegetarian: req.query.vegetarian === 'true',
        isVegan: req.query.vegan === 'true',
        search: req.query.search,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
        sortBy: req.query.sortBy,
        limit: parseInt(req.query.limit) || 100
      };

      const menuItems = await menuService.getAllMenuItems(filters);
      res.status(200).json({
        success: true,
        message: 'Menu items fetched successfully',
        data: menuItems,
        count: menuItems.length
      });
    } catch (error) {
      logger.error('Error in getAllMenuItems:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching menu items',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getMenuItemById(req, res) {
    try {
      const menuItem = await menuService.getMenuItemById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Menu item fetched successfully',
        data: menuItem
      });
    } catch (error) {
      logger.error('Error in getMenuItemById:', error);
      const statusCode = error.message === 'Menu item not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching menu item',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async updateMenuItem(req, res) {
    try {
      const menuItem = await menuService.updateMenuItem(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Menu item updated successfully',
        data: menuItem
      });
    } catch (error) {
      logger.error('Error in updateMenuItem:', error);
      const statusCode = error.message === 'Menu item not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error updating menu item',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async deleteMenuItem(req, res) {
    try {
      const result = await menuService.deleteMenuItem(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger.error('Error in deleteMenuItem:', error);
      const statusCode = error.message === 'Menu item not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error deleting menu item',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getMenuByCategory(req, res) {
    try {
      const menuByCategory = await menuService.getMenuByCategory();
      res.status(200).json({
        success: true,
        message: 'Menu by category fetched successfully',
        data: menuByCategory
      });
    } catch (error) {
      logger.error('Error in getMenuByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching menu by category',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async updatePopularity(req, res) {
    try {
      const { increment } = req.body;
      const menuItem = await menuService.updatePopularity(req.params.id, increment);
      res.status(200).json({
        success: true,
        message: 'Popularity updated successfully',
        data: menuItem
      });
    } catch (error) {
      logger.error('Error in updatePopularity:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error updating popularity',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async healthCheck(req, res) {
    try {
      res.status(200).json({
        status: 'healthy',
        service: 'menu-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        service: 'menu-service',
        error: error.message
      });
    }
  }
}

module.exports = new MenuController();
