import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useGoogleFit } from "../hooks/useGoogleFit";
import Sidebar from "./Sidebar";
import {
  User,
  Settings as SettingsIcon,
  HelpCircle,
  Edit,
  Save,
  Unlink,
  Trash2,
  Coins,
  Loader2,
} from "lucide-react";
import Setting from "./Setting";
import Help from "./Help";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const categories = [
  { name: "Profile", icon: <User size={20} /> },
  { name: "Settings", icon: <SettingsIcon size={20} /> },
  { name: "Help", icon: <HelpCircle size={20} /> },
];

const MyProfile = () => {
  const { user, setUser, balance } = useAuth();
  const { isAuthenticated: isFitAuthenticated, signOut: signOutFit } =
    useGoogleFit();
  const [selectedCategory, setSelectedCategory] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);

    if (isEditing && user) {
      setProfileData({ name: user.name || "", email: user.email || "" });
    }
  };

  const handleSaveClick = async () => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      console.log("Profile Update Payload:", { name: profileData.name });
      toast.success("Profile updated successfully! (Frontend Only)");

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?._id) return;
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        console.log("Account Deletion Requested for user:", user._id);
        toast.warn("Account deletion feature not implemented yet.");
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDisconnectFit = async () => {
    try {
      await signOutFit();
      toast.success("Google Fit disconnected successfully.");
    } catch (error) {
      console.error("Error disconnecting Google Fit:", error);
      toast.error("Failed to disconnect Google Fit.");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
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

      <div className="flex-1 p-6 md:p-8 lg:p-10 sm:ml-60">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedCategory === "Profile" && (
            <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                My Profile
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePicture || "/default-profile.png"}
                    alt={`${profileData.name || "User"}'s Profile`}
                    className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md object-cover"
                  />
                </div>

                <div className="w-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md text-sm transition-colors duration-150 ${
                        isEditing
                          ? "bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          : "bg-gray-100 border-gray-200 text-gray-700 cursor-default"
                      }`}
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-100 border-gray-200 text-gray-500 cursor-default"
                      value={profileData.email}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coin Balance
                    </label>
                    <div className="flex items-center w-full px-3 py-2 border rounded-md bg-gray-100 border-gray-200">
                      <Coins
                        size={16}
                        className="text-yellow-500 mr-2 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {balance.toLocaleString()} Coins
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    {isEditing ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          onClick={handleSaveClick}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                          Save Changes
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                          onClick={handleEditToggle}
                          disabled={isLoading}
                        >
                          Cancel
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={handleEditToggle}
                      >
                        <Edit size={16} /> Edit Profile
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full mt-8 pt-6 border-t border-gray-200 space-y-3">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Account Actions
                </h3>
                {isFitAuthenticated && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDisconnectFit}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                  >
                    <Unlink size={16} /> Disconnect Google Fit
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 border border-red-200 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete Account
                </motion.button>
              </div>
            </div>
          )}

          {selectedCategory === "Settings" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Settings
              </h2>
              <Setting />
            </div>
          )}

          {selectedCategory === "Help" && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Help & Support
              </h2>
              <Help />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyProfile;
