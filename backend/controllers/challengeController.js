const Challenge = require("../models/challenge");

// Get all challenges
const getChallenges = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const challenges = await Challenge.find().lean();
    
    // Add isRedeemed flag for the current user
    const challengesWithRedemptionStatus = challenges.map(challenge => ({
      ...challenge,
      isRedeemed: challenge.redeemedBy?.includes(userId)
    }));

    res.json({ challenges: challengesWithRedemptionStatus });
  } catch (err) {
    console.error("Failed to fetch challenges:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Redeem a challenge
const redeemChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findById(id);
    
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    // Check if user has already redeemed this challenge
    if (challenge.redeemedBy?.includes(userId)) {
      return res.status(400).json({ error: "Challenge already redeemed" });
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      id,
      { $push: { redeemedBy: userId } },
      { new: true }
    );

    res.status(200).json(updatedChallenge);
  } catch (error) {
    console.error("Failed to redeem challenge:", error);
    res.status(500).json({ error: "Failed to update challenge" });
  }
};

module.exports = {
  getChallenges,
  redeemChallenge,
};
