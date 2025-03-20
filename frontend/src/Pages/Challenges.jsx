import { useEffect, useState } from "react";
import axios from "axios";
import { FaRunning, FaWalking, FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { useAuth } from "../context/AuthContext";

const challenges = {
  Active: [
    {
      id: 1,
      title: "10K Steps Challenge",
      description: "Walk 10,000 steps daily for 7 days",
      progress: 3,
      total: 7,
      daysLeft: 5,
      coins: 50,
    },
    {
      id: 2,
      title: "Sleep Well Challenge",
      description: "7+ hours of sleep for 5 consecutive nights",
      progress: 3,
      total: 5,
      daysLeft: 3,
      coins: 30,
    },
  ],
  Completed: [
    { id: 3, title: "Weekend Warrior", coins: 25 },
    { id: 4, title: "Early Bird", coins: 20 },
  ],
  "All Challenges": [
    {
      id: 5,
      title: "Heart Health Month",
      description: "30-day cardio challenge with personalized goals",
      coins: 100,
    },
  ],
};

export default function Challenges() {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Active");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user || !user._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/balance/${user._id}`
        );
        setBalance(response.data.balance);
      } catch (err) {
        setError("Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

  const addCoins = async () => {
    if (!user || !user._id) return;
    try {
      const res = await axios.post("http://localhost:3000/api/transactions/reward", {
        userId: user._id,
        amount: 500,
      });
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Error adding coins:", error);
    }
  };

  const redeemCoupon = async () => {
    if (!user || !user._id) return;
    if (balance < 1000) {
      alert("Not enough coins!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/api/transactions/spend", {
        userId: user._id,
        amount: 1000,
        reference: "Coupon Redeemed",
      });
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Error redeeming coupon:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const categories = [
    { name: "Active", icon: <FaWalking /> },
    { name: "Completed", icon: <FaRunning /> },
    { name: "All Challenges", icon: <FaTasks /> },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-white h-full">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Challenges</h2>
          <div className="flex gap-4 items-center">
            <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg">
              {balance} Coins
            </span>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div className="p-4 text-center">
          <h2 className="text-xl font-bold">Coin Balance: {balance}</h2>
          <button
            onClick={addCoins}
            className="px-4 py-2 bg-green-500 text-white rounded m-2"
          >
            Add 500 Coins
          </button>
          <button
            onClick={redeemCoupon}
            className="px-4 py-2 bg-red-500 text-white rounded m-2"
          >
            Redeem Coupon (1000 Coins)
          </button>
        </div>

        {challenges[selectedCategory]?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges[selectedCategory].map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 transition transform cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {challenge.title}
                  </h3>
                  {challenge.coins && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-medium border border-yellow-300">
                      {challenge.coins} Coins
                    </span>
                  )}
                </div>
                {challenge.description && (
                  <p className="text-gray-600 text-sm mt-2">
                    {challenge.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No challenges available.
          </p>
        )}
      </main>
    </div>
  );
}
