const express = require("express");
const { getBalance, addCoins } = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/balance/:userId", isAuthenticated, getBalance);
router.post("/add-coins", isAuthenticated, addCoins);

module.exports = router;
