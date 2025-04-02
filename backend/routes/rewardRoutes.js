const express = require("express");
const {
  createReward,
  getAllRewards,
} = require("../controllers/rewardController");

const router = express.Router();

router.post("/", createReward);
router.get("/all", getAllRewards);

module.exports = router;
