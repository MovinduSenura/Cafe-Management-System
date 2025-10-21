const express = require('express');
const menuRoutes = require('./menuRoutes');
const router = express.Router();

router.use('/', menuRoutes);

module.exports = router;
