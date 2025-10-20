const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const {
    getAllTables
} = require("../controller/table.controller");

// Protected routes
router.use(authenticateToken);

// All staff can view tables
router.get('/', getAllTables);

module.exports = router;