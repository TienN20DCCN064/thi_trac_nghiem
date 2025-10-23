import { getToken, getUserInfo, getLinkCongAPI } from "../globals/globals.js";  // 👈 nhớ import hàm getToken

const API_BASE = getLinkCongAPI();
// const API_BASE = "http://localhost:4002/api_not_token";

const hamChung = {
  async reloadWeb_test() {
    window.location.reload();
  },


  async login(username, password) {
    return login(username, password);
  },
  async registerExam(payload) {
    return registerExam(payload);
  },
  async updateExam(id_dang_ky_thi, payload) {
    return updateExam(id_dang_ky_thi, payload);
  },
  async deleteExam(id_dang_ky_thi) {
    return deleteExam(id_dang_ky_thi);
  },
  // 👇 Thêm mới 3 API cho list-questions
  async createListQuestions(payload) {
    return createListQuestions(payload);
  },
  async updateListQuestions(payload) {
    return updateListQuestions(payload);
  },
  async deleteListQuestions(payload) {
    return deleteListQuestions(payload);
  },
  async getListQuestionsByDangKyThi(id_dang_ky_thi) {
    return getListQuestionsByDangKyThi(id_dang_ky_thi);
  },
  async getOneExamForSV(id_dang_ky_thi, ma_sv) {
    return getOneExamForSV(id_dang_ky_thi, ma_sv);
  },
  async submitOneExamForSV(payload) {
    return submitOneExamForSV(payload);
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
async function updateExam(id_dang_ky_thi, payload) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/dang-ky-thi/${id_dang_ky_thi}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null); // parse JSON, nếu fail => null

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || `Lỗi API cập nhật đăng ký thi (${res.status})`);
    }

    return data; // { success, message, id_dang_ky_thi }
  } catch (err) {
    console.error("❌ Lỗi updateExam:", err);
    throw err; // để handle ở RegisterExamDetailModal
  }
}
async function deleteExam(id_dang_ky_thi) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/dang-ky-thi/${id_dang_ky_thi}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || `Lỗi API xóa đăng ký thi (${res.status})`);
    }

    return data; // { success, message, id_dang_ky_thi }
  } catch (err) {
    console.error("❌ Lỗi deleteExam:", err);
    throw err;
  }
}

// Tạo danh sách câu hỏi
async function createListQuestions(payload) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/list-questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || `Lỗi API thêm câu hỏi (${res.status})`);
    }

    return data; // { success, message }
  } catch (err) {
    console.error("❌ Lỗi createListQuestions:", err);
    throw err;
  }
}

// Cập nhật danh sách câu hỏi
async function updateListQuestions(payload) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/list-questions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || `Lỗi API cập nhật câu hỏi (${res.status})`);
    }

    return data; // { success, message }
  } catch (err) {
    console.error("❌ Lỗi updateListQuestions:", err);
    throw err;
  }
}

// Xoá danh sách câu hỏi
async function deleteListQuestions(payload) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/list-questions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || `Lỗi API xoá câu hỏi (${res.status})`);
    }

    return data; // { success, message }
  } catch (err) {
    console.error("❌ Lỗi deleteListQuestions:", err);
    throw err;
  }
}

// ✅ LẤY DANH SÁCH CÂU HỎI THEO id_dang_ky_thi
async function getListQuestionsByDangKyThi(id_dang_ky_thi) {
  try {
    const token = getToken();
    const res = await fetch(
      `${API_BASE}/list-questions/by-dangkythi/${id_dang_ky_thi}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      throw new Error(
        data?.message ||
        `Lỗi API lấy danh sách câu hỏi cho id_dang_ky_thi=${id_dang_ky_thi}`
      );
    }

    return data; // { success, message, data: { id_dang_ky_thi, ma_mh, trinh_do, ... } }
  } catch (err) {
    console.error("❌ Lỗi getListQuestionsByDangKyThi:", err);
    throw err;
  }
}

// ...existing code...

// Add this function inside hamChung object
async function getOneExamForSV(id_dang_ky_thi, ma_sv) {
  try {
    const token = getToken();
    const res = await fetch(
      `${API_BASE}/get-one-exam-forSV/${id_dang_ky_thi}/${ma_sv}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok || !data?.success) {
      throw new Error(
        data?.message ||
        `Lỗi API lấy bài thi (${res.status})`
      );
    }

    return data;
  } catch (err) {
    console.error("❌ Lỗi getOneExamForSV:", err);
    throw err;
  }
}
// ✅ GỬI BÀI THI CỦA SINH VIÊN (THÊM MỚI)
async function submitOneExamForSV(payload) {
  try {
    const token = getToken();

    const res = await fetch(`${API_BASE}/submit-one-exam-forSV`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      throw new Error(
        data?.message || `Lỗi API nộp bài thi (HTTP ${res.status})`
      );
    }

    // ✅ Trả về dữ liệu chuẩn
    return {
      success: true,
      message: data.message,
      id_dang_ky_thi: data.id_dang_ky_thi,
      ma_sv: data.ma_sv,
    };
  } catch (err) {
    console.error("❌ Lỗi submitOneExamForSV:", err);
    throw err;
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
// =============================
// 🟢 TẠO MỚI (CREATE)
// =============================
async function create(tableName, data) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/${tableName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");
    const body =
      contentType && contentType.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
      return {
        success: false,
        message: body?.message || `Không thể tạo1 ${tableName}`
      };
    }

    return {
      success: true,
      message: body?.message || `Thêm ${tableName} thành công`,
      data: body,
    };
  } catch (error) {
    console.error(`❌ Lỗi create ${tableName}:`, error);
    return { success: false, message: error.message };
  }
}

// =============================
// 🟡 CẬP NHẬT (UPDATE)
// =============================
async function update(tableName, id, data) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/${tableName}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");
    const body =
      contentType && contentType.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {

      return {
        success: false,
        message: body?.message || `Không thể 1cập nhật ${tableName}`
      };
    }

    return {
      success: true,
      message: body?.message || `Cập nhật ${tableName} thành công`,
      data: body,
    };
  } catch (error) {
    console.error(`❌ Lỗi update ${tableName}:`, error);
    return { success: false, message: error.message };
  }
}

// =============================
// 🔴 XOÁ (REMOVE)
// =============================
async function remove(tableName, id) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/${tableName}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get("content-type");
    const body =
      contentType && contentType.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
      return {
        success: false,
        message: body?.message || `Không thể xoá ${tableName}`
      };
    }

    return {
      success: true,
      message: body?.message || `Xoá ${tableName} thành công`,
      id,
    };
  } catch (error) {
    console.error(`❌ Lỗi remove ${tableName}:`, error);
    return { success: false, message: error.message };
  }
}



export default hamChung;