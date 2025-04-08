const express = require("express");
const { getBalance, addCoins } = require("../controllers/userController"); 

const router = express.Router();

router.get("/balance/:userId", getBalance);
router.post("/add-coins", addCoins);

module.exports = router;
