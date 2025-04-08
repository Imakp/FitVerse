const express = require("express");
const {
  createReward,
  getAllRewards,
} = require("../controllers/rewardController");

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please log in." });
};

router.post("/", createReward); 
router.get("/all", isAuthenticated, getAllRewards); 

module.exports = router;
