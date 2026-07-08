const express = require('express');
const { exportPDF } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/pdf/:id', protect, exportPDF);

module.exports = router;
