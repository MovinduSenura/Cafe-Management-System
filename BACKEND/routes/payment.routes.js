const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const { validatePayment } = require("../middleware/validation");
const {
    addPayment,
    getAllPayments,
    getOnePayment,
    updatePayment,
    deletePayment,
    searchPayment,
    PaymentGenerateInvoice
} = require("../controller/payment.controller");

// Public routes
router.get('/search', searchPayment);

// Protected routes only (all payment operations require authentication)
router.use(authenticateToken);

// Cashier and above routes
router.post('/create',
    authorizeRoles('admin', 'manager', 'cashier'),
    validatePayment,
    addPayment
);

router.get('/', getAllPayments);
router.get('/:id', getOnePayment);

// Manager and admin routes
router.patch('/:id',
    authorizeRoles('admin', 'manager'),
    validatePayment,
    updatePayment
);

router.get('/invoice/generate',
    authorizeRoles('admin', 'manager'),
    PaymentGenerateInvoice
);

// Admin only routes
router.delete('/:id',
    authorizeRoles('admin'),
    deletePayment
);

module.exports = router;