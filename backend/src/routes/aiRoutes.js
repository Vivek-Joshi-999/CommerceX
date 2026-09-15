const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getRecommendations } = require("../controllers/aiController");

router.get("/recommendations", authMiddleware, getRecommendations);

module.exports = router;