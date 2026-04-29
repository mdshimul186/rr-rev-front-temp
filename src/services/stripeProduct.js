import { API_BASE_URL } from "../config/config";
import api from "../api/interceptor";

// method for getting the stripe product plans
export const getAllStripePlans = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/get-product`);
    return response.data.data.data.data;
  } catch (error) {
    console.error("Error Stripe fetching api:", error);
    throw error;
  }
};

/**
 * Create method to cancel the subscription..
 *
 * @param {*} Subscription Id
 * @returns Json
 */
export const cancelSubscriptionApis = async (subscriptionJson) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/cancel-subscription`,
      subscriptionJson
    );
    return response.data.data;
  } catch (error) {
    console.error("Error stripe cancel subscription api:", error);
    throw error;
  }
};
