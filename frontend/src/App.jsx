import { useState } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import RewardsPage from "./Components/RewardsPage.jsx";
import ActivityPage from "./Components/ActivityPage.jsx";
import ProfilePage from "./Components/ProfilePage.jsx";
import LoginPage from "./Components/LoginPage.jsx";
import { FitnessDashboard } from "./Components/FitnessDashboard.jsx";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./Components/LandingPage.jsx";
import ChallengePage from "./Components/ChallengePage.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="transition-all duration-300 pt-16">
        <Outlet />
      </div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm bg-black/20"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

const App = () => {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<FitnessDashboard />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/challenges" element={<ChallengePage />} />
        <Route path="/my-profile" element={<ProfilePage />} />
      </Route>

      {!loading && (
        <Route
          path="*"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      )}

      {loading && <Route path="*" element={<div>Loading...</div>} />}
    </Routes>
  );
};

export default App;
