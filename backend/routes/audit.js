const express = require('express');
const { createAudit, getAuditById, deleteAudit } = require('../controllers/auditController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createAudit);
router.get('/:id', protect, getAuditById);
router.delete('/:id', protect, deleteAudit);

module.exports = router;
