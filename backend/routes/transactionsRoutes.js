const express = require("express");
const { spendCoins } = require("../controllers/transactionController");

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please log in." });
};

router.post("/spend", isAuthenticated, spendCoins);

module.exports = router;
