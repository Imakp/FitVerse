import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const login = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      setBalance(0);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchUser = async () => {
    try {
      console.log("Fetching user from:", `${BACKEND_URL}/auth/user`);
      const { data } = await axios.get(`${BACKEND_URL}/auth/user`, {
        withCredentials: true,
      });
      console.log("User data received:", data);

      if (data && typeof data === "object") {
        setUser(data);
        setAuthError(null);
        if (data._id) {
          fetchBalance(data._id);
        }
      } else {
        console.error("Invalid user data format:", data);
        setUser(null);
        setAuthError("Invalid user data format");
      }
    } catch (error) {
      console.error(
        "Error fetching user:",
        error.response?.data || error.message || error
      );
      setUser(null);
      setBalance(0);
      setAuthError(
        error.response?.data?.message || "Failed to fetch user data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (userId) => {
    if (!userId) return;
    try {
      console.log("Fetching balance for user:", userId);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/users/balance/${userId}`
      );
      if (data.success) {
        setBalance(data.balance);
        console.log("Balance fetched successfully:", data.balance);
      } else {
        console.error("Failed to fetch balance:", data.message);
        setBalance(0);
      }
    } catch (error) {
      console.error(
        "Error fetching balance:",
        error.response?.data || error.message || error
      );
      setBalance(0);
    }
  };

  const refreshBalance = async () => {
    if (user?._id) {
      await fetchBalance(user._id);
      console.log("Balance refreshed via AuthContext");
    } else {
      console.log("Cannot refresh balance: user not available.");
      setBalance(0);
    }
  };

  // Check for authentication on initial load
  useEffect(() => {
    // Check if we're handling a redirect from auth
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get("auth_success");
    const authError = urlParams.get("auth_error");

    if (authSuccess) {
      console.log("Auth success detected in URL");
      // Clear the query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (authError) {
      console.error("Auth error detected in URL:", authError);
      setAuthError(authError);
      setLoading(false);
      // Clear the query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    fetchUser();

    const handleBalanceUpdate = (event) => {
      if (event.detail && typeof event.detail.balance === "number") {
        setBalance(event.detail.balance);
      }
    };
    window.addEventListener("balanceUpdated", handleBalanceUpdate);

    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
    };
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchBalance(user._id);
    } else {
      setBalance(0);
    }
  }, [user?._id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        balance,
        loading,
        authError,
        login,
        logout,
        setBalance,
        refreshBalance,
      }}
    >
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
