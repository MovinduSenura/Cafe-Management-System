const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const { validateOrder, validateOrderUpdate } = require("../middleware/validation");
const {
    addOrder,
    getAllOrders,
    getOneOrder,
    updateOrder,
    deleteOrder,
    searchOrder,
    OrdergenerateInvoice
} = require("../controller/Order.controller");

// Public routes
router.get('/search', searchOrder);
router.get('/:id', getOneOrder);

// Protected routes
router.use(authenticateToken);

// All authenticated users can view orders
router.get('/', getAllOrders);

// Cashier and above can create/update orders
router.post('/create',
    authorizeRoles('admin', 'manager', 'cashier'),
    validateOrder,
    addOrder
);

router.patch('/:id',
    authorizeRoles('admin', 'manager', 'cashier'),
    validateOrderUpdate,
    updateOrder
);

router.get('/invoice/:id',
    authorizeRoles('admin', 'manager', 'cashier'),
    OrdergenerateInvoice
);

// Admin only routes
router.delete('/:id',
    authorizeRoles('admin'),
    deleteOrder
);

module.exports = router;