const express = require('express');
const menuController = require('../controllers/menuController');
const router = express.Router();

// Menu item routes
router.post('/menu', menuController.createMenuItem);
router.get('/menu', menuController.getAllMenuItems);
router.get('/menu/categories', menuController.getMenuByCategory);
router.get('/menu/:id', menuController.getMenuItemById);
router.put('/menu/:id', menuController.updateMenuItem);
router.delete('/menu/:id', menuController.deleteMenuItem);
router.patch('/menu/:id/popularity', menuController.updatePopularity);

// Public routes (no auth required)
router.get('/public', menuController.getAllMenuItems);
router.get('/public/categories', menuController.getMenuByCategory);

// Health check
router.get('/health', menuController.healthCheck);

module.exports = router;
