import express from "express";
import mysql from "mysql2";
import cors from "cors";
import jwt from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // Đọc biến môi trường từ .env

const app = express();       // tạo 1 ứng dụng express
const port = process.env.PORT || 4002;           // api chạy trên cổng

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DTB_HOST,
    port: process.env.DTB_PORT, // 👈 THÊM DÒNG NÀY
    user: process.env.DTB_USER,
    password: process.env.DTB_PASSWORD,
    database: process.env.DTB_NAME
});

// Kiểm tra kết nối
db.connect((err) => {
    if (err) {
        console.error("Không thể kết nối cơ sở dữ liệu:", err);
        return;
    }
    console.log("Kết nối cơ sở dữ liệu thành công!");
});

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token không được cung cấp" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

        req.user = user;
        next();
    });
}

// get : /api/{name_table}/{id_tbale}

const tables = {
    "tai_khoan": ["id_tai_khoan"],                       // Tài khoản
    "khoa": ["ma_khoa"],                                 // Khoa
    "lop": ["ma_lop"],                                  // Lớp
    "mon_hoc": ["ma_mh"],                                // Môn học
    "giao_vien": ["ma_gv"],                              // Giáo viên
    "sinh_vien": ["ma_sv"],                              // Sinh viên
    "cau_hoi": ["id_ch"],                                // Câu hỏi
    "chon_lua": ["id_chon_lua"],                         // Đáp án lựa chọn
    "dang_ky_thi": ["id_dang_ky_thi"],                   // Đăng ký thi
    "chi_tiet_dang_ky_thi": ["id_dang_ky_thi", "chuong_so"], // Chi tiết đăng ký thi (Composite PK)
    "thi": ["id_dang_ky_thi", "ma_sv"],                                   // Bài thi
    "chi_tiet_thi": ["id_dang_ky_thi", "ma_sv", "id_ch"],                    // Chi tiết bài thi
};
app.post("/api/dang-nhap", (req, res) => {
    const { ten_dang_nhap, mat_khau } = req.body;

    if (!ten_dang_nhap || !mat_khau) {
        return res.status(400).json({ message: "Thiếu tên đăng nhập hoặc mật khẩu" });
    }

    // Lấy tài khoản theo ten_dang_nhap
    const sql = `SELECT * FROM tai_khoan WHERE ten_dang_nhap = ? LIMIT 1`;

    db.query(sql, [ten_dang_nhap], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server", error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        const user = results[0];

        // So sánh mật khẩu nhập với mật khẩu hash trong DB
        const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        // Tạo token JWT với id_tai_khoan và vai_tro
        const token = jwt.sign(
            { id_tai_khoan: user.id_tai_khoan, vai_tro: user.vai_tro },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Trả về token và thông tin người dùng (có thể loại bỏ mat_khau để bảo mật)
        const { mat_khau: _, ...userWithoutPassword } = user;

        return res.json({
            message: "Đăng nhập thành công",
            token,
            user: userWithoutPassword
        });
    });
});

app.post("/api/lay-tai-khoan-theo-email", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Thiếu email!" });
    }

    const connection = db.promise();

    try {
        // 1️⃣ Kiểm tra email trong bảng giao_vien
        const [gvRows] = await connection.query(
            "SELECT id_tai_khoan FROM giao_vien WHERE email = ?",
            [email]
        );
        console.log("🚀 gvRows:", gvRows);

        if (gvRows.length > 0) {
            const id_tai_khoan = gvRows[0].id_tai_khoan;

            const [tk] = await connection.query(
                "SELECT * FROM tai_khoan WHERE id_tai_khoan = ?",
                [id_tai_khoan]
            );

            if (tk.length > 0) {
                return res.json({
                    success: true,
                    message: "Lấy thông tin tài khoản thành công (giao_vien)",
                    data: tk[0],
                    vai_tro: "GiaoVien",
                });
            }
        }

        // 2️⃣ Kiểm tra email trong bảng sinh_vien
        const [svRows] = await connection.query(
            "SELECT id_tai_khoan FROM sinh_vien WHERE email = ?",
            [email]
        );

        if (svRows.length > 0) {
            const id_tai_khoan = svRows[0].id_tai_khoan;

            const [tk] = await connection.query(
                "SELECT * FROM tai_khoan WHERE id_tai_khoan = ?",
                [id_tai_khoan]
            );

            if (tk.length > 0) {
                return res.json({
                    success: true,
                    message: "Lấy thông tin tài khoản thành công (sinh_vien)",
                    data: tk[0],
                    vai_tro: "SinhVien",
                });
            }
        }

        // 3️⃣ Không tìm thấy tài khoản
        return res.json({
            success: false,
            message: "Không tìm thấy tài khoản tương ứng với email này!",
        });

    } catch (error) {
        console.error("❌ Lỗi khi lấy tài khoản theo email:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy tài khoản theo email",
            error: error.message,
        });
    }
});

app.post("/api/doi-mat-khau", async (req, res) => {
    const { id_tai_khoan, new_password } = req.body;

    if (!id_tai_khoan || !new_password) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin id_tai_khoan hoặc mật khẩu mới!",
        });
    }

    const connection = db.promise();

    try {
        // ✅ Hash mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // ✅ Cập nhật mật khẩu mới (đã mã hóa)
        await connection.query(
            "UPDATE tai_khoan SET mat_khau = ? WHERE id_tai_khoan = ?",
            [hashedPassword, id_tai_khoan]
        );

        res.json({
            success: true,
            message: "Đổi mật khẩu thành công!",
        });
    } catch (error) {
        console.error("❌ Lỗi khi đổi mật khẩu:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi đổi mật khẩu!",
            error: error.message,
        });
    }
});
// =============== API Đăng ký thi ===============
app.post("/api/dang-ky-thi", verifyToken, async (req, res) => {
    const { ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian, chi_tiet_dang_ky_thi } = req.body;
    console.log("🚀 Payload đăng ký thi:", req.body);
    const connection = db.promise();
    try {
        await connection.beginTransaction();
        let errMsg = "";
        // Kiểm tra từng chương
        for (const { chuong_so, so_cau } of chi_tiet_dang_ky_thi) {
            const [rows] = await connection.query(
                `SELECT COUNT(*) AS total FROM cau_hoi WHERE ma_mh = ? AND trinh_do = ? AND chuong_so = ?`,
                [ma_mh, trinh_do, chuong_so]
            );
            const soCauTrongDB = rows[0].total;
            if (soCauTrongDB < so_cau) {
                errMsg += `Chương ${chuong_so} thiếu ${so_cau - soCauTrongDB} câu. `;
            }
        }

        if (errMsg) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: errMsg });
        }
        const now = new Date();
        const [result] = await connection.query(
            `INSERT INTO dang_ky_thi 
                (ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian, now, now]
        );
        const idDangKy = result.insertId;
        for (const { chuong_so, so_cau } of chi_tiet_dang_ky_thi) {
            await connection.query(
                `INSERT INTO chi_tiet_dang_ky_thi (id_dang_ky_thi, chuong_so, so_cau) VALUES (?, ?, ?)`,
                [idDangKy, chuong_so, so_cau]
            );
        }
        await connection.commit();
        res.json({ success: true, message: "Đăng ký thi thành công", id_dang_ky_thi: idDangKy });

    } catch (e) {
        console.error("Lỗi đăng ký thi:", e);
        await connection.rollback();
        res.status(500).json({ success: false, message: "Lỗi server", error: e.message });
    }
});
app.put("/api/dang-ky-thi/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian, chi_tiet_dang_ky_thi } = req.body;
    console.log("🚀 Payload cập nhật đăng ký thi:", req.body);
    const connection = db.promise();

    try {
        await connection.beginTransaction();

        let errMsg = "";

        // Kiểm tra từng chương (validation giống POST)
        for (const { chuong_so, so_cau } of chi_tiet_dang_ky_thi) {
            const [rows] = await connection.query(
                `SELECT COUNT(*) AS total FROM cau_hoi WHERE ma_mh = ? AND trinh_do = ? AND chuong_so = ?`,
                [ma_mh, trinh_do, chuong_so]
            );
            const soCauTrongDB = rows[0].total;
            if (soCauTrongDB < so_cau) {
                errMsg += `Chương ${chuong_so} thiếu ${so_cau - soCauTrongDB} câu. `;
            }
        }

        if (errMsg) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: errMsg });
        }

        const now = new Date();
        await connection.query(
            `UPDATE dang_ky_thi 
                SET ma_gv = ?, ma_lop = ?, ma_mh = ?, trinh_do = ?, ngay_thi = ?, thoi_gian = ?, updated_at = ? 
                WHERE id_dang_ky_thi = ?`,
            [ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian, now, id]
        );


        // Xóa hết chi_tiet_dang_ky_thi cũ
        await connection.query(
            `DELETE FROM chi_tiet_dang_ky_thi WHERE id_dang_ky_thi = ?`,
            [id]
        );

        // Thêm chi_tiet_dang_ky_thi mới
        for (const { chuong_so, so_cau } of chi_tiet_dang_ky_thi) {
            await connection.query(
                `INSERT INTO chi_tiet_dang_ky_thi (id_dang_ky_thi, chuong_so, so_cau) VALUES (?, ?, ?)`,
                [id, chuong_so, so_cau]
            );
        }

        await connection.commit();
        res.json({ success: true, message: "Cập nhật đăng ký thi thành công", id_dang_ky_thi: id });
    } catch (e) {
        console.error("Lỗi cập nhật đăng ký thi:", e);
        await connection.rollback();
        res.status(500).json({ success: false, message: "Lỗi server", error: e.message });
    }
});
app.delete("/api/dang-ky-thi/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const connection = db.promise();

    try {
        await connection.beginTransaction();

        // Xóa chi tiết trước (vì có khóa ngoại)
        await connection.query(
            `DELETE FROM chi_tiet_dang_ky_thi WHERE id_dang_ky_thi = ?`,
            [id]
        );

        // Sau đó xóa đăng ký chính
        const [result] = await connection.query(
            `DELETE FROM dang_ky_thi WHERE id_dang_ky_thi = ?`,
            [id]
        );

        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đăng ký thi để xóa" });
        }

        res.json({ success: true, message: "Xóa đăng ký thi thành công", id_dang_ky_thi: id });
    } catch (e) {
        console.error("❌ Lỗi xóa đăng ký thi:", e);
        await connection.rollback();
        res.status(500).json({ success: false, message: "Lỗi server", error: e.message });
    }
});
// 🧠 API: Lấy danh sách câu hỏi random theo id_dang_ky_thi // ok
app.get("/api/list-questions/by-dangkythi/:id_dang_ky_thi", verifyToken, async (req, res) => {
    const { id_dang_ky_thi } = req.params;
    const connection = db.promise();
    try {
        // 1️⃣ Lấy thông tin đăng ký thi
        const [dkthi] = await connection.query(
            `SELECT id_dang_ky_thi, ma_mh, trinh_do 
             FROM dang_ky_thi 
             WHERE id_dang_ky_thi = ?`,
            [id_dang_ky_thi]
        );
        if (dkthi.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin đăng ký thi."
            });
        }
        const { ma_mh, trinh_do } = dkthi[0];
        // 2️⃣ Lấy cấu hình chương và số câu
        const [chiTietDangKyThi] = await connection.query(
            `SELECT chuong_so, so_cau
             FROM chi_tiet_dang_ky_thi
             WHERE id_dang_ky_thi = ?`,
            [id_dang_ky_thi]
        );
        if (chiTietDangKyThi.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Chưa có cấu hình số câu hỏi theo chương cho kỳ thi này."
            });
        }
        // 3️⃣ Random câu hỏi
        const allQuestions = [];
        for (const ct of chiTietDangKyThi) {
            const { chuong_so, so_cau } = ct;
            const limit = Number(so_cau);
            const [questions] = await connection.query(
                `SELECT id_ch, loai, noi_dung, dap_an_dung, chuong_so, ma_mh
                 FROM cau_hoi
                 WHERE ma_mh = ? AND trinh_do = ? 
                       AND chuong_so = ? AND trang_thai_xoa = 'chua_xoa'
                 ORDER BY RAND()
                 LIMIT ${limit}`,
                [ma_mh, trinh_do, chuong_so]
            );
            allQuestions.push(...questions);
        }

        // 4️⃣ Lấy danh sách lựa chọn
        const chonLuaMap = {};
        if (allQuestions.length > 0) {
            const ids = allQuestions.map(q => q.id_ch);
            const [choices] = await connection.query(
                `SELECT id_chon_lua, id_ch, noi_dung
                 FROM chon_lua
                 WHERE id_ch IN (${ids.map(() => '?').join(',')})`,
                ids
            );
            for (const c of choices) {
                if (!chonLuaMap[c.id_ch]) chonLuaMap[c.id_ch] = [];
                chonLuaMap[c.id_ch].push({
                    id_chon_lua: c.id_chon_lua,
                    noi_dung: c.noi_dung
                });
            }
        }
        // 5️⃣ Random lại câu hỏi đã lấy và thêm số thứ tự
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);  // Random lại danh sách câu hỏi
        const danhSachCauHoi = shuffledQuestions.map((q, index) => ({
            ...q,
            stt: index + 1, // Thêm số thứ tự cho câu hỏi
            chon_lua: chonLuaMap[q.id_ch] || []
        }));
        // 6️⃣ Trả kết quả (KHÔNG CÓ WARNINGS)
        res.json({
            success: true,
            message: "Lấy danh sách câu hỏi thành công!",
            data: {
                id_dang_ky_thi,
                ma_mh,
                trinh_do,
                chi_tiet_dang_ky_thi: chiTietDangKyThi,
                danh_sach_cau_hoi: danhSachCauHoi
            }
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy đề thi:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy đề thi",
            error: error.message
        });
    }
});

// Get one exam of a student including choices for "chon_1" questions  // ok
app.get("/api/get-one-exam-forSV/:id_dang_ky_thi/:ma_sv", verifyToken, async (req, res) => {
    const { id_dang_ky_thi, ma_sv } = req.params;
    const connection = db.promise();
    try {
        // 1️⃣ Lấy thông tin kỳ thi
        const [thiRows] = await connection.query(
            `SELECT id_dang_ky_thi, ma_sv, thoi_gian_bat_dau, thoi_gian_ket_thuc, diem, trang_thai
             FROM thi
             WHERE id_dang_ky_thi = ? AND ma_sv = ?`,
            [id_dang_ky_thi, ma_sv]
        );
        if (thiRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài thi"
            });
        }
        const thiInfo = thiRows[0];
        // 2️⃣ Lấy chi tiết bài làm của sinh viên — CÓ THỨ TỰ STT
        const [chiTietRows] = await connection.query(
            `SELECT 
                 ct.stt, ct.id_ch, ct.cau_tra_loi, ch.noi_dung, 
                 ch.loai, ch.dap_an_dung, ch.chuong_so, mh.ten_mh
             FROM chi_tiet_thi ct
             JOIN cau_hoi ch ON ct.id_ch = ch.id_ch
             JOIN mon_hoc mh ON ch.ma_mh = mh.ma_mh
             WHERE ct.id_dang_ky_thi = ? AND ct.ma_sv = ?
            ORDER BY ct.stt ASC`,  // 🔥 Sắp xếp theo số thứ tự tăng dần
            [id_dang_ky_thi, ma_sv]
        );
        // 3️⃣ Lấy danh sách chon_lua cho các câu hỏi loại "chon_1"
        const chonLuaMap = {};
        const chon1QuestionIds = chiTietRows
            .filter(q => q.loai === "chon_1")
            .map(q => q.id_ch);
        if (chon1QuestionIds.length > 0) {
            const [choices] = await connection.query(
                `SELECT id_chon_lua, id_ch, noi_dung
                 FROM chon_lua
                 WHERE id_ch IN (${chon1QuestionIds.map(() => "?").join(",")})`,
                chon1QuestionIds
            );
            for (const c of choices) {
                if (!chonLuaMap[c.id_ch]) chonLuaMap[c.id_ch] = [];
                chonLuaMap[c.id_ch].push({
                    id_chon_lua: c.id_chon_lua,
                    noi_dung: c.noi_dung
                });
            }
        }
        // 4️⃣ Ghép danh sách chon_lua vào từng câu hỏi
        const chi_tiet_thi = chiTietRows.map(q => ({
            ...q,
            chon_lua: chonLuaMap[q.id_ch] || []
        }));
        // 5️⃣ Trả về kết quả cuối
        res.json({
            success: true,
            message: "Lấy bài thi thành công!",
            thi: thiInfo,
            chi_tiet_thi
        });
    } catch (e) {
        console.error("❌ Lỗi lấy thông tin thi:", e);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: e.message
        });
    }
});
// ✅ API: Sinh viên nộp bài thi (THÊM MỚI)  // ok
app.post("/api/submit-one-exam-forSV", verifyToken, async (req, res) => {
    const connection = db.promise();

    try {
        const {
            id_dang_ky_thi,
            ma_sv,
            thoi_gian_bat_dau,
            thoi_gian_ket_thuc,
            diem,
            chi_tiet_thi
        } = req.body;

        // ✅ Kiểm tra dữ liệu đầu vào
        if (
            !id_dang_ky_thi ||
            !ma_sv ||
            !thoi_gian_bat_dau ||
            !thoi_gian_ket_thuc ||
            diem === undefined ||
            !Array.isArray(chi_tiet_thi)
        ) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu đầu vào!"
            });
        }

        await connection.beginTransaction();

        // 1️⃣ Thêm bài thi vào bảng `thi`
        // Nếu sinh viên này đã có bài thi thì có thể chọn UPDATE hoặc IGNORE tùy logic
        await connection.query(
            `INSERT INTO thi (id_dang_ky_thi, ma_sv, thoi_gian_bat_dau, thoi_gian_ket_thuc, diem, trang_thai)
       VALUES (?, ?, ?, ?, ?, 'Hoan_thanh')
       ON DUPLICATE KEY UPDATE 
          thoi_gian_bat_dau = VALUES(thoi_gian_bat_dau),
          thoi_gian_ket_thuc = VALUES(thoi_gian_ket_thuc),
          diem = VALUES(diem),
          trang_thai = 'Hoan_thanh'`,
            [id_dang_ky_thi, ma_sv, thoi_gian_bat_dau, thoi_gian_ket_thuc, diem]
        );

        // 2️⃣ Xóa chi tiết cũ (nếu có) để tránh trùng khóa
        await connection.query(
            `DELETE FROM chi_tiet_thi WHERE id_dang_ky_thi = ? AND ma_sv = ?`,
            [id_dang_ky_thi, ma_sv]
        );

        // 3️⃣ Thêm từng chi tiết câu hỏi vào `chi_tiet_thi`
        for (const q of chi_tiet_thi) {
            const { stt, id_ch, cau_tra_loi } = q;

            if (!stt || !id_ch) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Thiếu stt hoặc id_ch trong chi_tiet_thi!"
                });
            }

            await connection.query(
                `INSERT INTO chi_tiet_thi (id_dang_ky_thi, ma_sv, stt, id_ch, cau_tra_loi)
         VALUES (?, ?, ?, ?, ?)`,
                [id_dang_ky_thi, ma_sv, stt, id_ch, cau_tra_loi ?? ""]
            );
        }

        await connection.commit();

        res.json({
            success: true,
            message: "✅ Nộp bài thi thành công!",
            id_dang_ky_thi,
            ma_sv
        });
    } catch (error) {
        await connection.rollback();
        console.error("❌ Lỗi nộp bài thi:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi nộp bài thi!",
            error: error.message
        });
    }
});
// 🧠 Lấy danh sách bài thi theo id_dang_ky_thi (đơn giản)  // ok
app.get("/api/list-exams/by-dangkythi/:id_dang_ky_thi", verifyToken, async (req, res) => {
    const { id_dang_ky_thi } = req.params;
    const connection = db.promise();

    try {
        const [rows] = await connection.query(
            `SELECT * FROM thi WHERE id_dang_ky_thi = ?`,
            [id_dang_ky_thi]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không có bài thi nào trong kỳ thi này.",
            });
        }

        res.json({
            success: true,
            message: "Lấy danh sách bài thi thành công!",
            data: rows,
        });
    } catch (error) {
        console.error("❌ Lỗi lấy danh sách bài thi:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách bài thi.",
            error: error.message,
        });
    }
});
// API: Thêm danh sách câu hỏi và lựa chọn // ok
app.post("/api/list-questions", verifyToken, async (req, res) => {
    const { ma_mh, trinh_do, ma_gv, questions } = req.body; // thêm ma_gv từ body
    const connection = db.promise();

    try {
        if (!ma_mh || !trinh_do || !ma_gv || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: "Dữ liệu đầu vào không hợp lệ" });
        }

        if (!['CĐ', 'VB2', 'ĐH'].includes(trinh_do)) {
            return res.status(400).json({ success: false, message: "Trình độ không hợp lệ" });
        }

        await connection.beginTransaction();

        for (const question of questions) {
            const { chuong_so, noi_dung, loai, dap_an_dung, chon_lua } = question;

            if (!noi_dung || !loai || !['chon_1', 'dien_khuyet', 'yes_no'].includes(loai)) {
                await connection.rollback();
                return res.status(400).json({ success: false, message: "Thiếu hoặc sai thông tin câu hỏi" });
            }

            const safe_dap_an_dung = dap_an_dung ? dap_an_dung : null;
            const safe_chuong_so = chuong_so ? chuong_so : null;

            const [result] = await connection.execute(
                `INSERT INTO cau_hoi (trinh_do, loai, noi_dung, dap_an_dung, chuong_so, ma_mh, ma_gv)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [trinh_do, loai, noi_dung, safe_dap_an_dung, safe_chuong_so, ma_mh, ma_gv]
            );

            const id_ch = result.insertId;

            if (loai === 'chon_1' && Array.isArray(chon_lua)) {
                for (const choice of chon_lua) {
                    await connection.execute(
                        `INSERT INTO chon_lua (noi_dung, id_ch) VALUES (?, ?)`,
                        [choice.noi_dung, id_ch]
                    );
                }
            }
        }

        await connection.commit();
        res.json({ success: true, message: "Thêm câu hỏi thành công" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
});
// 🧠 API: Kiểm tra trùng danh sách câu hỏi (Excel import)  // ok
app.post("/api/check-duplicate-group-questions", verifyToken, async (req, res) => {
    const { groups } = req.body;
    const connection = db.promise();
    if (!groups || !Array.isArray(groups) || groups.length === 0) {
        return res.status(400).json({ success: false, message: "Thiếu dữ liệu nhóm câu hỏi" });
    }
    try {
        // 🧩 1. Lấy toàn bộ câu hỏi và lựa chọn trong DB
        const [allQuestions] = await connection.query(`
      SELECT id_ch, loai, noi_dung, dap_an_dung
      FROM cau_hoi
      WHERE trang_thai_xoa = 'chua_xoa'
    `);

        const [allChoices] = await connection.query(`
      SELECT id_ch, noi_dung FROM chon_lua
    `);
        // Map câu hỏi -> danh sách lựa chọn
        const choiceMap = {};
        for (const c of allChoices) {
            if (!choiceMap[c.id_ch]) choiceMap[c.id_ch] = [];
            choiceMap[c.id_ch].push(c.noi_dung.trim());
        }

        const duplicatedRows = [];

        // 🧠 2. Lặp qua từng nhóm và câu hỏi
        for (const group of groups) {
            const { questions } = group;
            if (!Array.isArray(questions)) continue;

            for (const q of questions) {
                const noi_dung = q.noi_dung?.trim();
                const dap_an_dung = q.dap_an_dung?.trim();
                const loai = q.loai?.trim();
                const so_dong = q.so_dong_trong_file_import; // ⬅️ Dòng trong file Excel
                const chon_lua_excel = (q.chon_lua || []).map(c => c.noi_dung?.trim()).filter(Boolean);

                if (!noi_dung || !dap_an_dung || !loai) continue;

                // 🔍 Tìm câu hỏi trùng noi_dung + dap_an_dung
                const matched = allQuestions.find(
                    dbQ =>
                        dbQ.noi_dung.trim() === noi_dung &&
                        dbQ.dap_an_dung?.trim() === dap_an_dung
                );
                if (matched) {
                    let isDuplicate = true;
                    // ⚙️ Nếu là chon_1 → so sánh thêm chon_lua
                    if (loai === "chon_1") {
                        const dbChoices = choiceMap[matched.id_ch] || [];
                        // dùng set để so sánh không phụ thuộc thứ tự
                        // nếu độ dài khác nhau chắc chắn không trùng
                        // nếu độ dài bằng nhau thì kiểm tra từng phần tử
                        const excelSet = new Set(chon_lua_excel);
                        const dbSet = new Set(dbChoices);

                        if (excelSet.size !== dbSet.size) {
                            isDuplicate = false;
                        } else {
                            for (const opt of excelSet) {
                                if (!dbSet.has(opt)) {
                                    isDuplicate = false;
                                    break;
                                }
                            }
                        }
                    }
                    // ✅ Nếu thực sự trùng → lưu lại dòng Excel
                    if (isDuplicate && so_dong) {
                        duplicatedRows.push(so_dong);
                    }
                }
            }
        }
        // 🧾 3. Trả kết quả
        if (duplicatedRows.length > 0) {
            const uniqueDuplicatedRows = [...new Set(duplicatedRows)].sort((a, b) => a - b);
            return res.json({
                success: false,
                message: `Phát hiện ${uniqueDuplicatedRows.length} dòng bị trùng.`,
                duplicatedRows: uniqueDuplicatedRows
            });
        } else {
            return res.json({
                success: true,
                message: "Không có câu hỏi nào bị trùng."
            });
        }

    } catch (error) {
        console.error("❌ Lỗi kiểm tra trùng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi kiểm tra trùng câu hỏi!",
            error: error.message
        });
    }
});
// api : Thêm nhiều nhóm câu hỏi    // ok
app.post("/api/multi-group-list-questions", verifyToken, async (req, res) => {
    const { groups } = req.body; // ⬅️ Dữ liệu đầu vào là mảng các nhóm
    const connection = db.promise();

    if (!groups || !Array.isArray(groups) || groups.length === 0) {
        return res.status(400).json({ success: false, message: "Thiếu dữ liệu nhóm câu hỏi" });
    }

    try {
        await connection.beginTransaction();

        for (const group of groups) {
            const { ma_mh, trinh_do, ma_gv, questions } = group;

            if (!ma_mh || !trinh_do || !ma_gv || !questions || !Array.isArray(questions)) {
                await connection.rollback();
                return res.status(400).json({ success: false, message: "Thiếu hoặc sai dữ liệu nhóm câu hỏi" });
            }

            if (!["CĐ", "VB2", "ĐH"].includes(trinh_do)) {
                await connection.rollback();
                return res.status(400).json({ success: false, message: `Trình độ không hợp lệ (${trinh_do})` });
            }

            // Lặp từng câu hỏi trong nhóm
            for (const question of questions) {
                const { chuong_so, noi_dung, loai, dap_an_dung, chon_lua } = question;

                if (!noi_dung || !loai || !["chon_1", "dien_khuyet", "yes_no"].includes(loai)) {
                    await connection.rollback();
                    return res.status(400).json({ success: false, message: "Thiếu hoặc sai thông tin câu hỏi" });
                }

                const safe_dap_an_dung = dap_an_dung ? dap_an_dung : null;
                const safe_chuong_so = chuong_so ? chuong_so : null;

                const [result] = await connection.execute(
                    `INSERT INTO cau_hoi (trinh_do, loai, noi_dung, dap_an_dung, chuong_so, ma_mh, ma_gv)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [trinh_do, loai, noi_dung, safe_dap_an_dung, safe_chuong_so, ma_mh, ma_gv]
                );

                const id_ch = result.insertId;

                if (loai === "chon_1" && Array.isArray(chon_lua)) {
                    for (const choice of chon_lua) {
                        await connection.execute(
                            `INSERT INTO chon_lua (noi_dung, id_ch) VALUES (?, ?)`,
                            [choice.noi_dung, id_ch]
                        );
                    }
                }
            }
        }

        await connection.commit();
        res.json({ success: true, message: "✅ Thêm nhiều nhóm câu hỏi thành công" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
});
// API: Xóa danh sách câu hỏi và lựa chọn theo giảng viên, môn học và trình độ   // ok
app.delete("/api/list-questions", verifyToken, async (req, res) => {
    const { ma_mh, trinh_do, ma_gv } = req.body;
    const connection = db.promise();

    try {
        if (!ma_mh || !trinh_do || !ma_gv) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu đầu vào (ma_mh, trinh_do, ma_gv)",
            });
        }

        if (!["CĐ", "VB2", "ĐH"].includes(trinh_do)) {
            return res.status(400).json({
                success: false,
                message: "Trình độ không hợp lệ",
            });
        }

        await connection.beginTransaction();

        // Lấy danh sách câu hỏi của giáo viên và môn học và chưa xóa á
        const [questions] = await connection.execute(
            `SELECT id_ch, trang_thai_xoa FROM cau_hoi 
                WHERE ma_mh = ? AND trinh_do = ? AND ma_gv = ? 
                AND trang_thai_xoa = 'chua_xoa'`,
            [ma_mh, trinh_do, ma_gv]
        );


        if (questions.length === 0) {
            await connection.rollback();
            return res.json({
                success: true,
                message: "Không có câu hỏi nào để xử lý",
            });
        }

        const ids = questions.map((q) => q.id_ch);

        // Kiểm tra xem câu hỏi có đang được sử dụng ở bảng chi tiết bài thi không
        const [usedQuestions] = await connection.execute(
            `SELECT DISTINCT id_ch 
             FROM chi_tiet_thi 
             WHERE id_ch IN (${ids.map(() => "?").join(",")})`,
            ids
        );

        const usedIds = usedQuestions.map((u) => u.id_ch);
        const unusedIds = ids.filter((id) => !usedIds.includes(id));

        // 1️⃣ Với những câu hỏi có khóa ngoại (đang được sử dụng)
        if (usedIds.length > 0) {
            // Kiểm tra xem có câu hỏi nào đã bị xóa rồi không
            const [alreadyDeleted] = await connection.execute(
                `SELECT COUNT(*) AS da_xoa_count 
                    FROM cau_hoi 
                    WHERE id_ch IN (${usedIds.map(() => "?").join(",")})
                    AND trang_thai_xoa = 'da_xoa'`,
                usedIds
            );

            if (alreadyDeleted[0].da_xoa_count > 0) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Một số câu hỏi đã bị xóa trước đó, không thể xóa lại.",
                });
            }

            // Chỉ cập nhật từ 'chua_xoa' sang 'da_xoa'
            await connection.execute(
                `UPDATE cau_hoi 
                    SET trang_thai_xoa = 'da_xoa'
                    WHERE id_ch IN (${usedIds.map(() => "?").join(",")})
                    AND trang_thai_xoa = 'chua_xoa'`,
                usedIds
            );
        }


        // 2️⃣ Với những câu hỏi không bị ràng buộc khóa ngoại → xóa vật lý
        if (unusedIds.length > 0) {
            await connection.execute(
                `DELETE FROM chon_lua WHERE id_ch IN (${unusedIds.map(() => "?").join(",")})`,
                unusedIds
            );

            await connection.execute(
                `DELETE FROM cau_hoi WHERE id_ch IN (${unusedIds.map(() => "?").join(",")})`,
                unusedIds
            );
        }

        await connection.commit();

        res.json({
            success: true,
            message: `Đã cập nhật trạng thái cho ${usedIds.length} câu hỏi và xóa ${unusedIds.length} câu hỏi.`,
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
// API: Cập nhật danh sách câu hỏi   // ok
app.put("/api/list-questions", verifyToken, async (req, res) => {
    const { ma_mh, trinh_do, ma_gv, questions } = req.body;
    const connection = db.promise();
    try {
        if (!ma_mh || !trinh_do || !ma_gv || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu đầu vào" });
        }
        await connection.beginTransaction();

        // ===== Lấy toàn bộ id_ch hiện có trong DB của GV, môn, trình độ ===== 
        const [oldQuestions] = await connection.execute(
            `SELECT id_ch FROM cau_hoi WHERE ma_mh = ? AND trinh_do = ? AND ma_gv = ?`,
            [ma_mh, trinh_do, ma_gv]
        );
        const oldIds = oldQuestions.map(q => q.id_ch);
        const newIds = questions.filter(q => q.id_ch).map(q => q.id_ch);

        // ===== Xóa câu hỏi không còn trong danh sách mới ===== 
        const idsToDelete = oldIds.filter(id => !newIds.includes(id));
        if (idsToDelete.length > 0) {
            // Xóa chon_lua trước 
            await connection.query(`DELETE FROM chon_lua WHERE id_ch IN (?)`, [idsToDelete]);
            // Xóa cau_hoi 
            await connection.query(`DELETE FROM cau_hoi WHERE id_ch IN (?)`, [idsToDelete]);
        }

        // ===== Duyệt danh sách câu hỏi từ client ===== 
        for (const q of questions) {
            const { id_ch, loai, noi_dung, dap_an_dung, chuong_so, chon_lua } = q;
            const safe_dap_an_dung = dap_an_dung || null;
            const safe_chuong_so = chuong_so || null;

            // ===== Nếu có id_ch → Cập nhật ===== 
            if (id_ch && oldIds.includes(id_ch)) {
                await connection.execute(
                    `UPDATE cau_hoi SET noi_dung=?, loai=?, dap_an_dung=?, chuong_so=? WHERE id_ch=? AND ma_gv=?`,
                    [noi_dung, loai, safe_dap_an_dung, safe_chuong_so, id_ch, ma_gv]
                );

                // --- Xử lý chon_lua nếu là loại chọn 1 --- 
                if (loai === "chon_1" && Array.isArray(chon_lua)) {
                    // Lấy các lựa chọn cũ 
                    const [oldChoices] = await connection.execute(
                        `SELECT id_chon_lua FROM chon_lua WHERE id_ch=?`,
                        [id_ch]
                    );
                    const oldChoiceIds = oldChoices.map(c => c.id_chon_lua);
                    const newChoiceIds = chon_lua.filter(c => c.id_chon_lua).map(c => c.id_chon_lua);

                    // Xóa lựa chọn không còn 
                    const clToDelete = oldChoiceIds.filter(id => !newChoiceIds.includes(id));
                    if (clToDelete.length > 0) {
                        await connection.query(`DELETE FROM chon_lua WHERE id_chon_lua IN (?)`, [clToDelete]);
                    }

                    // Thêm hoặc cập nhật 
                    for (const choice of chon_lua) {
                        if (choice.id_chon_lua && oldChoiceIds.includes(choice.id_chon_lua)) {
                            await connection.execute(
                                `UPDATE chon_lua SET noi_dung=? WHERE id_chon_lua=? AND id_ch=?`,
                                [choice.noi_dung, choice.id_chon_lua, id_ch]
                            );
                        } else {
                            await connection.execute(
                                `INSERT INTO chon_lua (noi_dung, id_ch) VALUES (?, ?)`,
                                [choice.noi_dung, id_ch]
                            );
                        }
                    }
                } else {
                    // Không phải chọn 1 → Xóa hết chon_lua cũ 
                    await connection.query(`DELETE FROM chon_lua WHERE id_ch=?`, [id_ch]);
                }
            }
            // ===== Nếu chưa có id_ch → Thêm mới ===== 
            else {
                const [result] = await connection.execute(
                    `INSERT INTO cau_hoi (trinh_do, loai, noi_dung, dap_an_dung, chuong_so, ma_mh, ma_gv) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [trinh_do, loai, noi_dung, safe_dap_an_dung, safe_chuong_so, ma_mh, ma_gv]
                );
                const newIdCh = result.insertId;

                // Nếu là loại chọn 1 → thêm các lựa chọn 
                if (loai === "chon_1" && Array.isArray(chon_lua)) {
                    for (const choice of chon_lua) {
                        await connection.execute(
                            `INSERT INTO chon_lua (noi_dung, id_ch) VALUES (?, ?)`,
                            [choice.noi_dung, newIdCh]
                        );
                    }
                }
            }
        }

        await connection.commit();
        res.json({ success: true, message: "Đồng bộ danh sách câu hỏi thành công!" });
    } catch (error) {
        await connection.rollback();
        console.error("❌ Lỗi cập nhật:", error);
        res.status(500).json({ success: false, message: `Lỗi: ${error.message}` });
    }
});
Object.entries(tables).forEach(([table, keys]) => {
    function convertToDatetimeLocal(dateInput) {
        let date = dateInput;
        if (typeof dateInput === "string" && !isNaN(Date.parse(dateInput))) {
            date = new Date(dateInput);
        }
        if (date instanceof Date && !isNaN(date)) {
            // Lấy phần YYYY-MM-DDTHH:mm
            return date.toISOString().slice(0, 16);
        }
        return dateInput;
    }// ...existing code...
    // Chuyển từ dạng datetime-local (YYYY-MM-DDTHH:mm) sang timestamp MySQL (YYYY-MM-DD HH:mm:ss)
    function convertToMySQLTimestamp(datetimeLocal) {
        if (typeof datetimeLocal === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(datetimeLocal)) {
            // Thêm :00 cho giây
            return datetimeLocal.replace("T", " ") + ":00";
        }
        // Nếu là dạng đầy đủ ISO, cắt lấy phần ngày giờ
        if (typeof datetimeLocal === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(datetimeLocal)) {
            const d = new Date(datetimeLocal);
            return d.toISOString().replace("T", " ").slice(0, 19).replace("Z", "");
        }
        return datetimeLocal;
    }
    app.get("/api", async (req, res) => {
        try {
            const apiList = [];

            for (const [table, keys] of Object.entries(tables)) {
                const columns = await getTableColumns(table);

                // Tạo bodyExample với tất cả cột (trừ auto_increment nếu muốn)
                const bodyExample = {};
                for (const col of columns) {
                    bodyExample[col] = `${col}`;
                }

                const idParams = keys.map((_, i) => `id${i + 1}`).join("/:");

                apiList.push({
                    tableName: table,
                    endpoints: {
                        getAll: { path: `/api/${table}`, httpType: "GET" },
                        getOne: { path: `/api/${table}/:${idParams}`, httpType: "GET" },
                        create: { path: `/api/${table}`, httpType: "POST", bodyExample },
                        update: { path: `/api/${table}/:${idParams}`, httpType: "PUT", bodyExample },
                        delete: { path: `/api/${table}/:${idParams}`, httpType: "DELETE" }
                    }
                });
            }


            // ================== ĐĂNG NHẬP ==================
            apiList.push({
                name: "dangNhap",
                endpoints: {
                    login: {
                        path: "/api/dang-nhap",
                        httpType: "POST",
                        bodyExample: {
                            ten_dang_nhap: "admin",
                            mat_khau: "123456"
                        },
                        description: "Đăng nhập, trả về JWT token và thông tin người dùng"
                    }
                }
            });

            // ================== TÀI KHOẢN ==================
            apiList.push({
                name: "taiKhoan",
                endpoints: {
                    layTheoEmail: {
                        path: "/api/lay-tai-khoan-theo-email",
                        httpType: "POST",
                        bodyExample: { email: "example@gmail.com" },
                        description: "Lấy thông tin tài khoản theo email của giáo viên hoặc sinh viên"
                    },
                    doiMatKhau: {
                        path: "/api/doi-mat-khau",
                        httpType: "POST",
                        bodyExample: {
                            id_tai_khoan: 1,
                            new_password: "new123456"
                        },
                        description: "Đổi mật khẩu tài khoản (hash mật khẩu mới và lưu vào DB)"
                    }
                }
            });

            // ================== ĐĂNG KÝ THI ==================
            apiList.push({
                name: "dangKyThi",
                endpoints: {
                    create: {
                        path: "/api/dang-ky-thi",
                        httpType: "POST",
                        bodyExample: {
                            ma_gv: "GV001",
                            ma_lop: "L01",
                            ma_mh: "MH001",
                            trinh_do: "ĐH",
                            ngay_thi: "2025-12-10",
                            thoi_gian: "90",
                            chi_tiet_dang_ky_thi: [
                                { chuong_so: 1, so_cau: 10 },
                                { chuong_so: 2, so_cau: 15 }
                            ]
                        },
                        description: "Giáo viên đăng ký kỳ thi mới, gồm các chương và số câu hỏi từng chương"
                    },
                    update: {
                        path: "/api/dang-ky-thi/:id",
                        httpType: "PUT",
                        bodyExample: {
                            ma_gv: "GV001",
                            ma_lop: "L01",
                            ma_mh: "MH001",
                            trinh_do: "ĐH",
                            ngay_thi: "2025-12-11",
                            thoi_gian: "100",
                            chi_tiet_dang_ky_thi: [
                                { chuong_so: 1, so_cau: 12 },
                                { chuong_so: 2, so_cau: 18 }
                            ]
                        },
                        description: "Cập nhật thông tin đăng ký thi và danh sách chương"
                    },
                    delete: {
                        path: "/api/dang-ky-thi/:id",
                        httpType: "DELETE",
                        description: "Xóa đăng ký thi và toàn bộ chi tiết đăng ký thi liên quan"
                    }
                }
            });

            // ================== CÂU HỎI ==================
            apiList.push({
                name: "cauHoi",
                endpoints: {
                    listByDangKyThi: {
                        path: "/api/list-questions/by-dangkythi/:id_dang_ky_thi",
                        httpType: "GET",
                        description: "Lấy danh sách câu hỏi random theo cấu hình trong đăng ký thi"
                    },

                    // 1️⃣ Thêm danh sách câu hỏi
                    createList: {
                        path: "/api/list-questions",
                        httpType: "POST",
                        bodyExample: {
                            ma_mh: "MH001",
                            trinh_do: "ĐH",
                            ma_gv: "GV001",
                            questions: [
                                {
                                    chuong_so: 1,
                                    noi_dung: "Câu hỏi mẫu?",
                                    loai: "chon_1",
                                    dap_an_dung: "A",
                                    chon_lua: [
                                        { noi_dung: "A" },
                                        { noi_dung: "B" },
                                        { noi_dung: "C" },
                                        { noi_dung: "D" }
                                    ]
                                }
                            ]
                        },
                        description: "Thêm danh sách câu hỏi kèm lựa chọn vào cơ sở dữ liệu"
                    },

                    // 2️⃣ Kiểm tra trùng câu hỏi khi import excel
                    checkDuplicate: {
                        path: "/api/check-duplicate-group-questions",
                        httpType: "POST",
                        bodyExample: {
                            groups: [
                                {
                                    ma_mh: "MH001",
                                    trinh_do: "ĐH",
                                    ma_gv: "GV001",
                                    questions: [
                                        {
                                            noi_dung: "Nội dung câu hỏi?",
                                            loai: "chon_1",
                                            dap_an_dung: "A",
                                            chon_lua: [
                                                { noi_dung: "A" },
                                                { noi_dung: "B" }
                                            ],
                                            so_dong_trong_file_import: 12
                                        }
                                    ]
                                }
                            ]
                        },
                        description: "Kiểm tra trùng câu hỏi từ file Excel, trả về danh sách dòng trùng"
                    },

                    // 3️⃣ Thêm nhiều nhóm câu hỏi
                    createMultiGroup: {
                        path: "/api/multi-group-list-questions",
                        httpType: "POST",
                        bodyExample: {
                            groups: [
                                {
                                    ma_mh: "MH001",
                                    trinh_do: "ĐH",
                                    ma_gv: "GV001",
                                    questions: []
                                }
                            ]
                        },
                        description: "Thêm nhiều nhóm câu hỏi một lần"
                    },

                    // 4️⃣ Cập nhật danh sách câu hỏi
                    updateList: {
                        path: "/api/list-questions",
                        httpType: "PUT",
                        description: "Cập nhật (đồng bộ) danh sách câu hỏi cho giáo viên – môn học – trình độ"
                    },

                    // 5️⃣ Xóa danh sách câu hỏi
                    deleteList: {
                        path: "/api/list-questions",
                        httpType: "DELETE",
                        bodyExample: {
                            ma_mh: "MH001",
                            trinh_do: "ĐH",
                            ma_gv: "GV001"
                        },
                        description: "Xóa câu hỏi (xóa mềm nếu đang được sử dụng – xóa cứng nếu không có ràng buộc)"
                    }
                }
            });


            // ================== THI (BÀI LÀM SINH VIÊN) ==================
            apiList.push({
                name: "thi",
                endpoints: {
                    getOneExamForSV: {
                        path: "/api/get-one-exam-forSV/:id_dang_ky_thi/:ma_sv",
                        httpType: "GET",
                        description: "Lấy một bài thi của sinh viên gồm thông tin, chi tiết câu hỏi và lựa chọn"
                    },
                    submitOneExamForSV: {
                        path: "/api/submit-one-exam-forSV",
                        httpType: "POST",
                        bodyExample: {
                            id_dang_ky_thi: 1,
                            ma_sv: "SV001",
                            thoi_gian_bat_dau: "2025-12-10T08:00:00",
                            thoi_gian_ket_thuc: "2025-12-10T09:30:00",
                            diem: 8.5,
                            chi_tiet_thi: [
                                { stt: 1, id_ch: 10, cau_tra_loi: "A" },
                                { stt: 2, id_ch: 12, cau_tra_loi: "B" }
                            ]
                        },
                        description: "Sinh viên nộp bài thi, lưu chi tiết vào bảng `thi` và `chi_tiet_thi`"
                    },
                    listByDangKyThi: {
                        path: "/api/list-exams/by-dangkythi/:id_dang_ky_thi",
                        httpType: "GET",
                        description: "Lấy danh sách các bài thi trong một kỳ thi cụ thể"
                    }
                }
            });

            // ====== 3. API Cloudinary ======
            apiList.push({
                name: "imageCloudinary",
                endpoints: {
                    uploadImage: { path: "/api/imageCloudinary", httpType: "POST" },
                    getImage: { path: "/api/imageCloudinary/:public_id", httpType: "GET" },
                    updateImage: { path: "/api/imageCloudinary/:public_id", httpType: "PUT" },
                    deleteImage: { path: "/api/imageCloudinary/:public_id", httpType: "DELETE" }
                }
            });
            // ====== 4. API Flask gửi email ======
            apiList.push({
                name: "FlaskEmailService",
                endpoints: {
                    sendEmail: {
                        path: "/api/send-email",
                        httpType: "POST",
                        bodyExample: {
                            to: "user@example.com",
                            subject: "Test Email",
                            message: "This is a test email."
                        },
                        description: "Gửi email thông qua dịch vụ Flask"
                    }
                }
            });

            res.json(apiList);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi khi lấy thông tin API" });
        }
    });
    app.get("/api", (req, res) => {
        const apiList = Object.entries(tables).map(([table, columns]) => {
            const idParams = columns.map((_, i) => `id${i + 1}`).join(":");
            return {
                getAll: `/api/${table}`,
                getOne: `/api/${table}/:${idParams}`,
                create: `/api/${table}`,
                update: `/api/${table}/:${idParams}`,
                delete: `/api/${table}/:${idParams}`,
            };
        });

        apiList.push(
            { uploadImage: "/api/imageCloudinary" },
            { getImage: "/api/imageCloudinary/:public_id" },
            { updateImage: "/api/imageCloudinary/:public_id" },
            { deleteImage: "/api/imageCloudinary/:public_id" }
        );

        res.json(apiList);
    });
    /// nếu ko xử lý ngaỳ thì nó trả về dạng :  :::::   "ngay_tao": "2025-03-22T13:53:18.000Z"
    app.get(`/api/${table}`, verifyToken, (req, res) => {
        db.query(`SELECT * FROM ??`, [table], (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);

            // Kiểm tra và xử lý các trường ngày tháng
            const updatedResults = results.map(row => {
                Object.keys(row).forEach(key => {
                    let value = row[key];

                    // Nếu là object (có thể là kiểu Date của MySQL), chuyển thành chuỗi ISO
                    if (value instanceof Date) {
                        value = value.toISOString();
                    }

                    console.log(`Trước: ${key} =`, value); // Debug giá trị trước khi sửa

                    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                        row[key] = convertToDatetimeLocal(moment.utc(value).add(1, 'day').toISOString());
                        console.log(`Sau: ${key} =`, row[key]); // Debug giá trị sau khi sửa
                    }
                });
                return row;
            });

            res.json(updatedResults);
        });
    });
    // GET - Lấy một bản ghi theo khóa chính
    app.get(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, (req, res) => {
        const conditions = keys.map((key, i) => `?? = ?`).join(" AND ");
        const params = [table, ...keys.flatMap((key, i) => [key, req.params[`id${i + 1}`]])];

        db.query(`SELECT * FROM ?? WHERE ${conditions}`, params, (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            if (results.length === 0) return res.status(404).send(`Không tìm thấy dữ liệu trong ${table}`);

            let row = results[0];
            Object.keys(row).forEach(key => {
                let value = row[key];

                if (value instanceof Date) {
                    value = value.toISOString();
                }

                console.log(`Trước: ${key} =`, value); // Debug giá trị trước khi sửa

                if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                    row[key] = convertToDatetimeLocal(moment.utc(value).add(1, 'day').toISOString());
                    console.log(`Sau: ${key} =`, row[key]); // Debug giá trị sau khi sửa
                }
            });

            res.json(row);
        });
    });
    app.delete(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, (req, res) => {

        const conditions = keys.map((key) => `\`${key}\` = ?`).join(" AND ");
        const params = [...keys.map((key, i) => req.params[`id${i + 1}`])];

        const sql = `DELETE FROM \`${table}\` WHERE ${conditions}`;
        console.log("SQL Query:", sql, "Params:", params); // Debug

        db.query(sql, params, (err) => {
            if (err) return res.status(500).send(`Lỗi khi xóa từ ${table}: ${err.message}`);
            res.send(`Xóa từ ${table} thành công`); // ✅ Phải có
        });

    });
    app.put(`/api/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, verifyToken, async (req, res) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send("Không có dữ liệu để cập nhật.");
        }

        // Chuyển đổi dữ liệu ngày tháng sang định dạng MySQL (YYYY-MM-DD)
        Object.keys(req.body).forEach(key => {
            req.body[key] = convertToMySQLTimestamp(req.body[key]);
        });
        // Nếu cập nhật bảng tai_khoan và có mật khẩu mới thì băm mật khẩu
        if (table === "tai_khoan" && req.body.mat_khau) {
            try {
                req.body.mat_khau = await hashPassword(req.body.mat_khau);
            } catch (error) {
                return res.status(500).send("Lỗi khi băm mật khẩu");
            }
        }

        const updates = Object.keys(req.body).map(key => `\`${key}\` = ?`).join(", ");
        const values = [...Object.values(req.body), ...keys.map((_, i) => req.params[`id${i + 1}`])];

        const conditions = keys.map(key => `\`${key}\` = ?`).join(" AND ");
        const sql = `UPDATE \`${table}\` SET ${updates} WHERE ${conditions}`;

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).send(`Lỗi khi cập nhật ${table}: ${err.message}`);
            }
            if (result.affectedRows === 0) {
                return res.status(404).send(`Không tìm thấy bản ghi để cập nhật.`);
            }
            // res.status(200).end(); // Thành công, không gửi nội dung
            res.status(200).json({
                message: `Cập nhật ${table} thành công!`
            });

        });
    });

    app.post(`/api/${table}`, verifyToken, async (req, res) => {
        // Chuyển đổi dữ liệu ngày tháng sang định dạng MySQL (YYYY-MM-DD)
        Object.keys(req.body).forEach(key => {
            req.body[key] = convertToMySQLTimestamp(req.body[key]); // Chuyển đổi nếu là ngày hợp lệ
        });
        // Nếu là bảng tai_khoan, băm mật khẩu trước khi lưu
        if (table === "tai_khoan" && req.body.mat_khau) {
            try {
                req.body.mat_khau = await hashPassword(req.body.mat_khau);
            } catch (error) {
                return res.status(500).send("Lỗi khi băm mật khẩu");
            }
        }
        const columns = Object.keys(req.body);
        const values = Object.values(req.body);

        if (columns.length === 0) return res.status(400).send("Không có dữ liệu để thêm.");

        const sql = `INSERT INTO \`${table}\` (${columns.map(col => `\`${col}\``).join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;

        db.query(sql, values, (err) => {
            if (err) return res.status(500).send(`Lỗi khi thêm vào ${table}: ${err.message}`);
            res.status(201).send(`Thêm vào ${table} thành công`);
            //res.send(`Xóa từ ${table} thành công`); // ✅ Phải có
        });
    });


});

// tạo 1 api lấy cấu hình giao diện không cần đăng nhập 

function getTableColumns(tableName) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION
        `;
        db.query(sql, [db.config.database, tableName], (err, results) => {
            if (err) return reject(err);
            resolve(results.map(row => row.COLUMN_NAME));
        });
    });
}

async function hashPassword(password) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;  // có giá trị mặc định nếu env không có
    return await bcrypt.hash(password, saltRounds);
}


// // Khởi động server
// app.listen(port, () => {
//     console.log(`Server đang chạy tại http://localhost:${port}`);
// });
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
