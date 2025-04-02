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

const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rewards", error });
  }
};

module.exports = { createReward, getAllRewards };
