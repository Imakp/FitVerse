import React from "react";

const transactions = [
  { id: 1, reward: "$5 Cash Reward", date: "2025-03-17", coins: 500 },
  { id: 2, reward: "Coffee Voucher", date: "2025-03-16", coins: 200 },
  { id: 3, reward: "10% OFF Fitness Store", date: "2025-03-15", coins: 100 },
  { id: 4, reward: "1 Month Premium", date: "2025-03-14", coins: 300 },
];

const TransactionHistory = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="p-4 text-left">Reward</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Coins Spent</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`border-t ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-4 font-medium text-gray-800">
                  {transaction.reward}
                </td>
                <td className="p-4 text-gray-600">{transaction.date}</td>
                <td className="p-4 font-semibold text-red-500">
                  -{transaction.coins} Coins
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
