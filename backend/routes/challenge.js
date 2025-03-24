const express = require("express");
const router = express.Router();
const Challenge = require("../models/challenge");

router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json({ challenges });
  } catch (err) {
    console.error("Failed to fetch challenges:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
