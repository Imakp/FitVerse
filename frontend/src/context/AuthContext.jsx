import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"; // Added useCallback
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const exchangeCodeForToken = useCallback(
    async (code) => {
      setLoading(true);
      setAuthError(null);
      try {
        const { data } = await axios.post(
          `${BACKEND_URL}/auth/google`,
          { code },
          { withCredentials: true }
        );
        setUser({
          ...data,
          picture: data.profilePicture,
        });
        if (data._id) {
          fetchBalance(data._id);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        setUser(null);
        setBalance(0);
        setAuthError(
          error.response?.data?.message ||
            "Authentication failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [BACKEND_URL]
  );

  const fetchBalance = useCallback(
    async (userId) => {
      if (!userId) return;
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/users/balance/${userId}`
        );
        if (data.success) {
          setBalance(data.balance);
        } else {
          console.error("Failed to fetch balance:", data.message);
          setBalance(0);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(0);
      }
    },
    [BACKEND_URL]
  );

  const logout = async () => {
    setLoading(true);
    setUser(null);
    setBalance(0);
    setAuthError(null);
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/auth/user`, {
        withCredentials: true,
      });
      if (data) {
        setUser({
          ...data,
          picture: data.profilePicture,
        });
        if (data._id) {
          fetchBalance(data._id);
        }
      } else {
        setUser(null);
        setBalance(0);
      }
    } catch (error) {
      console.error("Fetch user failed:", error);
      setUser(null);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  const refreshBalance = async () => {
    if (user?._id) {
      await fetchBalance(user._id);
      console.log("Balance refreshed via AuthContext");
    } else {
      console.log("Cannot refresh balance: user not available.");
      setBalance(0);
    }
  };

  useEffect(() => {
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
  }, [fetchUser]);

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
        exchangeCodeForToken,
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
