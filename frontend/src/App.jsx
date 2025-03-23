// App.jsx
import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
// import DashBoard from "./Pages/DashBoard.jsx";
import Rewards from "./Pages/Rewards.jsx";
import Activity from "./Pages/Activity.jsx";
// import Challenges from "./Pages/Challenges.jsx";
import MyProfile from "./Pages/MyProfile.jsx";
import Login from "./components/Login";
import { FitnessDashboard } from "./Components/FitnessDashboard.jsx";
import { useAuth } from "./context/AuthContext";
import Leaderboard from "./Components/Leaderboard.jsx";
import Wallet from "./Pages/Wallet.jsx";
// import FitnessChallenges from "./Pages/Challenges.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import Challenge from "./Pages/Challenge.jsx";

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
          <Route path="/" element={<Login />} />
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
          <Route path="/wallet" element={<Wallet />} />
          {/* Protected Routes */}
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                {/* <Challenges /> */}
                {/* <FitnessChallenges /> */}
                <Challenge/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <MyProfile />
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
