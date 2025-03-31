import React, { useState } from "react";
import RewardCard from "./RewardCard";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const RewardsList = ({ rewards: initialRewards }) => {
  const [rewards, setRewards] = useState(initialRewards);
  const { user } = useAuth();

  const handleRedeem = async (redeemedRewardId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/balance/${user._id}`
      );
      window.dispatchEvent(
        new CustomEvent("balanceUpdated", {
          detail: { balance: response.data.balance },
        })
      );
    } catch (error) {
      console.error("Failed to update balance:", error);
    }
  };

  if (!rewards.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No rewards available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rewards.map((reward) => (
        <RewardCard key={reward._id} reward={reward} onRedeem={handleRedeem} />
      ))}
    </div>
  );
};

export default RewardsList;
