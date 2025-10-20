const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../config/multer");
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const { validateMenuItem, validateMenuItemUpdate } = require("../middleware/validation");
const {
    addmenuItem,
    getAllmenuItems,
    getOnemenuItem,
    searchmenuItem,
    updatemenuItem,
    deletemenuItem,
    menuItemgenerateInvoice,
} = require("../controller/menuItem.controller");

// Apply multer error handling middleware
router.use(handleMulterError);

// Public routes (no authentication required)
router.get('/', getAllmenuItems);
router.get('/search', searchmenuItem);
router.get('/:id', getOnemenuItem);

// Protected routes (authentication required)
router.use(authenticateToken);

// Admin and manager only routes
router.post('/create', 
    authorizeRoles('admin', 'manager'),
    upload.single("menuItemImage"), 
    validateMenuItem,
    addmenuItem
);

router.patch('/:id', 
    authorizeRoles('admin', 'manager'),
    upload.single("menuItemImage"), 
    validateMenuItemUpdate,
    updatemenuItem
);

router.delete('/:id', 
    authorizeRoles('admin'),
    deletemenuItem
);

// Admin only routes
router.get('/reports/invoice', 
    authorizeRoles('admin'),
    menuItemgenerateInvoice
);

module.exports = router;