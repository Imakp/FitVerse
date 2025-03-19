// todo: recreate dashboard
// todo: modal connect to google fit redirects to fitness dashboard
import React from "react";
import { FaWalking, FaHeartbeat, FaBed, FaLungs } from "react-icons/fa";

const Dashboard = () => {
  const metrics = [
    {
      name: "Total Steps",
      value: "10,245",
      icon: <FaWalking size={30} className="text-blue-500" />,
    },
    {
      name: "Heart Rate",
      value: "78 bpm",
      icon: <FaHeartbeat size={30} className="text-red-500" />,
    },
    {
      name: "Sleep",
      value: "7h 30m",
      icon: <FaBed size={30} className="text-purple-500" />,
    },
    {
      name: "SpO2",
      value: "98%",
      icon: <FaLungs size={30} className="text-green-500" />,
    },
  ];

  return (
    <div className="flex bg-white flex-col items-center py-12">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold flex items-center gap-3">
          🚀 Welcome to FitVerse
        </h1>
        <p className="text-lg mt-2 text-gray-600">
          Track your fitness journey effortlessly
        </p>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-3/4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl shadow-md transform transition duration-300 hover:scale-105"
          >
            {metric.icon}
            <h3 className="text-lg font-semibold mt-3">{metric.name}</h3>
            <p className="text-xl font-bold mt-1">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
