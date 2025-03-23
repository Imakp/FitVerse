const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  metric: String, // e.g., "stepCount", "activeMinutes", "caloriesBurned"
  target: Number,
  unit: String, // e.g., "steps", "minutes", "kcal"
  reward: Number,
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
