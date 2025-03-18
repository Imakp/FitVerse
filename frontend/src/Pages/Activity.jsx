import React, { useState } from "react";
import {
  FiMoon,
  FiTrendingUp,
  FiHeart,
  FiActivity,
  FiZap,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../Components/Sidebar";

const activityData = {
  Sleep: {
    Daily: [
      { time: "5PM", value: 7 },
      { time: "6PM", value: 6.5 },
      { time: "7PM", value: 7 },
      { time: "8PM", value: 7.5 },
    ],
    Weekly: [
      { time: "Mon", value: 6.5 },
      { time: "Tue", value: 7 },
      { time: "Wed", value: 6 },
      { time: "Thu", value: 7.5 },
      { time: "Fri", value: 7 },
      { time: "Sat", value: 7 },
      { time: "Sun", value: 8 },
    ],
    Monthly: [
      { time: "Week 1", value: 7 },
      { time: "Week 2", value: 7.2 },
      { time: "Week 3", value: 6.8 },
      { time: "Week 4", value: 7.5 },
    ],
  },
  Steps: {
    Daily: [
      { time: "5PM", value: 5000 },
      { time: "6PM", value: 7000 },
      { time: "7PM", value: 8000 },
      { time: "8PM", value: 6500 },
    ],
    Weekly: [
      { time: "Mon", value: 10000 },
      { time: "Tue", value: 12000 },
      { time: "Wed", value: 8000 },
      { time: "Thu", value: 11000 },
      { time: "Fri", value: 14000 },
      { time: "Sat", value: 9000 },
      { time: "Sun", value: 12000 },
    ],
    Monthly: [
      { time: "Week 1", value: 50000 },
      { time: "Week 2", value: 60000 },
      { time: "Week 3", value: 55000 },
      { time: "Week 4", value: 62000 },
    ],
  },
  "Heart Rate": {
    Daily: [
      { time: "5PM", value: 72 },
      { time: "6PM", value: 75 },
      { time: "7PM", value: 78 },
      { time: "8PM", value: 74 },
    ],
    Weekly: [
      { time: "Mon", value: 75 },
      { time: "Tue", value: 78 },
      { time: "Wed", value: 76 },
      { time: "Thu", value: 80 },
      { time: "Fri", value: 82 },
      { time: "Sat", value: 85 },
      { time: "Sun", value: 79 },
    ],
    Monthly: [
      { time: "Week 1", value: 78 },
      { time: "Week 2", value: 80 },
      { time: "Week 3", value: 76 },
      { time: "Week 4", value: 82 },
    ],
  },
  "SpO₂": {
    Daily: [
      { time: "5PM", value: 98 },
      { time: "6PM", value: 97 },
      { time: "7PM", value: 96 },
      { time: "8PM", value: 99 },
    ],
    Weekly: [
      { time: "Mon", value: 98 },
      { time: "Tue", value: 97 },
      { time: "Wed", value: 96 },
      { time: "Thu", value: 97 },
      { time: "Fri", value: 98 },
      { time: "Sat", value: 99 },
      { time: "Sun", value: 98 },
    ],
    Monthly: [
      { time: "Week 1", value: 97 },
      { time: "Week 2", value: 98 },
      { time: "Week 3", value: 97 },
      { time: "Week 4", value: 98 },
    ],
  },
  Running: {
    Daily: [
      { time: "5PM", value: 2 },
      { time: "6PM", value: 3 },
      { time: "7PM", value: 5 },
      { time: "8PM", value: 6 },
    ],
    Weekly: [
      { time: "Mon", value: 4 },
      { time: "Tue", value: 5 },
      { time: "Wed", value: 3 },
      { time: "Thu", value: 6 },
      { time: "Fri", value: 7 },
      { time: "Sat", value: 5 },
      { time: "Sun", value: 6 },
    ],
    Monthly: [
      { time: "Week 1", value: 20 },
      { time: "Week 2", value: 22 },
      { time: "Week 3", value: 18 },
      { time: "Week 4", value: 25 },
    ],
  },
};

const categories = [
  { name: "Sleep", icon: <FiMoon /> },
  { name: "Steps", icon: <FiTrendingUp /> },
  { name: "Heart Rate", icon: <FiHeart /> },
  { name: "SpO₂", icon: <FiActivity /> },
  { name: "Running", icon: <FiZap /> },
];

export default function Activity() {
  const [activeCategory, setActiveCategory] = useState("Sleep");
  const [timePeriod, setTimePeriod] = useState("Daily");

  return (
    <div className="flex flex-col md:flex-row bg-white">
      {/* Sidebar Component */}
      <Sidebar
        categories={categories}
        selectedCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="flex justify-between">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Activity Analytics
            </h2>
          </div>

          {/* Time Period Selector */}
          <div className="flex gap-4 font-semibold mb-6">
            {["Daily", "Weekly", "Monthly"].map((period) => (
              <button
                key={period}
                className={`px-4 py-2 rounded ${
                  timePeriod === period
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTimePeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-md p-6 border border-gray-200">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={activityData[activeCategory][timePeriod]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
