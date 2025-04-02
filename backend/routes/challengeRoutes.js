const express = require("express");
const router = express.Router();
const {
  getChallenges,
  redeemChallenge,
} = require("../controllers/challengeController");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please log in." });
};

router.get("/", isAuthenticated, getChallenges);
router.patch("/:id", isAuthenticated, redeemChallenge);

module.exports = router;
