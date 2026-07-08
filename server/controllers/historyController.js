const Audit = require('../models/Audit');

// @desc    Get user's audit history
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const audits = await Audit.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHistory };
