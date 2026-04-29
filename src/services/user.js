import { API_BASE_URL } from "../config/config";
import api from "../api/interceptor";
import { APIKeyHeaders } from "../helper/request";

// method for the registertation of the user
export const signup = async (signupData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/register`, signupData, {
      headers: APIKeyHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for employee signup
export const employeeSignup = async (employeeSignupData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/add-employee`,
      employeeSignupData,
      {
        headers: APIKeyHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for verify user on login
export const verifyUser = async (verifyData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/verify-user`, verifyData, {
      headers: APIKeyHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const resendVerifyUser = async (resendVerifyData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/resend-userVerify-otp`,
      resendVerifyData,
      {
        headers: APIKeyHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

//method for user login
export const login = async (loginData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/login`, loginData);
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

//method for change password
export const forgotPassword = async (forgotData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/forgotpassword`,
      forgotData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const resetPassword = async (resetPasswordData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/reset-password`,
      resetPasswordData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for get all states
export const getAllStates = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/allstates`, {
      headers: APIKeyHeaders(),
    });
    return response.data.data.State;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for register the business
export const createBusinessRegister = async (businessRegisterData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/business-register`,
      businessRegisterData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for logout the user
export const logOut = async () => {
  try {
    const response = await api.post(`${API_BASE_URL}/user-logout`);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method to get the user details
export const getUserDetails = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/get-userDetails`);
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method to update business data
export const updateBusinessProfile = async (businessRegisterData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/update-business-detail`,
      businessRegisterData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for contacting us
export const contactUs = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/send-contact-us-email`,
      payload,
      {
        headers: APIKeyHeaders(),
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const customerAttom = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/create-customer-rental-by-attom`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for user to subscribe
export const subscribeCustomer = async (email) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/add-subscribe-user`,
      { email: email },
      {
        headers: APIKeyHeaders(),
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for two factor authentication
export const twoVerificationLogin = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/verify-login-otp`,
      payload,
      {
        headers: APIKeyHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for resend the otp
export const twoVerificationLoginResend = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/verify-login-otp-resend`,
      payload,
      {
        headers: APIKeyHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for resend otp on email
export const sendEmailVerify = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/send-login-email-otp`,
      payload,
      {
        headers: APIKeyHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for email verify
export const verifyEmailOTP = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/verify-login-otp`,
      payload,
      {
        headers: APIKeyHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const userResetPassword = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/user-resetPassword`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
