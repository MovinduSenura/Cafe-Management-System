const express = require('express');
const customerController = require('../controllers/customerController');
const { validateCustomer, validateFeedback, validateCustomerUpdate } = require('../middleware/validation');
const router = express.Router();

// Customer routes
router.post('/customers', validateCustomer, customerController.createCustomer);
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/analytics', customerController.getCustomerAnalytics);
router.get('/customers/:id', customerController.getCustomerById);
router.put('/customers/:id', validateCustomerUpdate, customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);
router.patch('/customers/:customerId/stats', customerController.updateCustomerStats);

// Feedback routes
router.post('/customers/feedback', validateFeedback, customerController.createFeedback);
router.get('/customers/feedback', customerController.getAllFeedback);
router.get('/customers/feedbacks', customerController.getAllFeedback); // Legacy route
router.put('/customers/feedback/:id', customerController.updateFeedback);

// Health check route
router.get('/health', customerController.healthCheck);

module.exports = router;