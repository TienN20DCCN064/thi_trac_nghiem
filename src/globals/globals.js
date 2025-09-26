// src/constants/roleStore.js

const USER_KEY = "user_info"; // key lưu toàn bộ thông tin user vào localStorage

// Lấy thông tin user
export const getUserInfo = () => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

// Lưu thông tin user (bao gồm token + role + các info khác)
export const setUserInfo = (userObject) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userObject));
};

// Xóa thông tin user (logout)
export const clearUserInfo = () => {
  localStorage.removeItem(USER_KEY);
};

// Lấy token riêng
export const getToken = () => {
  const user = getUserInfo();
  return user?.token || null;
};

export const getRole = () => {
  const user = getUserInfo();
  return user?.vai_tro || null;
}