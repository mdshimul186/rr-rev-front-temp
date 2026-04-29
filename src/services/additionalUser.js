import { API_BASE_URL } from "../config/config";
import api from "../api/interceptor";

// method for adding user invitation

export const addUserInvitation = async (userData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/employee-invite`,
      userData
    );

    return response.data.data;
  } catch (error) {
    console.error("Error in add subscription:", error);
    throw error;
  }
};

// return employee-list of a particular business

export const getUserList = async (userData) => {
  try {
    const response = await api.get(`${API_BASE_URL}/employee-list`, {
      params: userData,
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

// method delete the user by userId
export const deleteUserById = async (userId) => {
  try {
    const response = await api.delete(
      `${API_BASE_URL}/delete-employee/${userId}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};
