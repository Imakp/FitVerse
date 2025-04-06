const mongoose = require("mongoose");
const User = require("../models/user");

const getBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, balance: user.wallet.balance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: error.message });
  }
};

const addCoins = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res
        .status(400)
        .json({ message: "User ID and amount are required" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.wallet) {
      user.wallet = { balance: 0, transactions: [] };
    }

    user.wallet.balance += amount;

    await user.save();

    res.json({ success: true, newBalance: user.wallet.balance });
  } catch (error) {
    console.error("Error adding coins:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBalance, addCoins };
