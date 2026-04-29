import { API_BASE_URL } from "../config/config";
import api from "../api/interceptor";
import { APIKeyHeaders } from "../helper/request";

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

// promo code api
export const getPromoData = async (couponCode) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/coupon-redeem-details`,
      couponCode
    );
    return response.data;
  } catch (error) {
    console.error("Error Stripe promo code fetching api:", error);
    return false;
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

export const getAllStripePlans = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/get-product`);
    return response.data.data.data.data;
  } catch (error) {
    console.error("Error Stripe fetching api:", error);
    throw error;
  }
};

export const upgradeSubscriptionApis = async (subscriptionJson) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/upgrade-plan`,
      subscriptionJson
    );
    return response.data.data;
  } catch (error) {
    console.error("Error stripe cancel subscription api:", error);
    throw error;
  }
};

export const getAllPlans = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/get-plan`, {
      headers: APIKeyHeaders(),
    });
    return response.data.data.planData;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const payPerClickCheckout = async (formData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/pay-for-search`, formData);
    return response.data;
  } catch (error) {
    console.error("Error in add subscription:", error);
    throw error;
  }
};

export const addUserCheckout = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/pay-for-employee`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error in add subscription:", error);
    throw error;
  }
};
