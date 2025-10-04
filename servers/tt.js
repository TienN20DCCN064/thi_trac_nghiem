import express from "express";
import mysql from "mysql2";
import cors from "cors";
import jwt from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // Đọc biến môi trường từ .env

const app = express(); // Tạo ứng dụng Express
const port = 4002; // Cổng chạy API

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DTB_HOST,
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

// API: Thêm danh sách câu hỏi và lựa chọn
app.post("/api/cau-hoi", verifyToken, async (req, res) => {
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



// API: Cập nhật câu hỏi
app.put("/api/cau-hoi", verifyToken, async (req, res) => {
    const { ma_gv, questions } = req.body;
    const connection = db.promise();

    try {
        if (!ma_gv || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: "Dữ liệu đầu vào không hợp lệ" });
        }

        await connection.beginTransaction();

        for (const q of questions) {
            const { id_ch, trinh_do, loai, noi_dung, dap_an_dung, chuong_so, chon_lua } = q;

            if (!id_ch || !trinh_do || !loai || !noi_dung) {
                await connection.rollback();
                return res.status(400).json({ success: false, message: "Thiếu thông tin câu hỏi" });
            }

            // kiểm tra quyền sở hữu
            const [rows] = await connection.execute(
                `SELECT 1 FROM cau_hoi WHERE id_ch=? AND ma_gv=?`,
                [id_ch, ma_gv]
            );
            if (rows.length === 0) {
                await connection.rollback();
                return res.status(403).json({
                    success: false,
                    message: `Câu hỏi id=${id_ch} không tồn tại hoặc không thuộc giáo viên ${ma_gv}`
                });
            }

            const safe_dap_an_dung = dap_an_dung || null;
            const safe_chuong_so = chuong_so || null;

            // cập nhật câu hỏi
            await connection.execute(
                `UPDATE cau_hoi 
                 SET trinh_do=?, loai=?, noi_dung=?, dap_an_dung=?, chuong_so=? 
                 WHERE id_ch=? AND ma_gv=?`,
                [trinh_do, loai, noi_dung, safe_dap_an_dung, safe_chuong_so, id_ch, ma_gv]
            );

            // xử lý lựa chọn
            await connection.execute(`DELETE FROM chon_lua WHERE id_ch=?`, [id_ch]);

            if (loai === 'chon_1' && Array.isArray(chon_lua)) {
                for (const choice of chon_lua) {
                    if (!choice.noi_dung) {
                        await connection.rollback();
                        return res.status(400).json({ success: false, message: "Thiếu nội dung lựa chọn" });
                    }
                    await connection.execute(
                        `INSERT INTO chon_lua (noi_dung, id_ch) VALUES (?, ?)`,
                        [choice.noi_dung, id_ch]
                    );
                }
            }
        }

        await connection.commit();
        res.json({ success: true, message: "Cập nhật câu hỏi thành công" });
    } catch (error) {
        await connection.rollback();
        console.error("Lỗi cập nhật:", error);
        res.status(500).json({ success: false, message: `Lỗi server: ${error.message}` });
    }
});

// API: Xóa câu hỏi
app.delete("/api/cau-hoi", verifyToken, async (req, res) => {
    const { ma_gv, questionIds } = req.body;
    const connection = db.promise();

    try {
        if (!ma_gv || !Array.isArray(questionIds)) {
            return res.status(400).json({ success: false, message: "Dữ liệu đầu vào không hợp lệ" });
        }

        await connection.beginTransaction();

        for (const id_ch of questionIds) {
            const [rows] = await connection.execute(
                `SELECT 1 FROM cau_hoi WHERE id_ch=? AND ma_gv=?`,
                [id_ch, ma_gv]
            );
            if (rows.length === 0) {
                await connection.rollback();
                return res.status(403).json({
                    success: false,
                    message: `Câu hỏi id=${id_ch} không tồn tại hoặc không thuộc giáo viên ${ma_gv}`
                });
            }

            await connection.execute(
                `DELETE FROM cau_hoi WHERE id_ch=? AND ma_gv=?`,
                [id_ch, ma_gv]
            );
        }

        await connection.commit();
        res.json({ success: true, message: "Xóa câu hỏi thành công" });
    } catch (error) {
        await connection.rollback();
        console.error("Lỗi xóa:", error);
        res.status(500).json({ success: false, message: `Lỗi server: ${error.message}` });
    }
});



// API đăng nhập
app.post("/api/dang-nhap", (req, res) => {
    const { ten_dang_nhap, mat_khau } = req.body;

    if (!ten_dang_nhap || !mat_khau) {
        return res.status(400).json({ message: "Thiếu tên đăng nhập hoặc mật khẩu" });
    }

    const sql = `SELECT * FROM tai_khoan WHERE ten_dang_nhap = ?`;
    db.query(sql, [ten_dang_nhap], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server", error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        const token = jwt.sign(
            { id_tai_khoan: user.id_tai_khoan, vai_tro: user.vai_tro, ma_gv: user.ma_gv },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
            message: "Đăng nhập thành công",
            token,
            user
        });
    });
});


app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});