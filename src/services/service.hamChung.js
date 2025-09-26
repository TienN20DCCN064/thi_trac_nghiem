import { getToken } from "../globals/globals.js";  // 👈 nhớ import hàm getToken

const API_BASE = "http://localhost:4002/api";
// const API_BASE = "http://localhost:4002/api_not_token";

const hamChung = {
  // LOGIN
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Đăng nhập thất bại");
      return await response.json();
    } catch (error) {
      console.error("Lỗi login:", error);
      throw error;
    }
  },
 // LẤY TOÀN BỘ (GET ALL)
  async getAll(tableName) {
    console.log("Fetching all from:", tableName);
    try {
      const token = getToken();  // 👈 lấy token từ localStorage
      console.log("Using token:", token);
      const response = await fetch(`${API_BASE}/${tableName}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // 👈 gắn token
        },
      });
      if (!response.ok) throw new Error(`Không lấy được dữ liệu ${tableName}`);
      return await response.json();
    } catch (error) {
      console.error(`Lỗi getAll ${tableName}:`, error);
      throw error;
    }
  },

  // LẤY 1 ITEM THEO ID
  async getOne(tableName, id) {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/${tableName}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Không tìm thấy ${tableName} id=${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Lỗi getOne ${tableName}:`, error);
      throw error;
    }
  },

  // TẠO MỚI
  async create(tableName, data) {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/${tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Không thể tạo ${tableName}`);
      return await response.json();
    } catch (error) {
      console.error(`Lỗi create ${tableName}:`, error);
      throw error;
    }
  },

  // CẬP NHẬT
  async update(tableName, id, data) {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/${tableName}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Không thể cập nhật ${tableName} id=${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Lỗi update ${tableName}:`, error);
      throw error;
    }
  },

  // XOÁ
  async delete(tableName, id) {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/${tableName}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Không thể xoá ${tableName} id=${id}`);
      return id; // trả về id để reducer xoá trong state
    } catch (error) {
      console.error(`Lỗi delete ${tableName}:`, error);
      throw error;
    }
  },
};

export default hamChung;