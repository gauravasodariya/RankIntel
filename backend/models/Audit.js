const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    url: { type: String, required: true },
    score: { type: Number, required: true },
    performance: { type: Number, required: true },
    accessibility: { type: Number, required: true },
    bestPractices: { type: Number, required: true },
    seo: { type: Number, required: true },
    issues: [{ type: Object }],
    keywords: [{ word: String, count: Number, density: String }],
    coreWebVitals: {
      lcp: { type: String },
      lcpStatus: { type: String },
      cls: { type: String },
      clsStatus: { type: String },
      inp: { type: String },
      inpStatus: { type: String },
      fcp: { type: String },
      ttfb: { type: String },
    },
    recommendations: [{ type: String }],
    psiData: { type: Object }, // Store full PSI data
  },
  { timestamps: true },
);

module.exports = mongoose.model("Audit", auditSchema);
