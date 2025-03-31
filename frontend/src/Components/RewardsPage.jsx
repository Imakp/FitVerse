import React, { useState, useEffect } from "react";
import RewardsList from "./RewardsList";
import { fetchRewards } from "../api/rewardsApi";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

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
