import React, { useState } from "react";
import { useGoogleFit } from "../hooks/useGoogleFit";

export const GoogleFitData = () => {
  const {
    isAuthenticated,
    fitnessData,
    error,
    signIn,
    signOut,
    fetchFitnessData,
  } = useGoogleFit();
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Fetch steps data for the last week
      await fetchFitnessData("com.google.step_count.delta", weekAgo, now);
    } catch (err) {
      console.error("Error fetching fitness data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Google Fit Integration</h2>

      {!isAuthenticated ? (
        <button
          onClick={signIn}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Google Fit
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={handleFetchData}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Fetch Fitness Data"}
            </button>
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>

          {fitnessData && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Your Fitness Data</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(fitnessData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
