const User = require("../models/user");
const Transaction = require("../models/transactions");

const spendCoins = async (req, res) => {
  const authenticatedUserId = req.user?._id;
  const { amount, reference } = req.body;

  console.log(
    `Spending request for user: ${authenticatedUserId}, amount: ${amount}, reference: ${reference}`
  );

  if (!authenticatedUserId) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!amount || !reference) {
    return res
      .status(400)
      .json({ message: "Amount and reference are required" });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  try {
    const user = await User.findById(authenticatedUserId);
    if (!user)
      return res
        .status(404)
        .json({ message: "Authenticated user not found in database" });

    if (!user.wallet) {
      return res
        .status(400)
        .json({ message: "Wallet not initialized for this user" });
    }

    if (user.wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.wallet.balance -= amount;

    const transaction = new Transaction({
      user: authenticatedUserId,
      type: "spend",
      amount,
      reference,
    });
    await transaction.save();

    user.wallet.transactions.push(transaction._id);
    await user.save();

    res.json({
      success: true,
      message: "Coins spent",
      balance: user.wallet.balance,
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { spendCoins };
