const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Order routes
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/analytics', orderController.getOrderAnalytics);
router.get('/orders/:id', orderController.getOrderById);
router.patch('/orders/:id/status', orderController.updateOrderStatus);
router.patch('/orders/:id/cancel', orderController.cancelOrder);

// Health check
router.get('/health', orderController.healthCheck);

module.exports = router;
