import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { FaUser, FaCog, FaQuestionCircle } from "react-icons/fa";

const categories = [
  { name: "Profile", icon: <FaUser /> },
  { name: "Help", icon: <FaQuestionCircle /> },
  { name: "Settings", icon: <FaCog /> },
];

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Profile");
  const [notifications, setNotifications] = useState(true);

  if (!user) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deleted successfully.");
    }
  };

  const formattedDateTime = new Date(user.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="flex-1">
        <div className="container max-w-4xl mx-auto p-6">
          {selectedCategory === "Profile" && (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-neutral-700">
              <div className="flex items-center mb-4 md:mb-0">
                <img
                  src={user.profilePicture}
                  alt="User Profile"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-md"
                />
                <div className="ml-4">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {user.name}
                  </h1>
                  <p className="text-neutral-400">
                    Joined on: {formattedDateTime}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
          )}

          {selectedCategory === "Profile" && (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-500 p-4 text-center">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-24 w-24 rounded-full mx-auto border-4 border-white"
                />
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-center mb-6">
                  {user.name}
                </h1>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  {user.given_name && (
                    <div className="border-b pb-2">
                      <p className="text-gray-500 text-sm">First Name</p>
                      <p className="font-medium">{user.given_name}</p>
                    </div>
                  )}
                  {user.family_name && (
                    <div className="border-b pb-2">
                      <p className="text-gray-500 text-sm">Last Name</p>
                      <p className="font-medium">{user.family_name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "Help" && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center">Help</h2>
              <p className="text-gray-500 text-center mt-4">
                Need assistance? Contact support at support@example.com.
              </p>
            </div>
          )}

          {selectedCategory === "Settings" && (
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center">Settings</h2>
              <div className="mt-4 space-y-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <span className="relative w-10 h-5 bg-gray-300 rounded-full inline-block">
                    <span
                      className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                        notifications ? "translate-x-5" : ""
                      }`}
                    ></span>
                  </span>
                  <span className="ml-3 text-gray-700">
                    Enable Notifications
                  </span>
                </label>
                <button
                  onClick={() => navigate("/change-password")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Change Password
                </button>
                <button
                  onClick={() => navigate("/update-email")}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                >
                  Update Email
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
