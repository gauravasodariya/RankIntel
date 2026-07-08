const express = require("express");
const {
  compareWebsites,
  getComparisonById,
} = require("../controllers/comparisonController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, compareWebsites);
router.get("/:id", protect, getComparisonById);

module.exports = router;
