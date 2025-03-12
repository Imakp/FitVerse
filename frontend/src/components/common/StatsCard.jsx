import React from "react";

/**
 * A reusable card component for displaying statistics
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the statistic
 * @param {number|string} props.value - Value to display
 * @param {string} [props.unit=''] - Optional unit to display after the value
 * @returns {JSX.Element} Stats card component
 */
const StatsCard = ({ label, value, unit = "" }) => {
  return (
    <div className="text-center">
      <p className="text-gray-600">{label}</p>
      <p className="font-bold text-lg">
        {typeof value === "number" ? value.toLocaleString() : value}
        {unit && ` ${unit}`}
      </p>
    </div>
  );
};

export default StatsCard;
