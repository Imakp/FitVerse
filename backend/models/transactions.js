const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["earn", "spend", "transfer"], required: true },
    amount: { type: Number, required: true },
    reference: { type: String }, // Reason (e.g., "Completed Task", "Bought Item")
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
