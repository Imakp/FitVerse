const Reward = require("../models/rewards");

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
        const rewards = await Reward.find();
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createReward, getRewards };
