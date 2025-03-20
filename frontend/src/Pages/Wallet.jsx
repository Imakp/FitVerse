import React, { useState } from "react";
//import * as XLSX from "xlsx";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Wallet = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const allActivities = [
    {
      date: "Mar 7, 2025",
      type: "Steps",
      duration: "14,500 steps",
      coins: "+10",
    },
    { date: "Mar 6, 2025", type: "Sleep", duration: "7.5 hours", coins: "+5" },
    {
      date: "Mar 6, 2025",
      type: "Steps",
      duration: "12,340 steps",
      coins: "+8",
    },
    {
      date: "Mar 5, 2025",
      type: "Heart Rate",
      duration: "Avg. 72 BPM",
      coins: "+3",
    },
    {
      date: "Mar 5, 2025",
      type: "Steps",
      duration: "9,870 steps",
      coins: "+5",
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
    const data = activities.map(({ date, type, duration, coins }) => ({
      Date: date,
      Type: type,
      Duration: duration,
      "Coins Earned": coins,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activity History");
    XLSX.writeFile(wb, "Activity_History.xlsx");
  };

  return (
    <div className="max-w-5xl mt-6 sm:p-6 mx-auto bg-white rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <select
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 border rounded-lg w-full sm:w-auto shadow-sm focus:ring-2 focus:ring-blue-500"
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
          className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Download Report
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Activity Type</th>
              <th className="px-4 py-3 text-left">Duration/Count</th>
              <th className="px-4 py-3 text-left">Coins Earned</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((activity, index) => (
              <tr
                key={index}
                className={`border-t ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-3">{activity.date}</td>
                <td className="px-4 py-3">{activity.type}</td>
                <td className="px-4 py-3">{activity.duration}</td>
                <td className="px-4 py-3 font-semibold text-blue-600">
                  {activity.coins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`p-3 rounded-lg border shadow-sm ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          <FiChevronLeft />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg border shadow-sm ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`p-3 rounded-lg border shadow-sm ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Wallet;
