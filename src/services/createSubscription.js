import { API_BASE_URL } from "../config/config";
import api from "../api/interceptor";

/**Create method for adding subscription
 * @param {*} paymentId
 * @param {*} PriceId
 * @param {*} formData
 * @returns Json
 */
export const addSubscription = async (formData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/stripe-subscription`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error in add subscription:", error);
    throw error;
  }
};
