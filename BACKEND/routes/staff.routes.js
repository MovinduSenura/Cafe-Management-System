const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const { validateStaff, validateStaffUpdate, validateLogin } = require("../middleware/validation");
const {
    addstaff,
    StaffLogin,
    getAllstaff,
    getOnestaff,
    updatestaff,
    deletestaff,
    searchStaff,
    staffGenerateInvoice
} = require("../controller/staff.controller");

// Public routes (authentication)
router.post('/login', validateLogin, StaffLogin);
router.get('/search', searchStaff);

// Protected routes
router.use(authenticateToken);

// Manager and admin routes
router.get('/',
    authorizeRoles('admin', 'manager'),
    getAllstaff
);

router.get('/:id',
    authorizeRoles('admin', 'manager'),
    getOnestaff
);

// Admin only routes
router.post('/register',
    authorizeRoles('admin'),
    validateStaff,
    addstaff
);

router.patch('/:id',
    authorizeRoles('admin'),
    validateStaffUpdate,
    updatestaff
);

router.delete('/:id',
    authorizeRoles('admin'),
    deletestaff
);

router.get('/invoice/generate',
    authorizeRoles('admin'),
    staffGenerateInvoice
);

module.exports = router;