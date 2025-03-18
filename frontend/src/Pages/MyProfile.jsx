// Pages/MyProfile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-500 p-4 text-center">
          <img
            src={user.picture}
            alt="Profile"
            className="h-24 w-24 rounded-full mx-auto border-4 border-white"
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">{user.name}</h1>

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

            <div className="border-b pb-2">
              <p className="text-gray-500 text-sm">Google ID</p>
              <p className="font-medium">{user.sub}</p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
