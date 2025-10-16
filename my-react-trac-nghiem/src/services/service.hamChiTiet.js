import axios from 'axios';

const API_URL = 'http://your-api-url.com/api'; // Replace with your actual API URL

export const getExamRegistrationDetail = async (registrationId) => {
  try {
    const response = await axios.get(`${API_URL}/exam-registrations/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exam registration detail:", error);
    throw error;
  }
};