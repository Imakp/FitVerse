const express = require("express");
const {
  createReward,
  getRewards,
  getAllRewards,
} = require("../controllers/rewardController");

const router = express.Router();

router.post("/", createReward);
router.get("/", getRewards);
router.get("/all", getAllRewards);

module.exports = router;
