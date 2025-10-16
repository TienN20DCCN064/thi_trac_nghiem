import axios from "axios";

const API_BASE_URL = "http://your-api-url.com/api"; // Replace with your actual API base URL

export const getAllExamRegistrations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dang_ky_thi`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching exam registrations: " + error.message);
  }
};

export const updateExamRegistration = async (id, payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/dang_ky_thi/${id}`, payload);
    return response.data;
  } catch (error) {
    throw new Error("Error updating exam registration: " + error.message);
  }
};

export const getExamRegistrationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dang_ky_thi/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching exam registration details: " + error.message);
  }
};