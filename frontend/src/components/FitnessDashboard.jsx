import React, { useState, useEffect } from "react";
import { useGoogleFit, FITNESS_API_BASE_URL } from "../hooks/useGoogleFit";
import axios from "axios";
import StepCountContainer from "./StepCountContainer";

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

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        {error.includes("test user") && userProfile?.email && (
          <p className="mt-2">
            Please contact the administrator to add your email (
            {userProfile.email}) as a test user.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Fitness Dashboard
          </h1>
          {userProfile && (
            <p className="text-gray-600 mt-1">
              Welcome, {userProfile.name} ({userProfile.email})
            </p>
          )}
        </div>
        {isAuthenticated ? (
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={signIn}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Connect Google Fit
          </button>
        )}
      </div>

      <div className="mt-6">
        <StepCountContainer />
      </div>

      {fetchError && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
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
                  <div className="mt-3">
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
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
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
    </div>
  );
};
