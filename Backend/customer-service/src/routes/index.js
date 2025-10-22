const express = require('express');
const customerRoutes = require('./customerRoutes');
const router = express.Router();

// Register customer routes
router.use('/', customerRoutes);

module.exports = router;
