import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const fitnessService = {
  syncFitnessData: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/fitness/sync`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error syncing fitness data:", error);
      throw error;
    }
  },

  getFitnessData: async () => {
    try {
      const response = await axios.get(`${API_URL}/fitness/data`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching fitness data:", error);
      throw error;
    }
  },

  getStepsData: async () => {
    try {
      const response = await axios.get(`${API_URL}/fitness/steps`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching steps data:", error);
      throw error;
    }
  },

  getHeartRateData: async () => {
    try {
      const response = await axios.get(`${API_URL}/fitness/heart-rate`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching heart rate data:", error);
      throw error;
    }
  },

  getSleepData: async () => {
    try {
      const response = await axios.get(`${API_URL}/fitness/sleep`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sleep data:", error);
      throw error;
    }
  },
};

export default fitnessService;
