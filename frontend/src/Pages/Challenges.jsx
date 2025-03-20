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
  const { user } = useAuth();
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const getBorderColor = (category) => {
    return category === "Active"
      ? "border-l-8 border-yellow-500"
      : category === "Completed"
      ? "border-l-8 border-green-500"
      : "border-l-8 border-red-500";
  };

  return (
    <div className="flex flex-col md:flex-row  min-h-screen">
      <Sidebar
        categories={Object.keys(challenges).map((name) => ({
          name,
          icon:
            name === "Active" ? (
              <FaWalking />
            ) : name === "Completed" ? (
              <FaRunning />
            ) : (
              <FaTasks />
            ),
        }))}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Challenges</h2>
          <div className="flex gap-4 items-center">
            <span className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg shadow-lg">
              {balance} Coins
            </span>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {challenges[selectedCategory]?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges[selectedCategory].map((challenge) => (
              <div
                key={challenge.id}
                className={`bg-white p-6 rounded-xl shadow-lg border border-gray-300 transition transform cursor-pointer hover:shadow-xl ${getBorderColor(
                  selectedCategory
                )}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {challenge.title}
                  </h3>
                  {challenge.coins && (
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg text-sm font-bold">
                      {challenge.coins} Coins
                    </span>
                  )}
                </div>
                {challenge.description && (
                  <p className="text-gray-600 text-sm mt-3">
                    {challenge.description}
                  </p>
                )}
                {selectedCategory === "Active" && (
                  <button className="mt-4 w-full bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-md">
                    Redeem
                  </button>
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
