// src/constants/roleStore.js
const JWToken = "jwt_token"; // key lưu trong localStorage
const ROLE_KEY = "user_role"; // key lưu trong localStorage

export const getToken = () => {
  return localStorage.getItem(JWToken) || null;
};
export const setToken = (token) => {
  localStorage.setItem(JWToken, token);
};
export const clearToken = () => {
  localStorage.removeItem(JWToken);
};
// Lấy role hiện tại
export const getRole = () => {
  return localStorage.getItem(ROLE_KEY) || null;
};

// Set role mới
export const setRole = (role) => {
  localStorage.setItem(ROLE_KEY, role);
};

// Xóa role (nếu logout chẳng hạn)
export const clearRole = () => {
  localStorage.removeItem(ROLE_KEY);
};
