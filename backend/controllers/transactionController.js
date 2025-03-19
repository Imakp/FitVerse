const User = require("../models/user");
const Transaction = require("../models/transactions");

const rewardUser = async (req, res) => {
    try {
        console.log("Received request:", req.body); // Debugging line
        const { userId, amount } = req.body;

        if (!userId || !amount) {
            return res.status(400).json({ message: "User ID and amount are required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure wallet exists
        if (!user.wallet) {
            user.wallet = { balance: 0, transactions: [] };
        }

        user.wallet.balance += amount;
        await user.save();

        res.json({ message: "Coins rewarded successfully", balance: user.wallet.balance });
    } catch (error) {
        console.error("Error in rewardUser:", error);
        res.status(500).json({ error: error.message });
    }
};

const spendCoins = async (req, res) => {
    console.log("Received request body:", req.body); // Debugging line

    const { userId, amount, reference } = req.body;

    if (!userId || !amount || !reference) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure wallet exists
        if (!user.wallet) {
            return res.status(400).json({ message: "Wallet not initialized for this user" });
        }

        if (user.wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        user.wallet.balance -= amount;
        const transaction = new Transaction({ user: userId, type: "spend", amount, reference });
        await transaction.save();

        user.wallet.transactions.push(transaction._id);
        await user.save();

        res.json({ success: true, message: "Coins spent", balance: user.wallet.balance });
    } catch (error) {
        console.error("Error processing transaction:", error);
        res.status(500).json({ error: error.message });
    }
};



module.exports = { rewardUser, spendCoins };
