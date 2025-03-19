// App.jsx
import { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import DashBoard from "./Pages/DashBoard.jsx";
import Rewards from "./Pages/Rewards.jsx";
import Activity from "./Pages/Activity.jsx";
import Challenges from "./Pages/Challenges.jsx";
import MyProfile from "./Pages/MyProfile.jsx";
import Login from "./components/Login";
import { FitnessDashboard } from "./components/FitnessDashboard";
import { useAuth } from "./context/AuthContext";
import Leaderboard from "./Components/Leaderboard.jsx";

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

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <>
              <FitnessDashboard />
              <DashBoard />
            </>
          }
        />
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
              <Challenges />
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
  );
};

export default AuthWrapper;
