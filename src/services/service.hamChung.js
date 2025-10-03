import { getToken, getUserInfo } from "../globals/globals.js";  // 👈 nhớ import hàm getToken


const API_BASE = "http://localhost:4002/api";
// const API_BASE = "http://localhost:4002/api_not_token";

const hamChung = {
  async reloadWeb_test () {
    window.location.reload();
  },
  async login(username, password) {
    return login(username, password);
  },
  async registerExam(payload) {
    return registerExam(payload);
  },
  async getAll(tableName) {
    return getAll(tableName);
  },
  async getOne(tableName, id) {
    return getOne(tableName, id);
  },
  async create(tableName, data) {
    return create(tableName, data);
  },
  async update(tableName, id, data) {
    return update(tableName, id, data);
  },
  async remove(tableName, id) {
    return remove(tableName, id);
  }
};
// LOGIN
async function login(username, password) {
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
}
/** ✅ Gọi API đăng ký thi */
async function registerExam(payload) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/dang-ky-thi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null); // parse JSON, nếu fail => null

    if (!res.ok || !data?.success) {
      // ném lỗi với message backend, để UI show
      throw new Error(data?.message || `Lỗi API đăng ký thi (${res.status})`);
    }

    return data; // { success, message, id_dang_ky_thi }
  } catch (err) {
    console.error("❌ Lỗi registerExam:", err);
    throw err; // để handle ở FormAddExam
  }
}


// LẤY TOÀN BỘ (GET ALL)
async function getAll(tableName) {
  console.log("Fetching all from:", tableName);
  try {
    const token = getToken();  // 👈 lấy token từ localStorage
    console.log(getUserInfo());
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
}

// LẤY 1 ITEM THEO ID
async function getOne(tableName, id) {
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
}

// TẠO MỚI
async function create(tableName, data) {
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
}

// CẬP NHẬT
async function update(tableName, id, data) {
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
}


async function remove(tableName, id) {  // đổi tên từ delete -> remove
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/${tableName}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Không thể xoá ${tableName} id=${id}`);
    return id;
  } catch (error) {
    console.error(`Lỗi remove ${tableName}:`, error);
    throw error;
  }
}


export default hamChung;