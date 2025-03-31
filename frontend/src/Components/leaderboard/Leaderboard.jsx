import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <main className="flex-1 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {selectedCategory} Leaderboard
          </h2>
          <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition">
            Invite Friends
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-center">User</th>
                <th className="px-4 py-3 text-center">Fitness Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardDataMap[selectedCategory].map((user, index) => (
                <tr
                  key={user.rank}
                  className={`border-t ${
                    user.name.includes("You")
                      ? "bg-yellow-100 font-semibold"
                      : index % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white"
                  } hover:bg-gray-200 transition`}
                >
                  <td className="px-4 py-3 text-left">{user.rank}</td>
                  <td className="px-4 py-3 text-center">{user.name}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600">
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
