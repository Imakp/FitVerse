import React, { useState, useEffect } from "react";
import { useGoogleFit } from "../../hooks/useGoogleFit";
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
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  TrendingUp,
  Activity,
  Target,
  Award,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Import the same FITNESS_METRICS constant from the original file
// or redefine it here to ensure consistency
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
    goal: 10000,
  },
  {
    name: "Active Minutes",
    dataType: "com.google.active_minutes",
    dataSourceId:
      "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
    color: "#2196F3",
    formatter: (value) => Math.round(value),
    unit: "min",
    icon: "⏱",
    description: "Time spent being physically active",
    goal: 30,
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
    goal: 2500,
  },
];

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const CategoryNavbar = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: "all", name: "All Metrics", icon: <BarChart2 className="h-5 w-5" /> },
    { id: "steps", name: "Steps", icon: "👟" },
    { id: "active", name: "Active Minutes", icon: "⏱" },
    { id: "calories", name: "Calories", icon: "🔥" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-4 mb-6"
    >
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeCategory === category.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category.icon}
            <span className="font-medium">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const MetricChart = ({ data, metric, timeRange }) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">
            No data available for this time period
          </p>
        </div>
      </motion.div>
    );
  }

  let interval = 1;
  if (timeRange === "month") interval = 3;
  if (timeRange === "year") interval = 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-opacity-10 rounded-full transform translate-x-16 -translate-y-16"
        style={{ backgroundColor: metric.color }}
      ></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${metric.color}20` }}
          >
            <span className="text-xl">{metric.icon}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800">
            {metric.name} Over Time
          </h3>
        </div>
        <TrendingUp className="h-5 w-5" style={{ color: metric.color }} />
      </div>

      <div className="relative z-10">
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
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
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
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
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
    </motion.div>
  );
};

const TimeRangeSelector = ({ timeRange, setTimeRange }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
      {["week", "month", "year"].map((range) => (
        <motion.button
          key={range}
          onClick={() => setTimeRange(range)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-md transition-all ${
            timeRange === range
              ? "bg-white shadow-md text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          {range.charAt(0).toUpperCase() + range.slice(1)}
        </motion.button>
      ))}
    </div>
  );
};

const ExportData = ({ metricsData }) => {
  const handleExport = () => {
    const data = Object.entries(metricsData).map(([metric, values]) => ({
      metric,
      data: values.map((v) => ({
        date: v.date.toISOString(),
        value: v.value,
      })),
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitness-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
    >
      <Download className="h-5 w-5" />
      <span>Export Data</span>
    </motion.button>
  );
};

export const ActivityPage = () => {
  const { isAuthenticated, error, signIn, userProfile, fetchFitnessData } =
    useGoogleFit();

  const [loading, setLoading] = useState(false);
  const [metricsData, setMetricsData] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const [timeRange, setTimeRange] = useState("week");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter metrics based on active category
  const filteredMetrics =
    activeCategory === "all"
      ? FITNESS_METRICS
      : FITNESS_METRICS.filter((metric) =>
          metric.name.toLowerCase().includes(activeCategory)
        );

  const fetchAllMetrics = async () => {
    if (!isAuthenticated) return;

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
        }
      }

      if (Object.keys(results).length === 0) {
        setFetchError("No fitness data available for the selected time range.");
      } else {
        setMetricsData(results);
      }
    } catch (err) {
      console.error("Error fetching fitness data:", err);
      setFetchError(err.message || "Failed to fetch fitness data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllMetrics();
    }
  }, [isAuthenticated, timeRange]);

  // Calculate total metrics for summary cards
  const calculateTotals = () => {
    const totals = {};

    FITNESS_METRICS.forEach((metric) => {
      const data = metricsData[metric.name];
      if (data && data.length > 0) {
        let total = 0;
        data.forEach((item) => {
          total += item.value;
        });

        totals[metric.name] = total;
      } else {
        totals[metric.name] = 0;
      }
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Activity Tracking
              </h1>
              {userProfile && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 flex items-center text-gray-600"
                >
                  {userProfile.imageUrl && (
                    <img
                      src={userProfile.imageUrl}
                      alt={userProfile.name}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  )}
                  <p>Welcome, {userProfile.name}</p>
                </motion.div>
              )}
            </div>

            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 md:mt-0"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Main Content */}
        <main>
          {!isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full transform translate-x-32 -translate-y-32"></div>

              <div className="relative z-10">
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
                  Connect your Google Fit account to view your activity metrics
                  and track your progress.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                  ></motion.div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Error display */}
                  <AnimatePresence>
                    {fetchError && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Attention needed
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>{fetchError}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category Navbar */}
                  <CategoryNavbar
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                  />

                  {/* Time Range Selector */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Activity Trends
                    </h2>
                    <div className="flex items-center space-x-4">
                      <TimeRangeSelector
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                      />
                      <ExportData metricsData={metricsData} />
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode="wait">
                      {filteredMetrics.map((metric) => (
                        <motion.div
                          key={metric.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MetricChart
                            data={metricsData[metric.name] || []}
                            metric={metric}
                            timeRange={timeRange}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Combined Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full transform translate-x-16 -translate-y-16"></div>

                    <div className="relative z-10">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Combined Activity Overview
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip
                            labelFormatter={(label) => formatDate(label)}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "none",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Legend />

                          {Object.entries(metricsData).map(
                            ([metricName, data]) => {
                              const metric = FITNESS_METRICS.find(
                                (m) => m.name === metricName
                              );
                              if (!metric) return null;

                              return (
                                <Line
                                  key={metricName}
                                  yAxisId={
                                    metricName === "Steps" ? "left" : "right"
                                  }
                                  type="monotone"
                                  data={data}
                                  dataKey="value"
                                  name={`${metricName} (${metric.unit})`}
                                  stroke={metric.color}
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 6 }}
                                />
                              );
                            }
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Refresh Button */}
                  <div className="flex justify-center mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchAllMetrics}
                      disabled={loading}
                      className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span>Refresh Data</span>
                    </motion.button>
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

export default ActivityPage;
