const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const {
    addpromotion,
    getAllpromotions,
    getOnepromotion,
    updatepromotion,
    deletepromotion,
    promotiongenerateInvoice,
    searchPromotion
} = require("../controller/promotion.controller");

// Public routes
router.get('/search', searchPromotion);
router.get('/:id', getOnepromotion);
router.get('/', getAllpromotions);

// Protected routes
router.use(authenticateToken);

// Manager and admin routes
router.post('/create',
    authorizeRoles('admin', 'manager'),
    addpromotion
);

router.patch('/:id',
    authorizeRoles('admin', 'manager'),
    updatepromotion
);

router.get('/invoice/:id',
    authorizeRoles('admin', 'manager', 'cashier'),
    promotiongenerateInvoice
);

// Admin only routes
router.delete('/:id',
    authorizeRoles('admin'),
    deletepromotion
);

module.exports = router;