import axiosInstance from "./axiosConfig";

const BASE_URL = "/api";

export const fetchRewards = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/rewards/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return [];
  }
};

export const spendCoins = async (amount, reference) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/transactions/spend`,
      {
        amount,
        reference,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error spending coins:", error);
    return null;
  }
};
