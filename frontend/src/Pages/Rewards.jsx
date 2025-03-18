import React, { useState } from "react";
import TransactionHistory from "../Components/TransactionHistory";

const rewards = [
  {
    id: 1,
    title: "$5",
    desc: "Cash Reward",
    coins: 500,
    color: "bg-blue-100",
    buttonColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "VOUCHER",
    desc: "Coffee Voucher",
    coins: 200,
    color: "bg-green-100",
    buttonColor: "bg-green-500",
  },
  {
    id: 3,
    title: "10% OFF",
    desc: "Fitness Store",
    coins: 100,
    color: "bg-yellow-100",
    buttonColor: "bg-yellow-500",
  },
  {
    id: 4,
    title: "PREMIUM",
    desc: "1 Month Premium",
    coins: 300,
    color: "bg-red-100",
    buttonColor: "bg-red-500",
  },
];

const Rewards = () => {
  const [activeTab, setActiveTab] = useState("rewards"); // State to track active tab

  return (
    <div className="flex flex-col items-center bg-white justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Navbar Section */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-6 pb-2 mb-6">
            <h1
              className={`text-xl border-b pb-2 font-bold cursor-pointer ${
                activeTab === "rewards" ? "  text-blue-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("rewards")}
            >
              Rewards Catalog
            </h1>
            <h1
              className={`text-xl font-bold pb-2 border-b cursor-pointer ${
                activeTab === "history" ? " text-blue-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Transaction History
            </h1>
          </div>

          {/* Coin Balance */}
          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg">
            250 Coins
          </span>
        </div>

        {/* Content Section */}
        {activeTab === "rewards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-6 rounded-lg shadow-lg text-center ${reward.color}`}
              >
                <h2 className="text-4xl py-4 font-bold">{reward.title}</h2>
                <p className="text-md text-gray-700">{reward.desc}</p>
                <button
                  className={`mt-4 text-white px-4 py-2 rounded-3xl text-lg ${
                    reward.buttonColor
                  } ${
                    reward.coins > 250 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={reward.coins > 250}
                >
                  Redeem - {reward.coins} Coins
                </button>
              </div>
            ))}
          </div>
        ) : (
          <TransactionHistory />
        )}
      </div>
    </div>
  );
};

export default Rewards;
