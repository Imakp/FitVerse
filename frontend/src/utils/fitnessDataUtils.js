import { formatDate, isToday } from "./dateUtils";

/**
 * Process raw fitness data into a format suitable for the graph
 * @param {Array} buckets - Array of fitness data buckets
 * @returns {Array} Processed data ready for display
 */
export const processStepData = (buckets) => {
  return buckets
    .map((entry) => {
      const startDate = new Date(parseInt(entry.startTimeMillis));
      const formattedDate = formatDate(startDate);
      const stepCount = entry.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
      const todayFlag = isToday(startDate);

      return {
        date: formattedDate + (todayFlag ? " (Today)" : ""),
        steps: stepCount,
        timestamp: startDate.getTime(),
        isToday: todayFlag,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Calculate statistics from step data
 * @param {Array} data - Processed step data
 * @returns {Object} Statistics object
 */
export const calculateStats = (data) => {
  const totalSteps = data.reduce((sum, day) => sum + day.steps, 0);
  const avgSteps = Math.round(totalSteps / data.length);
  const maxSteps = Math.max(...data.map((day) => day.steps));

  return {
    total: totalSteps,
    average: avgSteps,
    max: maxSteps,
  };
};
