const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const {
    addItem,
    getAllItems,
    getOneItem,
    updateItem,
    deleteItem,
    searchItem,
    stockgenerateInvoice
} = require("../controller/stock.controller");

// Public routes
router.get('/search', searchItem);

// Protected routes only (all stock operations require authentication)
router.use(authenticateToken);

// All staff can view stock
router.get('/', getAllItems);
router.get('/:id', getOneItem);

// Manager and admin can manage stock
router.post('/create',
    authorizeRoles('admin', 'manager'),
    addItem
);

router.patch('/:id',
    authorizeRoles('admin', 'manager'),
    updateItem
);

router.get('/invoice/generate',
    authorizeRoles('admin', 'manager'),
    stockgenerateInvoice
);

// Admin only routes
router.delete('/:id',
    authorizeRoles('admin'),
    deleteItem
);

module.exports = router;