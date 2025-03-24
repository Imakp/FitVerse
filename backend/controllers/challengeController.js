const Challenge = require("../models/challenge");
const User = require("../models/user"); 

exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Error fetching challenges", error });
  }
};

// ✅ Get all challenges with user progress
exports.getUserChallenges = async (req, res) => {
  try {
    const { userId } = req.params;

    const challenges = await Challenge.find({
      "users.userId": userId,
    });

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Error fetching challenges", error });
  }
};

// ✅ Update user progress in challenge
exports.updateProgress = async (req, res) => {
  try {
    const { userId, challengeId, progress } = req.body;

    let challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    // Find the user in the challenge
    let userProgress = challenge.users.find(
      (u) => u.userId.toString() === userId
    );

    if (userProgress) {
      userProgress.progress = progress;
      if (userProgress.progress >= challenge.goal) {
        userProgress.completed = true;
      }
    } else {
      // If user not found, add them
      challenge.users.push({
        userId,
        progress,
        completed: progress >= challenge.goal,
      });
    }

    await challenge.save();
    res.json({ message: "Progress updated", challenge });
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error });
  }
};

// ✅ Redeem coins after completing a challenge
exports.redeemCoins = async (req, res) => {
  try {
    const { userId, challengeId } = req.body;

    let challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    let userProgress = challenge.users.find(
      (u) => u.userId.toString() === userId
    );

    if (!userProgress || !userProgress.completed) {
      return res.status(400).json({ message: "Challenge not completed yet" });
    }

    if (userProgress.redeemed) {
      return res.status(400).json({ message: "Coins already redeemed" });
    }

    // Update the user's wallet balance
    let user = await User.findById(userId);
    user.wallet.balance += challenge.reward;

    // Mark challenge as redeemed
    userProgress.redeemed = true;

    await user.save();
    await challenge.save();

    res.json({ message: "Coins redeemed successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error redeeming coins", error });
  }
};
