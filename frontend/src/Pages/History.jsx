import React, { useState } from "react";
import * as XLSX from "xlsx";

const History = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const allActivities = [
    {
      date: "Mar 7, 2025",
      type: "Steps",
      duration: "14,500 steps",
      coins: "+10",
      color: "bg-blue-200",
    },
    {
      date: "Mar 6, 2025",
      type: "Sleep",
      duration: "7.5 hours",
      coins: "+5",
      color: "bg-green-200",
    },
    {
      date: "Mar 6, 2025",
      type: "Steps",
      duration: "12,340 steps",
      coins: "+8",
      color: "bg-blue-200",
    },
    {
      date: "Mar 5, 2025",
      type: "Heart Rate",
      duration: "Avg. 72 BPM",
      coins: "+3",
      color: "bg-red-200",
    },
    {
      date: "Mar 5, 2025",
      type: "Steps",
      duration: "9,870 steps",
      coins: "+5",
      color: "bg-blue-200",
    },
  ];

  const filterActivitiesByDate = () => {
    if (dateRange === "Last 30 Days") return allActivities;
    if (dateRange === "First 30 Days") return allActivities.slice(0, 3);
    return allActivities.filter((activity) =>
      activity.date.includes(dateRange)
    );
  };

  const activities = filterActivitiesByDate();
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = activities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const downloadReport = () => {
    const ws = XLSX.utils.json_to_sheet(activities);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activity History");
    XLSX.writeFile(wb, "Activity_History.xlsx");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <select
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded-md"
        >
          {[
            "Last 30 Days",
            "First 30 Days",
            "January",
            "February",
            "March",
          ].map((month) => (
            <option key={month}>{month}</option>
          ))}
        </select>
        <button
          onClick={downloadReport}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Download Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Activity Type</th>
              <th className="px-6 py-3 text-left">Duration/Count</th>
              <th className="px-6 py-3 text-left">Coins Earned</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((activity, index) => (
              <tr
                key={index}
                className="border-t border-gray-300 hover:bg-gray-100"
              >
                <td className="px-6 py-3">{activity.date}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded ${activity.color}`}>
                    {activity.type}
                  </span>
                </td>
                <td className="px-6 py-3">{activity.duration}</td>
                <td className="px-6 py-3 font-semibold text-blue-600">
                  {activity.coins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-md border ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default History;
