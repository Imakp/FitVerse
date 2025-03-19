const express = require("express");
const { rewardUser, spendCoins } = require("../controllers/transactionController");

const router = express.Router();

router.post("/reward", rewardUser);
router.post("/spend", spendCoins);

module.exports = router;
