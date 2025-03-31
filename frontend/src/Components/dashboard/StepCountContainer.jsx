import React, { useState, useEffect } from "react";
import { useGoogleFit } from "../hooks/useGoogleFit";
import StepCountGraph from "./StepCountGraph";

const StepCountContainer = () => {
  const [stepData, setStepData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, fetchFitnessData } = useGoogleFit();

  const fetchStepData = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      // Calculate the date range
      const now = new Date();
      const endTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      ); // End of today
      const startTime = new Date(endTime);
      startTime.setDate(startTime.getDate() - 6); // Get 6 days back to include current day
      startTime.setHours(0, 0, 0, 0); // Start of day for start date

      console.log("Date range calculation:");
      console.log("Current time:", now.toLocaleString());
      console.log("Start time:", startTime.toLocaleString());
      console.log("End time:", endTime.toLocaleString());

      const data = await fetchFitnessData(
        "com.google.step_count.delta",
        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
        startTime,
        endTime
      );

      if (data?.bucket) {
        console.log("Received buckets:", data.bucket.length);
        data.bucket.forEach((bucket, index) => {
          const bucketStart = new Date(parseInt(bucket.startTimeMillis));
          const bucketEnd = new Date(parseInt(bucket.endTimeMillis));
          const steps =
            bucket.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
          console.log(`Bucket ${index}:`, {
            start: bucketStart.toLocaleString(),
            end: bucketEnd.toLocaleString(),
            steps: steps,
          });
        });
        setStepData(data.bucket);
      } else {
        setError("No step data available");
        console.log("No bucket data in response:", data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch step data");
      console.error("Error fetching step data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data initially and set up auto-refresh
  useEffect(() => {
    if (isAuthenticated) {
      fetchStepData();
      // Refresh every 5 minutes to catch new steps
      const intervalId = setInterval(fetchStepData, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        Please connect your Google Fit account to view step data.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Auto-refreshes every 5 minutes
        </div>
        <button
          onClick={fetchStepData}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Refreshing...
            </span>
          ) : (
            "Refresh Now"
          )}
        </button>
      </div>

      {error ? (
        <div className="text-red-500 p-4 text-center">Error: {error}</div>
      ) : !stepData ? (
        <div className="text-center p-4">No step data available.</div>
      ) : (
        <StepCountGraph data={stepData} />
      )}
    </div>
  );
};

export default StepCountContainer;
