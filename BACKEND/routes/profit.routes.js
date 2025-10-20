const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const {
    addProfit,
    getAllProfits,
    getOneProfit,
    updateProfit
} = require("../controller/profit.controller");

// Protected routes only (all profit operations require authentication)
router.use(authenticateToken);

// Manager and admin only routes (profit data is sensitive)
router.use(authorizeRoles('admin', 'manager'));

router.get('/', getAllProfits);
router.get('/:id', getOneProfit);
router.post('/create', addProfit);
router.patch('/:id', updateProfit);

module.exports = router;