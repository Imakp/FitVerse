const express = require("express");
const {
  createReward,
  getAllRewards,
} = require("../controllers/rewardController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("/", isAuthenticated, createReward);
router.get("/all", isAuthenticated, getAllRewards);

module.exports = router;
