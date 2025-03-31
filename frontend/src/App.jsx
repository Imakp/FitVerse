// App.jsx
import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Components/layout/Navbar.jsx";
import RewardsPage from "./Components/rewards/RewardsPage.jsx";
import ActivityPage from "./Components/activity/ActivityPage.jsx";
import ProfilePage from "./Components/profile/ProfilePage.jsx";
import LoginPage from "./Components/auth/LoginPage.jsx";
import { FitnessDashboard } from "./Components/dashboard/FitnessDashboard.jsx";
import { useAuth } from "./context/AuthContext";
import Leaderboard from "./Components/leaderboard/Leaderboard.jsx";
import LandingPage from "./Components/landing/LandingPage.jsx";
import ChallengePage from "./Components/challenges/ChallengePage.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

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
          {/* Landing page is now the default route */}
          <Route path="/" element={<LandingPage />} />
          {/* Login page route */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <>
                <FitnessDashboard />
              </>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <ChallengePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm bg-black/20"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AuthWrapper;
