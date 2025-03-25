const express = require("express");
const router = express.Router();
const {
  getChallenges,
  redeemChallenge,
} = require("../controllers/challengeController");

router.get("/", getChallenges);
router.patch("/:id", redeemChallenge);

module.exports = router;
