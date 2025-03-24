// components/RewardCard.js
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { spendCoins } from "../../api/rewardsApi";
import { toast } from "react-toastify";

const RewardCard = ({ reward, onRedeem }) => {
  const { title, description, coins } = reward;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRedeem = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await spendCoins(
        user._id,
        coins,
        `Redeemed reward: ${title}`
      );

      if (!result) {
        throw new Error("Failed to redeem reward");
      }

      setSuccess(true);
      toast.success("Reward redeemed successfully!");
      // Call the parent component's callback to update the rewards list and balance
      if (onRedeem) {
        onRedeem(reward._id);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
            <svg
              className="w-4 h-4 text-yellow-700 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 13V7h2v6H8zm4-9a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <span className="font-medium text-yellow-800">{coins} coins</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{description}</p>

        <button
          onClick={handleRedeem}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
        >
          {isLoading ? "Redeeming..." : "Redeem Reward"}
        </button>
      </div>
    </div>
  );
};

export default RewardCard;
