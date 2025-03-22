import React, { useState, useEffect } from "react";
import { useGoogleFit, FITNESS_API_BASE_URL } from "../hooks/useGoogleFit";
import axios from "axios";
import StepCountContainer from "./StepCountContainer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
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
    icon: "👟",
    description: "Total steps taken",
  },
  {
    name: "Active Minutes",
    dataType: "com.google.active_minutes",
    dataSourceId:
      "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
    color: "#2196F3",
    formatter: (value) => Math.round(value),
    unit: "min",
    icon: "⏱️",
    description: "Time spent being physically active",
  },
  {
    name: "Calories",
    dataType: "com.google.calories.expended",
    dataSourceId:
      "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
    color: "#FF5722",
    formatter: (value) => Math.round(value),
    unit: "kcal",
    icon: "🔥",
    description: "Total calories burned",
  },
];

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const TimeRangeSelector = ({ timeRange, setTimeRange }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
      {["week", "month", "year"].map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={`px-4 py-2 rounded-md transition-all ${
            timeRange === range
              ? "bg-white shadow-md text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          {range.charAt(0).toUpperCase() + range.slice(1)}
        </button>
      ))}
    </div>
  );
};

const MetricCard = ({ title, value, unit, icon, color, description }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 flex flex-col border-t-4"
      style={{ borderColor: color }}
    >
      <div className="flex justify-between items-start">
        <span className="text-4xl">{icon}</span>
        <span className="text-sm text-gray-500 font-medium uppercase">
          {title}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{value}</span>
          <span className="ml-1 text-lg text-gray-500">{unit}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  );
};

const MetricChart = ({ data, metric, timeRange }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center h-64">
        <p className="text-gray-500">No data available for this time period</p>
      </div>
    );
  }

  // Create an interval appropriate for the time range
  let interval = 1;
  if (timeRange === "month") interval = 3;
  if (timeRange === "year") interval = 30;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {metric.name} Over Time
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        {metric.name === "Steps" ? (
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={interval}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} ${metric.unit}`, metric.name]}
              labelFormatter={(label) => formatDate(label)}
            />
            <Bar
              dataKey="value"
              fill={metric.color}
              name={metric.name}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        ) : (
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={interval}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} ${metric.unit}`, metric.name]}
              labelFormatter={(label) => formatDate(label)}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={metric.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name={metric.name}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export const FitnessDashboard = () => {
  const {
    isAuthenticated,
    error,
    signIn,
    signOut,
    fetchFitnessData,
    userProfile,
    accessToken,
  } = useGoogleFit();
  const [loading, setLoading] = useState(false);
  const [metricsData, setMetricsData] = useState({});
  const [timeRange, setTimeRange] = useState("week");
  const [fetchError, setFetchError] = useState(null);

  const fetchAllMetrics = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const now = new Date();
      let startDate;

      switch (timeRange) {
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default: // week
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const results = {};
      const errors = [];

      // First verify access to Fitness API
      try {
        await axios.get(`${FITNESS_API_BASE_URL}/dataSources`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (err) {
        if (err.response?.status === 403) {
          setFetchError(
            "Please ensure you have granted access to Google Fit data. Go to your Google Account settings, remove the app's permissions, and try logging in again."
          );
          return;
        }
        throw err;
      }

      // Then fetch each metric
      for (const metric of FITNESS_METRICS) {
        try {
          const data = await fetchFitnessData(
            metric.dataType,
            metric.dataSourceId,
            startDate,
            now
          );

          if (!data?.bucket) {
            console.warn(`No data returned for ${metric.name}`);
            continue;
          }

          const processedData = data.bucket
            .map((bucket) => {
              const point = bucket.dataset?.[0]?.point?.[0];
              if (!point) return null;

              const value =
                point.value?.[0]?.intVal || point.value?.[0]?.fpVal || 0;
              return {
                date: new Date(parseInt(bucket.startTimeMillis)),
                value: metric.formatter(value),
              };
            })
            .filter(Boolean);

          if (processedData.length > 0) {
            results[metric.name] = processedData;
          }
        } catch (err) {
          console.error(`Error fetching ${metric.name}:`, err);
          errors.push(`${metric.name}: ${err.message}`);
          // Continue with other metrics even if one fails
          results[metric.name] = { bucket: [] };
        }
      }

      if (errors.length > 0) {
        setFetchError(
          "Some data couldn't be loaded. Please ensure you've granted all required permissions:\n" +
            "1. Go to Google Account Settings (https://myaccount.google.com/permissions)\n" +
            "2. Remove FitVerse app permissions\n" +
            "3. Log out and log in again to re-grant permissions"
        );
      }

      if (Object.keys(results).length === 0) {
        setFetchError(
          "No fitness data available for the selected time range. Please make sure you have data recorded in Google Fit."
        );
      } else {
        setMetricsData(results);
      }
    } catch (err) {
      console.error("Error fetching fitness data:", err);
      setFetchError(
        err.message ||
          "Failed to fetch fitness data. Please try logging in again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllMetrics();
    }
  }, [isAuthenticated, timeRange]);

  // Calculate total/average metrics for summary cards
  const calculateSummaryMetrics = () => {
    const summaries = {};

    FITNESS_METRICS.forEach((metric) => {
      const data = metricsData[metric.name];
      if (data && data.length > 0) {
        let total = 0;
        data.forEach((item) => {
          total += item.value;
        });

        if (metric.name === "Steps" || metric.name === "Calories") {
          summaries[metric.name] = total;
        } else {
          // For active minutes, show daily average
          summaries[metric.name] = Math.round(total / data.length);
        }
      } else {
        summaries[metric.name] = 0;
      }
    });

    return summaries;
  };

  const summaryMetrics = calculateSummaryMetrics();

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-600"
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
            <h3 className="text-lg font-medium text-red-800">
              Authentication Error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              {error.includes("test user") && userProfile?.email && (
                <p className="mt-2">
                  Please contact the administrator to add your email (
                  {userProfile.email}) as a test user.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Fitness Dashboard
              </h1>
              {userProfile && (
                <div className="mt-2 flex items-center text-gray-600">
                  {userProfile.imageUrl && (
                    <img
                      src={userProfile.imageUrl}
                      alt={userProfile.name}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  )}
                  <p>Welcome, {userProfile.name}</p>
                </div>
              )}
            </div>

            {/* <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Disconnect</span>
                </button>
              ) : (
                <button
                  onClick={signIn}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Connect Google Fit</span>
                </button>
              )}
            </div> */}
          </div>
        </header>

        {/* Main Content */}
        <main>
          {!isAuthenticated ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="mx-auto h-24 w-24 mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Connect to Google Fit
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Connect your Google Fit account to view your fitness metrics and
                track your progress over time.
              </p>
              <button
                onClick={signIn}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Connect with Google Fit
              </button>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Error display */}
                  {fetchError && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Attention needed
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p className="whitespace-pre-line">{fetchError}</p>
                            {fetchError.includes("permissions") && (
                              <div className="mt-3 flex flex-wrap gap-3">
                                <a
                                  href="https://myaccount.google.com/permissions"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                  Open Google Account Settings
                                </a>
                                <button
                                  onClick={signOut}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                  Sign Out and Retry
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary Cards */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {timeRange === "week"
                        ? "Weekly"
                        : timeRange === "month"
                        ? "Monthly"
                        : "Yearly"}{" "}
                      Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {FITNESS_METRICS.map((metric) => (
                        <MetricCard
                          key={metric.name}
                          title={metric.name}
                          value={summaryMetrics[metric.name] || 0}
                          unit={metric.unit}
                          icon={metric.icon}
                          color={metric.color}
                          description={
                            metric.name === "Steps" ||
                            metric.name === "Calories"
                              ? `Total ${metric.description.toLowerCase()} for this ${timeRange}`
                              : `Average ${metric.description.toLowerCase()} per day`
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Activity Charts */}
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Activity Trends
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {FITNESS_METRICS.map((metric) => (
                        <MetricChart
                          key={metric.name}
                          data={metricsData[metric.name] || []}
                          metric={metric}
                          timeRange={timeRange}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={fetchAllMetrics}
                      disabled={loading}
                      className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center space-x-2"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Refresh Data</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
