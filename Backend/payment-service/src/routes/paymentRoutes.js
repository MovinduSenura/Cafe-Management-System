const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

// Payment routes
router.post('/payments', paymentController.processPayment);
router.get('/payments', paymentController.getAllPayments);
router.get('/payments/analytics', paymentController.getPaymentAnalytics);
router.get('/payments/:id', paymentController.getPaymentById);
router.post('/payments/:id/refund', paymentController.refundPayment);

// Health check
router.get('/health', paymentController.healthCheck);

module.exports = router;
