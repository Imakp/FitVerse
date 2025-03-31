// App.jsx
import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Components/layout/Navbar.jsx"; // Updated path
import RewardsPage from "./Components/rewards/RewardsPage.jsx"; // Updated path and name
import ActivityPage from "./Components/activity/ActivityPage.jsx"; // Updated path and name
import ProfilePage from "./Components/profile/ProfilePage.jsx"; // Updated path and name
import LoginPage from "./Components/auth/LoginPage.jsx"; // Updated path and name
import { FitnessDashboard } from "./Components/dashboard/FitnessDashboard.jsx"; // Updated path
import { useAuth } from "./context/AuthContext";
import Leaderboard from "./Components/leaderboard/Leaderboard.jsx"; // Updated path
import LandingPage from "./Components/landing/LandingPage.jsx"; // Updated path
import ChallengePage from "./Components/challenges/ChallengePage.jsx"; // Updated path and name (assuming user moved it)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthWrapper = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
  <div className="transition-all duration-300">
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route
            path="/dashboard"
            element={
              <>
                <FitnessDashboard />
                {/* <DashBoard /> */}
              </>
            }
          />
          {/* <Route path="/wallet" element={<Wallet />} /> */}
          {/* Protected Routes */}
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
