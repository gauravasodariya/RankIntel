const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  yourUrl: { type: String, required: true },
  competitorUrl: { type: String, required: true },
  yourMetrics: { type: Object, required: true },
  competitorMetrics: { type: Object, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comparison', comparisonSchema);
