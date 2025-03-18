import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [isGoogleFitConnected, setIsGoogleFitConnected] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showManageOptions, setShowManageOptions] = useState(false);

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      alert("Account deleted successfully");
      // Perform account deletion logic
    }
  };

  const toggleManageOptions = () => {
    setShowManageOptions(!showManageOptions);
  };

  return (
    <div className="pt-5">
      <div className="profile-container">
        <h2>Profile Settings</h2>
        <div className="profile-photo">
          <div className="photo-placeholder">
            {profilePhoto ? <img src={profilePhoto} alt="Profile" /> : "JD"}
          </div>
          <input type="file" accept="image/*" onChange={handleProfilePhotoChange} hidden id="fileInput" />
          <button className="change-photo" onClick={() => document.getElementById("fileInput").click()}>Change Photo</button>
        </div>
        <div className="personal-info">
          <h3>Personal Information</h3>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="save-btn">Save</button>
        </div>
        <div className="connected-services">
          <h3>Connected Services</h3>
          <div className="google-fit">
            <span className={isGoogleFitConnected ? "connected" : "disconnected"}>
              Google Fit {isGoogleFitConnected ? "Connected" : "Disconnected"}
            </span>
            <button className="manage-btn" onClick={toggleManageOptions}>Manage</button>
            {showManageOptions && (
              <div className="manage-options">
                <button onClick={() => alert("Change Google Fit connection")}>Change</button>
                <button onClick={() => setIsGoogleFitConnected(false)}>Disconnect</button>
              </div>
            )}
          </div>
        </div>
        <button className="delete-account" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
