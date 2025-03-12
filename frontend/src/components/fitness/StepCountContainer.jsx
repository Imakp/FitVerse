import React, { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import StepCountGraph from "./StepCountGraph";
import { processStepData } from "../../utils/fitnessDataUtils";
import { STEP_COUNT_CONFIG } from "../../constants/fitnessMetrics";

const StepCountContainer = ({ googleFit }) => {
  const [stepData, setStepData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStepData = async () => {
    try {
      setLoading(true);
      const response = await googleFit.getWeeklySteps();
      const processedData = processStepData(response);
      setStepData(processedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch step data. Please try again later.");
      console.error("Error fetching step data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStepData();
    const interval = setInterval(fetchStepData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stepData.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return <StepCountGraph data={stepData} />;
};

export default StepCountContainer;
