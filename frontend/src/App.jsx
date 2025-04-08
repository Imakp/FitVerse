import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import RewardsPage from "./Components/RewardsPage.jsx";
import ActivityPage from "./Components/ActivityPage.jsx";
import ProfilePage from "./Components/ProfilePage.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import { FitnessDashboard } from "./Components/FitnessDashboard.jsx";
import LandingPage from "./Components/LandingPage.jsx";
import ChallengePage from "./Components/ChallengePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const AuthWrapper = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="transition-all duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<FitnessDashboard />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/challenges" element={<ChallengePage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AuthWrapper;
