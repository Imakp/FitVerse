import React from "react";

/**
 * Custom tooltip component for the step count graph
 * @param {Object} props - Component props from Recharts
 * @returns {JSX.Element|null} Tooltip component or null if not active
 */
const StepCountTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const date = new Date(payload[0].payload.timestamp).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="bg-white p-3 border rounded shadow">
      <p className="text-sm text-gray-600">{date}</p>
      <p className="text-sm font-bold mt-1">
        {payload[0].value.toLocaleString()} steps
      </p>
      {payload[0].payload.isToday && (
        <p className="text-xs text-blue-600 mt-1">
          *Today's count (in progress)
        </p>
      )}
    </div>
  );
};

export default StepCountTooltip;
