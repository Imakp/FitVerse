import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StepCountTooltip from "./StepCountTooltip.jsx"; // Updated path (added extension for consistency)
import StatsCard from "../common/StatsCard.jsx"; // Updated path (added extension for consistency)
import { calculateStats } from "../../utils/fitnessDataUtils"; // Assuming this path is correct relative to src

/**
 * Component for displaying step count data in a graph
 * @param {Object} props - Component props
 * @param {Array} props.data - Processed step count data
 * @returns {JSX.Element} Step count graph component
 */
const StepCountGraph = ({ data }) => {
  const stats = calculateStats(data);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Daily Step Count</h2>
        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
          <StatsCard label="Average Steps" value={stats.average} unit="steps" />
          <StatsCard label="Total Steps" value={stats.total} unit="steps" />
          <StatsCard label="Best Day" value={stats.max} unit="steps" />
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: "Steps",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<StepCountTooltip />} />
            <Line
              name="Steps"
              type="monotone"
              dataKey="steps"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={payload.isToday ? 6 : 4}
                    fill={payload.isToday ? "#2196F3" : "#4CAF50"}
                    stroke={payload.isToday ? "#1976D2" : "#4CAF50"}
                    strokeWidth={payload.isToday ? 2 : 1}
                  />
                );
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StepCountGraph;
