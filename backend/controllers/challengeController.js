const mongoose = require("mongoose");
const Challenge = require("../models/challenge");
const User = require("../models/user");
const Transaction = require("../models/transactions");

const getChallenges = async (req, res) => {
  try {
    const authenticatedUserId = req.user?._id;
    if (!authenticatedUserId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const challenges = await Challenge.find().lean();

    const challengesWithRedemptionStatus = challenges.map((challenge) => ({
      ...challenge,

      isRedeemed: challenge.redeemedBy?.some((id) =>
        id.equals(authenticatedUserId)
      ),
    }));

    res.json({ challenges: challengesWithRedemptionStatus });
  } catch (err) {
    console.error("Failed to fetch challenges:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const redeemChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    const authenticatedUserId = req.user?._id;

    if (!authenticatedUserId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid challenge ID format" });
    }

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    if (challenge.redeemedBy?.some((id) => id.equals(authenticatedUserId))) {
      return res
        .status(400)
        .json({ error: "Challenge already redeemed by this user" });
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      id,
      { $push: { redeemedBy: authenticatedUserId } },
      { $push: { redeemedBy: authenticatedUserId } },
      { new: true } // Return the updated document
    );

    if (!updatedChallenge) {
      return res
        .status(500)
        .json({ error: "Failed to update challenge after finding it" });
    }

    const user = await User.findById(authenticatedUserId);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Authenticated user not found for awarding coins" });
    }

    if (!user.wallet) {
      user.wallet = { balance: 0, transactions: [] };
    }

    const rewardAmount = updatedChallenge.reward;

    // Add coins to user's balance
    user.wallet.balance += rewardAmount;

    const transaction = new Transaction({
      user: authenticatedUserId,
      type: "reward", // Mark as reward transaction
      amount: rewardAmount,
      reference: `Challenge: ${updatedChallenge.title}`,
      timestamp: new Date(),
    });
    await transaction.save();

    user.wallet.transactions.push(transaction._id);

    await user.save();

    res.status(200).json({
      challenge: {
        ...updatedChallenge.toObject(),
        isRedeemed: true,
      },
      newBalance: user.wallet.balance,
      message: `Challenge redeemed successfully! ${rewardAmount} coins awarded.`,
    });
  } catch (error) {
    console.error("Failed to redeem challenge:", error);
    res.status(500).json({ error: "Failed to update challenge" });
  }
};

module.exports = {
  getChallenges,
  redeemChallenge,
};
