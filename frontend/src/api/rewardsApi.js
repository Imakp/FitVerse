import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const fetchRewards = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/rewards/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return [];
  }
};

export const spendCoins = async (userId, amount, reference) => {
  try {
    const response = await axios.post(`${BASE_URL}/transactions/spend`, {
      userId,
      amount,
      reference,
    });
    return response.data;
  } catch (error) {
    console.error("Error spending coins:", error);
    return null;
  }
};
