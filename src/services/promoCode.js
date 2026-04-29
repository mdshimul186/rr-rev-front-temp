import { API_BASE_URL } from "../config/config";
import api from "../api/interceptor";

//method for applying promocode
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
