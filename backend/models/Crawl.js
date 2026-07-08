const mongoose = require("mongoose");

const crawlSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    baseUrl: { type: String, required: true },
    totalPages: { type: Number, default: 0 },
    brokenPages: { type: Number, default: 0 },
    duplicatePages: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    pages: [{ url: String, score: Number, status: String }],
    brokenPageDetails: [{ url: String, status: Number }],
    duplicatePageDetails: [{ url: String, duplicateOf: String }],
    status: { type: String, default: "pending" },
    error: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Crawl", crawlSchema);
