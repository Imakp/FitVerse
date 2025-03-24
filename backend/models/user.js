const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  oauthProvider: { type: String, required: true }, // e.g., "google"
  oauthId: { type: String, required: true }, // Unique ID from OAuth provider
  email: { type: String, required: true, unique: true },
  name: { type: String },
  profilePicture: { type: String },
  fitnessData: {
    stepCount: { type: Number, default: 0 },
    activeMinutes: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
  },
  redeemedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
  wallet: {
    balance: { type: Number, default: 0 }, // User's coin balance
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }]
}
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
