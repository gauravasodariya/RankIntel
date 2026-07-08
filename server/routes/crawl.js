const express = require("express");
const { startCrawl, getCrawlById } = require("../controllers/crawlController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, startCrawl);
router.get("/:id", protect, getCrawlById);

module.exports = router;
