import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
  const { user, loading, authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authError && !loading) {
      console.error("Auth error in ProtectedRoute:", authError);
      navigate("/login", {
        state: {
          from: location,
          authError,
        },
        replace: true,
      });
    }
  }, [authError, loading, navigate, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const RedirectIfLoggedIn = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return !user ? children : null;
};

const AuthWrapper = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { loading } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="transition-all duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <LoginPage />
              </RedirectIfLoggedIn>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <FitnessDashboard />
              </ProtectedRoute>
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

          <Route path="*" element={<Navigate to="/" replace />} />
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
