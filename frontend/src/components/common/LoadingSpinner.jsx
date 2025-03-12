import React from "react";

/**
 * A reusable loading spinner component
 * @param {Object} props - Component props
 * @param {string} [props.size='small'] - Size of the spinner ('small' or 'large')
 * @param {string} [props.color='blue'] - Color of the spinner
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({ size = "small" }) => {
  const dimensions = size === "large" ? "h-12 w-12" : "h-4 w-4";

  return (
    <div className="flex items-center justify-center">
      <svg
        className={`animate-spin -ml-1 mr-2 ${dimensions} text-white`}
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
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
