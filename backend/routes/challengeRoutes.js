const express = require("express");
const router = express.Router();
const {
  getChallenges,
  redeemChallenge,
} = require("../controllers/challengeController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, getChallenges);
router.patch("/:id", isAuthenticated, redeemChallenge);

module.exports = router;
