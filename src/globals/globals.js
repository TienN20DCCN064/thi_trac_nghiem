// src/constants/roleStore.js

const ROLE_KEY = "user_role"; // key lưu trong localStorage

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
