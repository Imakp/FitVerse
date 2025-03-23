const mongoose = require("mongoose");

const fitnessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stepCount: { type: Number, default: 0 },
  activeMinutes: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
});

module.exports = mongoose.model("FitnessData", fitnessSchema);
