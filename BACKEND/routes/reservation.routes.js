const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const {
    createReservation,
    getAllReservations,
    sendConfirmationEmail
} = require("../controller/reservation.controller");

// Public routes (customers can make reservations)
router.post('/create', createReservation);

// Protected routes
router.use(authenticateToken);

// All staff can view reservations
router.get('/', getAllReservations);

// Confirmation email route
router.post('/confirm-email',
    authorizeRoles('admin', 'manager', 'cashier'),
    sendConfirmationEmail
);

module.exports = router;