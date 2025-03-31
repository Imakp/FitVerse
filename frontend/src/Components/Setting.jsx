import React from "react";
import { Bell, Lock, Save } from "lucide-react";
import { motion } from "framer-motion";

const useSettingState = (propValue, defaultVal) => {
  const [state, setState] = React.useState(propValue ?? defaultVal);

  React.useEffect(() => {
    if (propValue !== undefined) {
      setState(propValue);
    }
  }, [propValue]);
  return [state, setState];
};

const Setting = ({
  notifications: propNotifications,
  setNotifications: propSetNotifications,
  goalUpdates: propGoalUpdates,
  setGoalUpdates: propSetGoalUpdates,
  featureUpdates: propFeatureUpdates,
  setFeatureUpdates: propSetFeatureUpdates,
  profileVisibility: propProfileVisibility,
  setProfileVisibility: propSetProfileVisibility,
  workoutVisibility: propWorkoutVisibility,
  setWorkoutVisibility: propSetWorkoutVisibility,
  shareData: propShareData,
  setShareData: propSetShareData,
  analyticsCookies: propAnalyticsCookies,
  setAnalyticsCookies: propSetAnalyticsCookies,
}) => {
  const [notifications, setNotifications] = useSettingState(
    propNotifications,
    true
  );
  const [goalUpdates, setGoalUpdates] = useSettingState(propGoalUpdates, true);
  const [featureUpdates, setFeatureUpdates] = useSettingState(
    propFeatureUpdates,
    false
  );
  const [profileVisibility, setProfileVisibility] = useSettingState(
    propProfileVisibility,
    "Everyone"
  );
  const [workoutVisibility, setWorkoutVisibility] = useSettingState(
    propWorkoutVisibility,
    "Friends Only"
  );
  const [shareData, setShareData] = useSettingState(propShareData, false);
  const [analyticsCookies, setAnalyticsCookies] = useSettingState(
    propAnalyticsCookies,
    true
  );

  const handleSaveSettings = () => {
    console.log("Saving settings:", {
      notifications,
      goalUpdates,
      featureUpdates,
      profileVisibility,
      workoutVisibility,
      shareData,
      analyticsCookies,
    });

    propSetNotifications?.(notifications);
    propSetGoalUpdates?.(goalUpdates);

    alert("Settings saved (Placeholder)");
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-3 border-b pb-2">
            <Bell className="text-blue-600" size={20} /> Notifications
          </h3>
          <SettingToggle
            label="Workout Reminders"
            value={notifications}
            onChange={setNotifications}
          />
          <SettingToggle
            label="Goal Updates & Milestones"
            value={goalUpdates}
            onChange={setGoalUpdates}
          />
          <SettingToggle
            label="New Feature Announcements"
            value={featureUpdates}
            onChange={setFeatureUpdates}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-3 border-b pb-2">
            <Lock className="text-red-600" size={20} /> Privacy
          </h3>
          <SettingSelect
            label="Profile Visibility"
            value={profileVisibility}
            onChange={setProfileVisibility}
            options={["Everyone", "Friends Only", "Only Me"]}
          />
          <SettingSelect
            label="Workout Visibility"
            value={workoutVisibility}
            onChange={setWorkoutVisibility}
            options={["Everyone", "Friends Only", "Only Me"]}
          />
          <SettingToggle
            label="Share Anonymized Data"
            value={shareData}
            onChange={setShareData}
          />
          <SettingToggle
            label="Allow Analytics Cookies"
            value={analyticsCookies}
            onChange={setAnalyticsCookies}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition-colors shadow text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleSaveSettings}
      >
        <Save size={18} /> Save Settings
      </motion.button>
    </div>
  );
};

const SettingToggle = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        value ? "bg-blue-600" : "bg-gray-300"
      }`}
      aria-pressed={value}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out shadow ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const SettingSelect = ({ label, value, onChange, options }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white" // Standard form styling
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
