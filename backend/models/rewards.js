const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  coins: { type: Number, required: true }, // Coins earned per task
});

module.exports = mongoose.model("Reward", RewardSchema);
