const Reward = require("../models/rewards");
const Challenge = require("../models/challenge");
const Transaction = require("../models/transactions");

const createReward = async (req, res) => {
  try {
    const { title, description, coins } = req.body;
    const reward = new Reward({ title, description, coins });
    await reward.save();

    res.json({ success: true, message: "Reward created", reward });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRewards = async (req, res) => {
  try {
    const { userId, challengeId, amount } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Check if user has already redeemed this challenge
    const existingTransaction = await Transaction.findOne({
      userId,
      challengeId,
    });

    if (existingTransaction) {
      return res.status(400).json({
        message: "Challenge already redeemed",
        redeemed: true, // Frontend can use this to update UI
        challengeId,
      });
    }

    // Add new transaction record
    const transaction = new Transaction({
      userId,
      challengeId,
      amount,
      type: "reward",
      timestamp: new Date(),
    });
    await transaction.save();

    // Update user balance
    user.balance += amount;
    await user.save();

    res.status(200).json({
      message: "Coins added successfully",
      balance: user.balance,
      redeemed: true, // Mark as redeemed
      challengeId,
    });
  } catch (error) {
    console.error("Error rewarding coins:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rewards", error });
  }
};

module.exports = { createReward, getRewards, getAllRewards };
