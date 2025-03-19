// todo: setting redesign
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

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deleted successfully.");
    }
  };

  const dummyUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    given_name: "John",
    family_name: "Doe",
    profilePicture: "https://via.placeholder.com/150",
    sub: "1234567890",
  };

  const displayUser = user && Object.keys(user).length > 0 ? user : dummyUser;
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <div className="container mx-auto p-6">
        {selectedCategory === "Profile" && (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 p-4 text-center">
              <img
                src={displayUser.profilePicture}
                alt="Profile"
                className="h-24 w-24 rounded-full mx-auto border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-center mb-6">
                {displayUser.name}
              </h1>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{displayUser.email}</p>
                </div>
                {displayUser.given_name && (
                  <div className="border-b pb-2">
                    <p className="text-gray-500 text-sm">First Name</p>
                    <p className="font-medium">{displayUser.given_name}</p>
                  </div>
                )}
                {displayUser.family_name && (
                  <div className="border-b pb-2">
                    <p className="text-gray-500 text-sm">Last Name</p>
                    <p className="font-medium">{displayUser.family_name}</p>
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
                <span className="ml-3 text-gray-700">Enable Notifications</span>
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
  );
};

export default MyProfile;
