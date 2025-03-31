// components/RewardCard.js
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { spendCoins } from "../../api/rewardsApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Coins, Gift, Check, Loader2 } from "lucide-react";

const RewardCard = ({ reward, onRedeem }) => {
  const { title, description, coins, _id: rewardId } = reward;
  const { user, balance } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRedeemed, setIsRedeemed] = useState(false);

  const canAfford = balance >= coins;

  const handleRedeemClick = async () => {
    if (!user?._id) {
      toast.error("Please log in to redeem rewards.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const result = await spendCoins(
        user._id,
        coins,
        `Redeemed reward: ${title}`
      );

      if (!result) {
        throw new Error(
          result?.message || "Failed to redeem reward. Insufficient balance?"
        );
      }

      setIsRedeemed(true);
      toast.success("Reward redeemed successfully!");

      if (onRedeem) {
        onRedeem(rewardId);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500 flex flex-col justify-between overflow-hidden"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mr-2">{title}</h3>

          <span className="text-md font-semibold text-yellow-600 flex items-center flex-shrink-0 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200">
            <Coins size={16} className="mr-1.5" />
            {coins.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-5 min-h-[40px]">{description}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRedeemClick}
          disabled={isLoading || isRedeemed || !canAfford}
          className={`w-full flex items-center justify-center space-x-2 text-white font-medium rounded-md text-sm px-4 py-2.5 text-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isRedeemed
              ? "bg-green-500 cursor-default focus:ring-green-400"
              : !canAfford
              ? "bg-gray-400 cursor-not-allowed focus:ring-gray-400"
              : isLoading
              ? "bg-yellow-500 cursor-wait focus:ring-yellow-400"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isRedeemed ? (
            <Check size={18} />
          ) : (
            <Gift size={18} />
          )}
          <span>
            {isLoading
              ? "Redeeming..."
              : isRedeemed
              ? "Redeemed"
              : !canAfford
              ? "Insufficient Coins"
              : "Redeem"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RewardCard;
