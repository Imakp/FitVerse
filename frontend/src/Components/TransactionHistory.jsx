import React from "react";

const transactions = [
  { id: 1, reward: "$5 Cash Reward", date: "2025-03-17", coins: 500 },
  { id: 2, reward: "Coffee Voucher", date: "2025-03-16", coins: 200 },
  { id: 3, reward: "10% OFF Fitness Store", date: "2025-03-15", coins: 100 },
  { id: 4, reward: "1 Month Premium", date: "2025-03-14", coins: 300 },
];

const TransactionHistory = () => {
  return (
    <div className=" mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Reward</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Coins Spent</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="p-3">{transaction.reward}</td>
                <td className="p-3">{transaction.date}</td>
                <td className="p-3 text-red-500">-{transaction.coins} Coins</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
