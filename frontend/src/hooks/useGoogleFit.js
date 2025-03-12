import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.nutrition.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
];

export const FITNESS_API_BASE_URL =
  "https://www.googleapis.com/fitness/v1/users/me";

export const useGoogleFit = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Initialize access token from localStorage if available
  useEffect(() => {
    const storedToken = localStorage.getItem("googleFitToken");
    const storedProfile = localStorage.getItem("userProfile");
    if (storedToken) {
      setAccessToken(storedToken);
      setIsAuthenticated(true);
    }
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  const login = useGoogleLogin({
    scope: SCOPES.join(" "),
    onSuccess: async (tokenResponse) => {
      try {
        const token = tokenResponse.access_token;

        // First verify the user's identity
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Store user info first so we can display it in error messages if needed
        setUserProfile(userInfo.data);
        localStorage.setItem("userProfile", JSON.stringify(userInfo.data));

        // Now try to access Fitness API
        try {
          await axios.get(`${FITNESS_API_BASE_URL}/dataSources`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // If we get here, access was successful
          setAccessToken(token);
          localStorage.setItem("googleFitToken", token);
          setIsAuthenticated(true);
          setError(null);
          console.log("Successfully authenticated:", userInfo.data.email);
        } catch (fitnessError) {
          // Handle Fitness API specific errors
          if (fitnessError.response?.status === 403) {
            throw new Error(
              `Access denied: The email address ${userInfo.data.email} needs to be added as a test user in the Google Cloud Console.`
            );
          }
          throw fitnessError;
        }
      } catch (err) {
        console.error("Authentication error:", err.response || err);
        handleError(err);
      }
    },
    onError: (errorResponse) => {
      console.error("Google OAuth Error:", errorResponse);
      handleError({
        ...errorResponse,
        message:
          "OAuth Error: " +
          (errorResponse.error_description ||
            errorResponse.error ||
            "Unknown error"),
      });
    },
    flow: "implicit",
    access_type: "online",
    prompt: "consent",
    state: "fitverse_test_" + Date.now(), // Add state parameter for security
    include_granted_scopes: true,
  });

  const handleError = (error) => {
    let errorMessage = "Failed to authenticate.";

    if (error.response) {
      // API error response
      if (error.response.status === 403) {
        errorMessage = userProfile?.email
          ? `Access denied for ${userProfile.email}. Please ensure:\n` +
            "1. You are added as a test user in the OAuth consent screen\n" +
            "2. The Fitness API is enabled in Google Cloud Console\n" +
            "3. All required fitness scopes are enabled in the OAuth consent screen"
          : "Access denied: Your email address needs to be added as a test user.";
      } else if (error.response.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }
    } else if (error.error === "access_denied") {
      errorMessage =
        "Access denied. Please ensure:\n" +
        "1. You are added as a test user in the OAuth consent screen\n" +
        "2. The Fitness API is enabled in Google Cloud Console\n" +
        "3. All required fitness scopes are enabled in the OAuth consent screen";
    } else if (error.error_description) {
      error.error_description;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Detailed error:", {
      error,
      userEmail: userProfile?.email,
      timestamp: new Date().toISOString(),
    });

    setError(errorMessage);
    setIsAuthenticated(false);
    localStorage.removeItem("googleFitToken");
  };

  const signIn = () => {
    setError(null);
    login();
  };

  const signOut = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem("googleFitToken");
    localStorage.removeItem("userProfile");
  };

  const fetchFitnessData = async (
    dataType,
    dataSourceId,
    timeStart,
    timeEnd
  ) => {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    try {
      // Use current time and past 7 days instead of future dates
      const endTime = new Date();
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - 7);

      const response = await axios.post(
        `${FITNESS_API_BASE_URL}/dataset:aggregate`,
        {
          aggregateBy: [
            {
              dataTypeName: dataType,
              dataSourceId: dataSourceId,
            },
          ],
          bucketByTime: { durationMillis: 86400000 }, // Daily buckets
          startTimeMillis: startTime.getTime(),
          endTimeMillis: endTime.getTime(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Data for ${dataType}:`, response.data);

      if (
        !response.data?.bucket ||
        response.data.bucket.every((b) => !b.dataset?.[0]?.point?.length)
      ) {
        console.log(
          `No data found for ${dataType}, trying without dataSourceId`
        );

        // Retry without specific dataSourceId
        const retryResponse = await axios.post(
          `${FITNESS_API_BASE_URL}/dataset:aggregate`,
          {
            aggregateBy: [
              {
                dataTypeName: dataType,
              },
            ],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: startTime.getTime(),
            endTimeMillis: endTime.getTime(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`Retry data for ${dataType}:`, retryResponse.data);
        return retryResponse.data;
      }

      return response.data;
    } catch (err) {
      console.error("Error fetching fitness data:", err.response || err);
      if (err.response?.status === 401) {
        signOut();
        throw new Error("Session expired. Please sign in again.");
      } else if (err.response?.status === 403) {
        throw new Error(
          "Access denied: Please make sure you're added as a test user."
        );
      }
      const errorMessage = err.response?.data?.error?.message || err.message;
      setError(`Failed to fetch fitness data: ${errorMessage}`);
      throw err;
    }
  };

  return {
    isAuthenticated,
    error,
    signIn,
    signOut,
    fetchFitnessData,
    userProfile,
    accessToken,
  };
};
