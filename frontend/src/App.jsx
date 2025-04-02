import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
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

const MainLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="transition-all duration-300 pt-16">{children}</div>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm bg-black/20"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)} // Close menu on backdrop click
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated routes wrapped in MainLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FitnessDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rewards"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RewardsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ActivityPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChallengePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
