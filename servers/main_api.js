import express from "express";
import mysql from "mysql2";
import cors from "cors";
import jwt from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // Đọc biến môi trường từ .env

const app = express();       // tạo 1 ứng dụng express
const port = 4002;           // api chạy trên cổng

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
const tables_not_token = {
    "tai_khoan": ["id_tai_khoan"],                          // Tài khoản
    "khoa": ["ma_khoa"],                                 // Khoa
    "mon_hoc": ["ma_mh"],                                // Môn học
    "giao_vien": ["ma_gv"],                              // Giáo viên
    "lop": ["ma_lop"],                                   // Lớp
    "sinh_vien": ["ma_sv"],                              // Sinh viên

    "tai_khoan_giao_vien": ["id_tai_khoan"],             // Tài khoản - Giáo viên
    "tai_khoan_sinh_vien": ["id_tai_khoan"],             // Tài khoản - Sinh viên

    "cau_hoi": ["id_ch"],                                // Câu hỏi
    "chon_lua": ["id_chon_lua"],                         // Đáp án lựa chọn

    "dang_ky_thi": ["id_dang_ky_thi"],                   // Đăng ký thi
    "chi_tiet_dang_ky_thi": ["id_dang_ky_thi", "chuong_so"], // Chi tiết đăng ký thi (Composite PK)

    "thi": ["id_thi"],                                   // Bài thi
    "chi_tiet_bai_thi": ["id"],                          // Chi tiết bài thi
};

// get : /api/{name_table}/{id_tbale}

const tables = {
    "tai_khoan": ["id_tai_khoan"],                       // Tài khoản
    "khoa": ["ma_khoa"],                                 // Khoa
    "mon_hoc": ["ma_mh"],                                // Môn học
    "giao_vien": ["ma_gv"],                              // Giáo viên
    "lop": ["ma_lop"],                                   // Lớp
    "sinh_vien": ["ma_sv"],                              // Sinh viên

    "tai_khoan_giao_vien": ["id_tai_khoan"],             // Tài khoản - Giáo viên
    "tai_khoan_sinh_vien": ["id_tai_khoan"],             // Tài khoản - Sinh viên

    "cau_hoi": ["id_ch"],                                // Câu hỏi
    "chon_lua": ["id_chon_lua"],                         // Đáp án lựa chọn

    "dang_ky_thi": ["id_dang_ky_thi"],                   // Đăng ký thi
    "chi_tiet_dang_ky_thi": ["id_dang_ky_thi", "chuong_so"], // Chi tiết đăng ký thi (Composite PK)

    "thi": ["id_thi"],                                   // Bài thi
    "chi_tiet_bai_thi": ["id"],                          // Chi tiết bài thi
};


app.post("/api/dang-nhap", (req, res) => {
    const { ten_dang_nhap, mat_khau } = req.body;

    if (!ten_dang_nhap || !mat_khau) {
        return res.status(400).json({ message: "Thiếu tên đăng nhập hoặc mật khẩu" });
    }

    // 1. Lấy tài khoản theo ten_dang_nhap
    const sql = `SELECT * FROM tai_khoan WHERE ten_dang_nhap = ?`;

    db.query(sql, [ten_dang_nhap], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server", error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        const user = results[0];

        // 2. So sánh mật khẩu nhập với mật khẩu hash trong DB
        const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }

        const token = jwt.sign(
            { id_tai_khoan: user.id_tai_khoan, vai_tro: user.vai_tro },
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
// =============== API Đăng ký thi ===============
app.post("/api/dang-ky-thi", verifyToken, async (req, res) => {
    const { ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian, chi_tiet_dang_ky_thi } = req.body;
    // in ra 
    console.log("🚀 Payload đăng ký thi:", req.body);
    const connection = db.promise();

    try {
        await connection.beginTransaction();

        let tongSoCau = 0;
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
            tongSoCau += so_cau;
        }

        if (errMsg) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: errMsg });
        }

        // Thêm bản ghi vào bảng dang_ky_thi (bỏ so_cau_thi)
        const [result] = await connection.query(
            `INSERT INTO dang_ky_thi (ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian) VALUES (?, ?, ?, ?, ?, ?)`,
            [ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian]
        );


        const idDangKy = result.insertId;

        // Thêm chi tiết vào chi_tiet_dang_ky_thi
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

        // Cập nhật bảng dang_ky_thi
        await connection.query(
            `UPDATE dang_ky_thi SET ma_gv = ?, ma_lop = ?, ma_mh = ?, trinh_do = ?, ngay_thi = ?, thoi_gian = ? WHERE id_dang_ky_thi = ?`,
            [ma_gv, ma_lop, ma_mh, trinh_do, ngay_thi, thoi_gian, id]
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



// đây là api không cần tocken // trả về nguyên bản

Object.entries(tables_not_token).forEach(([table, keys]) => {
    app.get("/api_not_token", async (req, res) => {
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
                    }
                });
            }

            res.json(apiList);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi khi lấy thông tin API" });
        }
    });

    // GET - Lấy tất cả dữ liệu
    app.get(`/api_not_token/${table}`, (req, res) => {
        db.query(`SELECT * FROM ??`, [table], (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            res.json(results);
        });
    });

    // GET - Lấy một bản ghi theo khóa chính
    app.get(`/api_not_token/${table}/:${keys.map((_, i) => `id${i + 1}`).join("/:")}`, (req, res) => {
        const conditions = keys.map((key, i) => `?? = ?`).join(" AND ");
        const params = [table, ...keys.flatMap((key, i) => [key, req.params[`id${i + 1}`]])];

        db.query(`SELECT * FROM ?? WHERE ${conditions}`, params, (err, results) => {
            if (err) return res.status(500).send(`Lỗi khi lấy dữ liệu từ ${table}`);
            if (results.length === 0) return res.status(404).send(`Không tìm thấy dữ liệu trong ${table}`);
            res.json(results[0]);
        });
    });
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
            // ====== 2. API đăng nhập ======
            // ====== 2. API đăng nhập (đúng code của bạn) ======
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
            res.status(200).end(); // Thành công, không gửi nội dung

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
