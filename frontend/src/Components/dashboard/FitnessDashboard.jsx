import React, { useState, useEffect } from "react";
import { useGoogleFit, FITNESS_API_BASE_URL } from "../../hooks/useGoogleFit";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  TrendingUp,
  Activity,
  Target,
  Award,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

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
    gradient: "from-green-500 to-green-600",
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
    gradient: "from-blue-500 to-blue-600",
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
    gradient: "from-orange-500 to-orange-600",
  },
];

const MetricCard = ({
  title,
  value,
  unit,
  icon,
  color,
  description,
  goal,
  progress,
}) => {
  const percentage = Math.min((value / goal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col border-t-4 relative overflow-hidden"
      style={{ borderColor: color }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-opacity-10 rounded-full transform translate-x-16 -translate-y-16"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex justify-between items-start relative z-10">
        <span className="text-4xl">{icon}</span>
        <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">
          {title}
        </span>
      </div>

      <div className="mt-4 relative z-10">
        <div className="flex items-baseline">
          <span
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${color}, ${color}80)`,
            }}
          >
            {value.toLocaleString()}
          </span>
          <span className="ml-1 text-lg text-gray-500">{unit}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{description}</p>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Daily Goal Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2 rounded-full transition-all duration-500"
              style={{ backgroundColor: color }}
            ></motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityStreak = ({ data }) => {
  if (!data || !data.Steps || data.Steps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full transform translate-x-16 -translate-y-16"></div>
        <h3 className="text-lg font-medium text-gray-800 mb-4 relative z-10">
          Activity Streak
        </h3>
        <p className="text-gray-500 relative z-10">
          No activity data available
        </p>
      </motion.div>
    );
  }

  // Calculate the current streak
  const stepsData = [...data.Steps].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from yesterday since today's data might not be complete
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (let i = stepsData.length - 1; i >= 0; i--) {
    const date = new Date(stepsData[i].date);
    date.setHours(0, 0, 0, 0);

    if (
      date.getTime() ===
      yesterday.getTime() - currentStreak * 24 * 60 * 60 * 1000
    ) {
      if (stepsData[i].value >= 1000) {
        // Only count days with at least 1000 steps
        currentStreak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full transform translate-x-16 -translate-y-16"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-medium text-gray-800">Activity Streak</h3>
        <Award className="h-6 w-6 text-yellow-500" />
      </div>

      <div className="flex items-center space-x-4 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600"
        >
          {currentStreak}
        </motion.div>
        <div className="text-gray-600">
          <p className="text-sm font-medium">Current Streak</p>
          <p className="text-xs">days with 1000+ steps</p>
        </div>
      </div>
    </motion.div>
  );
};

const WeeklyProgress = ({ data }) => {
  if (!data || !data.Steps || data.Steps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full transform translate-x-16 -translate-y-16"></div>
        <h3 className="text-lg font-medium text-gray-800 mb-4 relative z-10">
          This Week's Progress
        </h3>
        <p className="text-gray-500 relative z-10">
          No data available for this week
        </p>
      </motion.div>
    );
  }

  // Get yesterday's date as the end date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Calculate start of week (7 days before yesterday)
  const startOfWeek = new Date(yesterday);
  startOfWeek.setDate(yesterday.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyData = Object.keys(data).map((metricName) => {
    const metric = FITNESS_METRICS.find((m) => m.name === metricName);
    const weekData = data[metricName]
      .filter((item) => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= startOfWeek && itemDate <= yesterday;
      })
      .map((item) => ({
        ...item,
        name: new Date(item.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
      }));

    // Sort data by date to ensure correct order
    weekData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      name: metricName,
      data: weekData,
      color: metric?.color || "#000",
      unit: metric?.unit || "",
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full transform translate-x-16 -translate-y-16"></div>

      <h3 className="text-lg font-medium text-gray-800 mb-4 relative z-10">
        This Week's Progress
      </h3>

      <div className="space-y-6 relative z-10">
        {weeklyData.map((metric) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">{metric.name}</span>
              <span className="text-sm text-gray-500">{metric.unit}</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart
                data={metric.data}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0} // Show all ticks
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [
                    `${value} ${metric.unit}`,
                    metric.name,
                  ]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={metric.color}
                  fill={metric.color}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const AchievementCard = ({ title, progress, goal, icon, color }) => {
  const percentage = Math.min(Math.round((progress / goal) * 100), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-4 relative overflow-hidden"
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 bg-opacity-10 rounded-full transform translate-x-12 -translate-y-12"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex items-center mb-2 relative z-10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <span className="text-xl">{icon}</span>
        </div>
        <h4 className="font-medium text-gray-800">{title}</h4>
      </div>

      <div className="mt-3 relative z-10">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">{progress.toLocaleString()}</span>
          <span className="text-gray-500">{goal.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-2 rounded-full"
            style={{ backgroundColor: color }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
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

      const results = {};
      const errors = [];

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
          results[metric.name] = [];
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

  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    const summaries = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    FITNESS_METRICS.forEach((metric) => {
      const data = metricsData[metric.name];
      if (data && data.length > 0) {
        // Filter data up to yesterday
        const filteredData = data.filter((item) => {
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0);
          return itemDate < today;
        });

        if (filteredData.length > 0) {
          let total = 0;
          filteredData.forEach((item) => {
            total += item.value;
          });

          if (metric.name === "Steps" || metric.name === "Calories") {
            summaries[metric.name] = total;
          } else {
            // For active minutes, show daily average
            summaries[metric.name] = Math.round(total / filteredData.length);
          }
        } else {
          summaries[metric.name] = 0;
        }
      } else {
        summaries[metric.name] = 0;
      }
    });

    return summaries;
  };

  // Calculate yesterday's data for daily goals
  const calculateYesterdayData = () => {
    const yesterdayData = {};
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    FITNESS_METRICS.forEach((metric) => {
      const data = metricsData[metric.name];
      if (data && data.length > 0) {
        // Find all data points for yesterday
        const yesterdayMetrics = data.filter((item) => {
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0);
          return itemDate.getTime() === yesterday.getTime();
        });

        // Sum up all values for yesterday
        yesterdayData[metric.name] = yesterdayMetrics.reduce(
          (sum, item) => sum + item.value,
          0
        );
      } else {
        yesterdayData[metric.name] = 0;
      }
    });

    return yesterdayData;
  };

  const summaryMetrics = calculateSummaryMetrics();
  const yesterdayData = calculateYesterdayData();

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-lg"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-600" />
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
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-gray-900"
              >
                Fitness Dashboard
              </motion.h1>
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

            {/* <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>
              ) : (
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
              )}
            </div> */}
          </div>
        </header>

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
                  Connect your Google Fit account to view your fitness metrics
                  and track your progress over time.
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
                              <p className="whitespace-pre-line">
                                {fetchError}
                              </p>
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
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                          goal={metric.goal}
                          progress={summaryMetrics[metric.name] || 0}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Activity Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Activity Overview
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ActivityStreak data={metricsData} />
                        <WeeklyProgress data={metricsData} />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Yesterday's Goals
                      </h2>
                      <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
                        {FITNESS_METRICS.map((metric) => (
                          <AchievementCard
                            key={metric.name}
                            title={`Daily ${metric.name}`}
                            progress={yesterdayData[metric.name] || 0}
                            goal={metric.goal}
                            icon={metric.icon}
                            color={metric.color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

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

export default FitnessDashboard;
