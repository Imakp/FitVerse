import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend URL
  const BACKEND_URL = "http://localhost:3000";

  // Redirect user to backend for OAuth authentication
  const login = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Logout user by calling backend logout endpoint
  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fetch user session from backend
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/auth/user`, {
        withCredentials: true,
      });
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
