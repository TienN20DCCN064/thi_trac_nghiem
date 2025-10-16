// src/constants/roleStore.js
const congAPI = 4002;
const congAPI_image = 5000;
const congAPI_gmail = 5002; // Phần tạo trận đấu
const IPv4_Address = "192.168.2.145";
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

export const getLinkCongAPI = () => {
  return "http://" + IPv4_Address + ":" + congAPI + "/api";
}
export const getLinkCongApi_notToken = () => {
  return "http://" + IPv4_Address + ":" + congAPI + "/api_not_token";
}
export const getLinkCongApi_image = () => {
  // http://
  return "http://" + IPv4_Address + ":" + congAPI_image + "/api/image";
}

export const getLinkCongApi_gmail = () => {
  return "http://" + IPv4_Address + ":" + congAPI_gmail + "/api/";
}