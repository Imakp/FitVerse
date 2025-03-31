import React from "react";
import { FaBell, FaLock, FaCheckCircle } from "react-icons/fa";

const Setting = ({
  notifications,
  setNotifications,
  goalUpdates,
  setGoalUpdates,
  featureUpdates,
  setFeatureUpdates,
  profileVisibility,
  setProfileVisibility,
  workoutVisibility,
  setWorkoutVisibility,
  shareData,
  setShareData,
  analyticsCookies,
  setAnalyticsCookies,
}) => {
  return (
    <div className="p-8 bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-xl max-w-5xl mx-auto border border-gray-300 flex flex-col gap-8">
      <h2 className="text-3xl font-extrabold flex items-center gap-3 text-gray-900">
        <FaCheckCircle className="text-green-500" /> Settings
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Notifications Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 mb-4">
            <FaBell className="text-blue-500" /> Notifications
          </h3>
          <div className="space-y-4">
            <SettingToggle
              label="Workout Reminders"
              value={notifications}
              onChange={setNotifications}
            />
            <SettingToggle
              label="Goal Updates"
              value={goalUpdates}
              onChange={setGoalUpdates}
            />
            <SettingToggle
              label="New Features"
              value={featureUpdates}
              onChange={setFeatureUpdates}
            />
          </div>
        </div>

        {/* Privacy Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 mb-4">
            <FaLock className="text-red-500" /> Privacy
          </h3>
          <div className="space-y-4">
            <SettingSelect
              label="Who can see your profile?"
              value={profileVisibility}
              onChange={setProfileVisibility}
              options={["Everyone", "Friends Only"]}
            />
            <SettingSelect
              label="Who can see your workouts?"
              value={workoutVisibility}
              onChange={setWorkoutVisibility}
              options={["Everyone", "Friends Only"]}
            />
            <SettingToggle
              label="Share workout data with partners"
              value={shareData}
              onChange={setShareData}
            />
            <SettingToggle
              label="Analytics Cookies"
              value={analyticsCookies}
              onChange={setAnalyticsCookies}
            />
          </div>
        </div>
      </div>

      <button className="mt-6 w-full bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-green-700 transition-all shadow-lg text-lg font-semibold">
        Save Settings
      </button>
    </div>
  );
};

const SettingToggle = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-none">
    <span className="text-gray-800 font-medium">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 shadow-md ${
        value ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow transform ${
          value ? "translate-x-7" : "translate-x-0"
        } transition-all duration-300`}
      />
    </button>
  </div>
);

const SettingSelect = ({ label, value, onChange, options }) => (
  <div className="mt-2">
    <label className="block text-sm font-medium text-gray-800 mb-2">
      {label}
    </label>
    <select
      className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300 bg-white text-gray-900"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default Setting;
