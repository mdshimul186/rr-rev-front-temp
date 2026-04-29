import { API_BASE_URL } from "../config/config";
import api from "../api/interceptor";
import { PARTNER_ID } from "../config/constant";

// method for searching the customer
export const searchCustomer = async (searchData) => {
  try {
    // Filter out empty values from searchData
    const filteredSearchData = Object.fromEntries(
      Object.entries(searchData).filter(([value]) => value)
    );
    const response = await api.get(`${API_BASE_URL}/search-customer`, {
      params: filteredSearchData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// return business details by businessId
export const getBusinessDetails = async (businessId) => {
  try {
    const response = await api.get(`${API_BASE_URL}/business-detail/`, {
      params: {
        business_id: businessId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for adding the review of a cusomter
export const addCustomerReview = async (reviewData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/add-review`, reviewData);
    return response.data.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// method for creating the customer
export const createCustomer = async (customerData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/create-customer`,
      customerData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// return customer by businessId
export const fetchCustomers = async (businessId) => {
  try {
    const response = await api.get(`${API_BASE_URL}/business-customer-list`, {
      params: businessId,
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

// method for updating customer data
export const updateCustomer = async (updatedCustomerData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/update-pending-customer`,
      updatedCustomerData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// method for fetching customer details
export const getCustomerDetailsById = async (customerData) => {
  try {
    const response = await api.get(`${API_BASE_URL}/customer-detail`, {
      params: customerData,
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

// method for deleting the customer
export const deleteCustomerById = async (customerData) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/delete-customer`, {
      data: customerData,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting customers:", error);
    throw error;
  }
};

// method for uploading csv file
export const uploadCsvFile = async (uploadCsvData) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/upload-customer-csv`,
      uploadCsvData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// method for marketing banner
export const getMarketingBanner = async () => {
  try {
    const response = await api.get(
      `${API_BASE_URL}/partner-banner?partner_id=${PARTNER_ID}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

// method for saving the banner clicked
export const bannerLogger = async (payload) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/save-marketing-logs`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};
