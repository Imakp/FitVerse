import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import fitnessService from "../services/fitnessService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FITNESS_METRICS = [
  {
    name: "Steps",
    dataType: "com.google.step_count.delta",
    dataSourceId:
      "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
    color: "#4CAF50",
    formatter: (value) => Math.round(value),
    unit: "steps",
  },
  {
    name: "Active Minutes",
    dataType: "com.google.active_minutes",
    dataSourceId:
      "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
    color: "#2196F3",
    formatter: (value) => Math.round(value),
    unit: "min",
  },
  {
    name: "Calories",
    dataType: "com.google.calories.expended",
    dataSourceId:
      "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
    color: "#FF5722",
    formatter: (value) => Math.round(value),
    unit: "kcal",
  },
];

export const FitnessDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fitnessData, setFitnessData] = useState(null);

  useEffect(() => {
    fetchFitnessData();
  }, []);

  const fetchFitnessData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fitnessService.getFitnessData();
      setFitnessData(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch fitness data");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fitnessService.syncFitnessData();
      setFitnessData(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to sync fitness data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleSync}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fitness Dashboard</h1>
        <button
          onClick={handleSync}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Sync Data
        </button>
      </div>

      {fitnessData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Steps Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Steps</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fitnessData.steps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  name="Steps"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Heart Rate Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Heart Rate</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fitnessData.heartRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#EF4444"
                  name="BPM"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep Chart */}
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Sleep</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fitnessData.sleep}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#8B5CF6"
                  name="Hours"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
