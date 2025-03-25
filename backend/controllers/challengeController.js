const Challenge = require("../models/challenge");

// Get all challenges
const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json({ challenges });
  } catch (err) {
    console.error("Failed to fetch challenges:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Redeem a challenge
const redeemChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid challenge ID" });
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      id,
      { redeemed: true },
      { new: true }
    );

    if (!updatedChallenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    res.status(200).json(updatedChallenge);
  } catch (error) {
    res.status(500).json({ error: "Failed to update challenge" });
  }
};

module.exports = {
  getChallenges,
  redeemChallenge,
};
