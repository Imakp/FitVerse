/**
 * Format a date for display in the graph
 * @param {Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...options,
  });
};

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  return new Date().toDateString() === date.toDateString();
};

/**
 * Get the date range for the last 7 days
 * @returns {Object} Object containing start and end dates
 */
export const getLastWeekDateRange = () => {
  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(endTime.getDate() - 6); // Get 6 days back to include current day
  startTime.setHours(0, 0, 0, 0); // Start of day

  return { startTime, endTime };
};
