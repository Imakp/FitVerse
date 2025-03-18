import { useState } from "react";
import { FaRunning, FaWalking, FaTasks, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router";
import Sidebar from "../Components/Sidebar";

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
  const [selectedCategory, setSelectedCategory] = useState("Active");
  const categories = [
    { name: "Active", icon: <FaWalking /> },
    { name: "Completed", icon: <FaRunning /> },
    { name: "All Challenges", icon: <FaTasks /> },
  ];
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 p-4">
      {/* Sidebar Component */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Challenges</h2>
          <div className="flex gap-4 items-center">
            <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg">
              250 Coins
            </span>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {selectedCategory === "History" ? (
          <History />
        ) : challenges[selectedCategory]?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges[selectedCategory].map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 transition transform hover:scale-105"
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

                {challenge.progress !== undefined && (
                  <div className="mt-4 flex items-center gap-3"></div>
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
