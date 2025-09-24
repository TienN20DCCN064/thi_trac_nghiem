
const API_BASE = "http://localhost:5000";

const hamChung = {
    async getAllDangKyThi() {
        return await getAllDangKyThi();
    },
    async getDangKyThiById(id) {
        return await getDangKyThiById(id);
    },
    async getAllChiTiet() {
        return await getAllChiTiet();
    },
    async getChiTietByDangKyId(id) {
        return await getChiTietByDangKyId(id);
    },
};

// 1. Lấy danh sách tất cả đăng ký thi
async function getAllDangKyThi() {
    try {
        const response = await fetch(`${API_BASE}/dang_ky_thi`);
        const data = await response.json();
        console.log("Danh sách đăng ký thi:", data);
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đăng ký thi:", error);
    }
}

// 2. Lấy chi tiết 1 đăng ký thi theo id
async function getDangKyThiById(id) {
    try {
        const response = await fetch(`${API_BASE}/dang_ky_thi/${id}`);
        const data = await response.json();
        console.log(`Chi tiết đăng ký thi (id=${id}):`, data);
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đăng ký thi:", error);
    }
}

// 3. Lấy danh sách tất cả chi tiết đăng ký thi
async function getAllChiTiet() {
    try {
        const response = await fetch(`${API_BASE}/chi_tiet_dang_ky_thi`);
        const data = await response.json();
        console.log("Danh sách chi tiết đăng ký thi:", data);
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chi tiết:", error);
    }
}

// 4. Lấy chi tiết theo id_dang_ky_thi (toàn bộ chương)
async function getChiTietByDangKyId(id) {
    try {
        const response = await fetch(`${API_BASE}/chi_tiet_dang_ky_thi/${id}`);
        const data = await response.json();
        console.log(`Chi tiết các chương của đăng ký thi (id=${id}):`, data);
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết theo id đăng ký:", error);
    }
}



export default hamChung;