const express = require("express");
const { createReward, getRewards } = require("../controllers/rewardController");

const router = express.Router();

router.post("/", createReward);
router.get("/", getRewards);

module.exports = router;
