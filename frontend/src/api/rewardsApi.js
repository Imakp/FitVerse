import axios from "axios";

const BASE_URL = "/api";

export const fetchRewards = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/rewards/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return [];
  }
};

export const spendCoins = async (amount, reference) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/transactions/spend`,
      {
        amount,
        reference,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error spending coins:", error);
    return null;
  }
};
