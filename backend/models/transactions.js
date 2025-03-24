const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["earn", "spend", "transfer", "reward"],
      required: true,
    },
    amount: { type: Number, required: true },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      default: null,
    }, // Track challenge rewards
    reference: { type: String }, // Reason (e.g., "Completed Task", "Bought Item")
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true } // Auto-add createdAt and updatedAt
);

module.exports = mongoose.model("Transaction", TransactionSchema);
