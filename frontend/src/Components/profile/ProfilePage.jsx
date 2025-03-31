import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../layout/Sidebar";
import {
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaEdit,
  FaSave,
  FaGoogle,
  FaTrash,
} from "react-icons/fa";
import Setting from "../settings/Setting";
import Help from "../help/Help";

const categories = [
  { name: "Profile", icon: <FaUser /> },
  { name: "Settings", icon: <FaCog /> },
  { name: "Help", icon: <FaQuestionCircle /> },
];

const MyProfile = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    balance: user?.wallet?.balance || 0,
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    console.log("Profile Updated:", profileData);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="flex-1 p-6">
        {selectedCategory === "Profile" && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-gray-900">
              <FaUser className="text-blue-500" /> My Profile
            </h2>
            <div className="flex flex-col items-center gap-4">
              <img
                src={user.profilePicture || "/default-avatar.png"}
                alt={`${profileData.name || "User"}'s Profile`}
                className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md object-cover"
              />
              <div className="w-full space-y-3">
                <div>
                  <label className="block text-gray-700 font-medium">
                    Name:
                  </label>
                  <input
                    name="name"
                    className={`w-full p-2 border rounded-md ${
                      isEditing ? "bg-white border-gray-400" : "bg-gray-100"
                    }`}
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Total Coins:
                  </label>
                  <input
                    name="balance"
                    className="w-full p-2 border rounded-md bg-gray-100"
                    value={profileData.balance}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Your Email:
                  </label>
                  <input
                    name="email"
                    className="w-full p-2 border rounded-md bg-gray-200"
                    value={profileData.email}
                    disabled
                  />
                </div>
              </div>
              <div className="w-full flex flex-col space-y-2 mt-4">
                {isEditing ? (
                  <button
                    className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition shadow-md text-sm font-semibold"
                    onClick={handleSaveClick}
                  >
                    <FaSave /> Save Profile
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow-md text-sm font-semibold"
                    onClick={handleEditClick}
                  >
                    <FaEdit /> Edit Profile
                  </button>
                )}
                <button className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow-md text-sm font-semibold">
                  <FaGoogle /> Disconnect Google Fit
                </button>
                <button className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-md text-sm font-semibold">
                  <FaTrash /> Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === "Settings" && <Setting />}

        {selectedCategory === "Help" && <Help />}
      </div>
    </div>
  );
};

export default MyProfile;
