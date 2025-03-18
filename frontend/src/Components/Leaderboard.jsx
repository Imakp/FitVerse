import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FiGlobe, FiUsers } from "react-icons/fi";

const leaderboardDataMap = {
  Global: [
    { rank: 1, name: "Sarah Johnson", score: 9875 },
    { rank: 2, name: "Michael Chen", score: 8720 },
    { rank: 3, name: "Jessica Lee", score: 7945 },
    { rank: 4, name: "John Doe (You)", score: 5230 },
    { rank: 5, name: "Robert Davis", score: 5115 },
  ],
  Friends: [
    { rank: 1, name: "John Doe (You)", score: 5230 },
    { rank: 2, name: "Michael Chen", score: 4800 },
  ],
  "By Challenge": [
    { rank: 1, name: "Jessica Lee", score: 9500 },
    { rank: 2, name: "Sarah Johnson", score: 8900 },
  ],
  Weekly: [
    { rank: 1, name: "Michael Chen", score: 3000 },
    { rank: 2, name: "John Doe (You)", score: 2800 },
  ],
};

const categories = Object.keys(leaderboardDataMap).map((name) => ({
  name,
  icon: name === "Global" ? <FiGlobe /> : <FiUsers />,
}));

export default function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState("Global");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Sidebar Component */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {selectedCategory} Leaderboard
          </h2>
          {/* Invite Friends Button */}
          <button className="px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition">
            Invite Friends
          </button>
        </div>

        {/* Full-Width Table */}
        <div className="overflow-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 ">
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Rank
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center">
                  User
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center">
                  Fitness Score
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardDataMap[selectedCategory].map((user) => (
                <tr
                  key={user.rank}
                  className={`border border-gray-300 ${
                    user.name.includes("You")
                      ? "bg-yellow-100 font-semibold"
                      : ""
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-3 text-left">
                    {user.rank}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {user.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {user.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
