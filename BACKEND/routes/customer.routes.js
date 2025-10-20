const express = require("express");
const CustomerRouter = express.Router();
const {
    addCustomer,
    getAllCustomers,
    getOneCustomer,
    updateCustomer,
    deleteCustomer,
    customerGenerateInvoice,
    searchCustomer,
    addFeedback,
    getFeedback,
    getOneFeedback,
    updateFeedback,
    deleteFeedback,
    loginFeedback,
    allFeedbacks,
    searchFeedback,
    getAllFeedbacks,
    getFeedbackById,
    postReplyToFeedback,
    getNameAndLoyaltyPoints,
    updateLoyaltyPoints,
} = require("../controller/customer.controller");

const { 
    validateCustomerCreate, 
    validateCustomerUpdate, 
    validateFeedback 
} = require("../middleware/validation");

// Customer CRUD routes
CustomerRouter.post('/create', validateCustomerCreate, addCustomer);
CustomerRouter.get('/', getAllCustomers);
CustomerRouter.get('/search', searchCustomer);
CustomerRouter.get('/reports/invoice', customerGenerateInvoice);
CustomerRouter.get('/:id', getOneCustomer);
CustomerRouter.patch('/:id', validateCustomerUpdate, updateCustomer);
CustomerRouter.delete('/:id', deleteCustomer);

// Customer utility routes
CustomerRouter.get('/find/:identifier', getNameAndLoyaltyPoints);
CustomerRouter.patch('/loyalty-points/:id', updateLoyaltyPoints);

// Feedback routes
CustomerRouter.post('/:userid/feedback', validateFeedback, addFeedback);
CustomerRouter.get('/:userid/feedback', getFeedback);
CustomerRouter.get('/feedback/all', getAllFeedbacks);
CustomerRouter.get('/feedback/search', searchFeedback);
CustomerRouter.get('/feedback/:feedbackId', getFeedbackById);
CustomerRouter.get('/:customerNIC/feedback/:feedbackId', getOneFeedback);
CustomerRouter.patch('/:customerNIC/feedback/:feedbackId', validateFeedback, updateFeedback);
CustomerRouter.delete('/:userId/feedback/:feedbackId', deleteFeedback);
CustomerRouter.post('/feedback/:feedbackId/reply', postReplyToFeedback);

// Authentication route
CustomerRouter.get('/auth/:nic', loginFeedback);

// Legacy routes (kept for backward compatibility)
CustomerRouter.get('/feedbackall', getAllFeedbacks);
CustomerRouter.get('/feedback/all', allFeedbacks);

module.exports = CustomerRouter;