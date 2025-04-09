const express = require("express");
const { spendCoins } = require("../controllers/transactionController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("/spend", isAuthenticated, spendCoins);

module.exports = router;
