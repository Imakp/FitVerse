import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const StepCountGraph = ({ data }) => {
  // Process the data into the format required by Recharts
  const processedData = data
    .map((entry) => {
      const startDate = new Date(parseInt(entry.startTimeMillis));
      const endDate = new Date(parseInt(entry.endTimeMillis));

      // Format date string
      const formattedDate = startDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });

      // Get the step count from the dataset
      const stepCount = entry.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;

      // Check if this is today's entry
      const isToday = new Date().toDateString() === startDate.toDateString();

      console.log("Processing bucket:", {
        date: formattedDate,
        isToday,
        startTime: startDate.toLocaleString(),
        endTime: endDate.toLocaleString(),
        steps: stepCount,
      });

      return {
        date: formattedDate + (isToday ? " (Today)" : ""),
        steps: stepCount,
        timestamp: startDate.getTime(),
        isToday,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp); // Sort by date

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
    }
    return null;
  };

  // Calculate some statistics
  const totalSteps = processedData.reduce((sum, day) => sum + day.steps, 0);
  const avgSteps = Math.round(totalSteps / processedData.length);
  const maxSteps = Math.max(...processedData.map((day) => day.steps));

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Daily Step Count</h2>
        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Average Steps</p>
            <p className="font-bold text-lg">{avgSteps.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Total Steps</p>
            <p className="font-bold text-lg">{totalSteps.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Best Day</p>
            <p className="font-bold text-lg">{maxSteps.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData}
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
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
