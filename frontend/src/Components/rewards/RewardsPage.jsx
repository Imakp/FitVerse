import React, { useState, useEffect } from "react";
import RewardsList from "./RewardsList";
import { fetchRewards } from "../../api/rewardsApi";

const RewardsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch rewards
        const rewardsData = await fetchRewards();
        setRewards(rewardsData);
      } catch (error) {
        console.error("Error loading rewards data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Available Rewards
      </h1>
      <RewardsList rewards={rewards} />
    </div>
  );
};

export default RewardsPage;
