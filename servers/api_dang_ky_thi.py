from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Cho phép tất cả origin truy cập

# ================== DỮ LIỆU GIẢ LẬP ==================
dang_ky_thi = [
    {
        "id_dang_ky_thi": 1001,
        "ma_gv": 501,
        "ma_lop": 301,
        "ma_mh": 201,
        "trinh_do": "ĐH",
        "ngay_thi": "2025-10-15T08:30:00",
        "so_cau_thi": 60,
        "thoi_gian": 45
    },
    {
        "id_dang_ky_thi": 1002,
        "ma_gv": 502,
        "ma_lop": 302,
        "ma_mh": 202,
        "trinh_do": "CĐ",
        "ngay_thi": "2025-11-05T13:00:00",
        "so_cau_thi": 40,
        "thoi_gian": 30
    },
    {
        "id_dang_ky_thi": 1003,
        "ma_gv": 503,
        "ma_lop": 303,
        "ma_mh": 203,
        "trinh_do": "VB2",
        "ngay_thi": "2025-12-20T09:00:00",
        "so_cau_thi": 75,
        "thoi_gian": 60
    }
]

chi_tiet_dang_ky_thi = [
    {"id_dang_ky_thi": 1001, "chuong": 1, "so_cau": 15},
    {"id_dang_ky_thi": 1001, "chuong": 2, "so_cau": 20},
    {"id_dang_ky_thi": 1001, "chuong": 3, "so_cau": 25},

    {"id_dang_ky_thi": 1002, "chuong": 1, "so_cau": 10},
    {"id_dang_ky_thi": 1002, "chuong": 2, "so_cau": 15},
    {"id_dang_ky_thi": 1002, "chuong": 3, "so_cau": 15},

    {"id_dang_ky_thi": 1003, "chuong": 1, "so_cau": 25},
    {"id_dang_ky_thi": 1003, "chuong": 2, "so_cau": 25},
    {"id_dang_ky_thi": 1003, "chuong": 3, "so_cau": 25}
]

# ================== API ==================

# 1. Lấy danh sách tất cả đăng ký thi
@app.route("/dang_ky_thi", methods=["GET"])
def get_all_dang_ky_thi():
    return jsonify(dang_ky_thi)

# 2. Lấy chi tiết 1 đăng ký thi theo id
@app.route("/dang_ky_thi/<int:id_dang_ky_thi>", methods=["GET"])
def get_one_dang_ky_thi(id_dang_ky_thi):
    for item in dang_ky_thi:
        if item["id_dang_ky_thi"] == id_dang_ky_thi:
            return jsonify(item)
    return jsonify({"message": "Không tìm thấy đăng ký thi"}), 404

# 3. Lấy danh sách tất cả chi tiết đăng ký thi
@app.route("/chi_tiet_dang_ky_thi", methods=["GET"])
def get_all_chi_tiet():
    return jsonify(chi_tiet_dang_ky_thi)

# 4. Lấy chi tiết theo id_dang_ky_thi (toàn bộ các chương)
@app.route("/chi_tiet_dang_ky_thi/<int:id_dang_ky_thi>", methods=["GET"])
def get_one_chi_tiet(id_dang_ky_thi):
    details = [item for item in chi_tiet_dang_ky_thi if item["id_dang_ky_thi"] == id_dang_ky_thi]
    if details:
        return jsonify(details)
    return jsonify({"message": "Không tìm thấy chi tiết đăng ký thi"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
