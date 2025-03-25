const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  metric: { type: String, required: true, index: true }, // e.g., "stepCount", "activeMinutes"
  target: { type: Number, required: true },
  redeemed: { type: Boolean, default: false, index: true },
  unit: { type: String, required: true }, // e.g., "steps", "minutes"
  reward: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Challenge", ChallengeSchema);
