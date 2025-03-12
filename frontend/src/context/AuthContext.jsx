import { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Get user info from Google
        const { data: userInfo } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );

        setUser({
          ...userInfo,
          access_token: response.access_token,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (error) => console.error("Login Failed:", error),
  });

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    // Check if there's a stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Store user data when it changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
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
