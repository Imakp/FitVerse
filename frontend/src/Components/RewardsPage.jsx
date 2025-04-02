import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { spendCoins, fetchRewards } from "../api/rewardsApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Coins, Gift, Check, Loader2 } from "lucide-react";
import axios from "axios";

const RewardCard = ({ reward, onRedeemSuccess }) => {
  // Rename prop for clarity
  const { title, description, coins, _id: rewardId } = reward;
  const { user, balance, refreshBalance } = useAuth();
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
        coins, // amount
        `Redeemed reward: ${title}` // reference
      );

      if (!result || !result.success) {
        throw new Error(
          result?.message || "Failed to redeem reward. Insufficient balance?"
        );
      }

      setIsRedeemed(true);
      toast.success("Reward redeemed successfully!");

      await refreshBalance();

      if (onRedeemSuccess) {
        onRedeemSuccess(rewardId);
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

const RewardsList = ({ rewards: initialRewards }) => {
  const [rewards, setRewards] = useState(initialRewards);
  const { user } = useAuth();

  useEffect(() => {
    setRewards(initialRewards);
  }, [initialRewards]);

  if (!rewards || !rewards.length) {
    return <div className="text-center py-12"></div>;
  }

  const handleRewardRedeemed = (rewardId) => {
    console.log(`Reward ${rewardId} redeemed, balance refreshed via context.`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rewards.map((reward) => (
        <RewardCard
          key={reward._id}
          reward={reward}
          onRedeemSuccess={handleRewardRedeemed}
        />
      ))}
    </div>
  );
};

const RewardsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const rewardsData = await fetchRewards();
        setRewards(rewardsData || []);
      } catch (error) {
        console.error("Error loading rewards data:", error);
        toast.error("Failed to load rewards. Please try again later.");
        setRewards([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Rewards Store</h1>
          <p className="mt-1 text-gray-600">
            Redeem your hard-earned coins for exciting rewards!
          </p>
        </motion.header>

        <RewardsList rewards={rewards} />

        {rewards.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-6 bg-white rounded-xl shadow-lg border border-gray-100 mt-8"
          >
            <Gift size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Rewards Available
            </h3>
            <p className="text-gray-500">
              Keep earning coins! New rewards are added regularly.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;
