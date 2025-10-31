import axios from 'axios';

const API_URL = 'https://your-api-url.com'; // Replace with your actual API URL

const getUserInfoByAccountId = async (accountId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${accountId}`);
    return response.data; // Assuming the API returns user data in the response
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export default {
  getUserInfoByAccountId,
};