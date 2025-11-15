import React, { useState, useEffect } from "react";

import { Form, Select, Row, Col, Card, message, Table, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx-js-style";

import { saveAs } from "file-saver";
import hamChung from "../../services/service.hamChung";
import { getUserInfo, getRole } from "../../globals/globals.js";
import hamChitiet from "../../services/service.hamChiTiet.js";
import CellDisplay from "../../components/common/CellDisplay.jsx";
const { Option } = Select;

const FilterExamForm = () => {
  const [dsGiaoVien, setDsGiaoVien] = useState([]);
  const [dsMon, setDsMon] = useState([]);
  const [dsLop, setDsLop] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [listExamsStudent, setListExamsStudent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [giaoVienData, monData, lopData] = await Promise.all([
        hamChung.getAll("giao_vien"),
        hamChung.getAll("mon_hoc"),
        hamChung.getAll("lop"),
      ]);
      const test = await hamChitiet.getUserInfoByAccountId(
        getUserInfo().id_tai_khoan
      );

      setDsGiaoVien(giaoVienData);
      setDsMon(monData);
      setDsLop(lopData);

      const teacherRole = getRole() === "GiaoVien";
      setIsTeacher(teacherRole);

      if (teacherRole && test && test.ma_gv) {
        form.setFieldsValue({ ma_gv: test.ma_gv });
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  // ✅ Chuyển số thành chữ
  function numberToWords(num) {
    if (num === null || num === undefined || num === "---") return "---";
    const units = [
      "không",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];
    const [integerPart, decimalPart] = String(num).split(".");
    let intText = "";
    const n = parseInt(integerPart, 10);
    if (isNaN(n)) return "---";
    if (n < 10) intText = units[n];
    else if (n < 20) intText = "mười " + (n % 10 !== 0 ? units[n % 10] : "");
    else if (n < 100)
      intText =
        units[Math.floor(n / 10)] +
        " mươi" +
        (n % 10 !== 0 ? " " + units[n % 10] : "");
    else intText = n.toString();
    if (decimalPart) {
      const decimalText = decimalPart
        .split("")
        .map((d) => units[parseInt(d, 10)])
        .join(" ");
      return intText + " phẩy " + decimalText;
    }
    return intText;
  }

  // ✅ Lấy danh sách bài thi
  const getExamResults = async (ma_gv, ma_mh, ma_lop) => {
    try {
      const dataDangKyThi = await hamChung.getAll("dang_ky_thi");
      const getOneDangKyThi = dataDangKyThi.find(
        (dk) => dk.ma_lop === ma_lop && dk.ma_mh === ma_mh
      );

      if (!getOneDangKyThi) {
        message.warning("Không tìm thấy đăng ký thi phù hợp.");
        return null;
      }

      const listExamsStudent = await hamChung.getListExamsByDangKyThi(
        getOneDangKyThi.id_dang_ky_thi
      );
      const dataSinhVien = await hamChung.getAll("sinh_vien");
      const dataSinhVienByLop = dataSinhVien.filter(
        (sv) => sv.ma_lop === ma_lop
      );

      const mergedData = dataSinhVienByLop.map((sv) => {
        const baiThi = listExamsStudent?.data?.find(
          (b) => b.ma_sv === sv.ma_sv
        );
        let diem = baiThi?.diem ?? "---";
        let trang_thai = baiThi?.trang_thai || "---";
        let ghi_chu = "";
        if (trang_thai === "---" || !baiThi) {
          diem = 0;
          ghi_chu = "Bỏ thi";
        }
        return {
          ma_sv: sv.ma_sv,
          ho: sv.ho, // ✅ thêm ho
          ten: sv.ten, // ✅ thêm ten
          ho_ten: `${sv.ho} ${sv.ten}`, // vẫn giữ nếu cần hiển thị UI
          thoi_gian_bat_dau: baiThi?.thoi_gian_bat_dau || "---",
          thoi_gian_ket_thuc: baiThi?.thoi_gian_ket_thuc || "---",
          diem,
          trang_thai,
          ghi_chu,
        };
      });

      if (!mergedData || mergedData.length === 0) {
        message.info("Không có sinh viên trong lớp này.");
        return null;
      }

      message.success("Lấy danh sách bài thi thành công!");
      return mergedData;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách bài thi:", error);
      message.error("Lỗi khi lấy danh sách bài thi!");
      return null;
    }
  };

  const handleFormChange = async (changedValues, allValues) => {
    try {
      if (Object.prototype.hasOwnProperty.call(changedValues, "ma_gv")) {
        form.setFieldsValue({ ma_mh: undefined, ma_lop: undefined });
        allValues = { ...allValues, ma_mh: undefined, ma_lop: undefined };
      }
      if (Object.prototype.hasOwnProperty.call(changedValues, "ma_mh")) {
        form.setFieldsValue({ ma_lop: undefined });
        allValues = { ...allValues, ma_lop: undefined };
      }

      const { ma_gv, ma_mh, ma_lop } = allValues;
      if (ma_gv && ma_mh && ma_lop) {
        const examResults = await getExamResults(ma_gv, ma_mh, ma_lop);
        setListExamsStudent(examResults || null);
      } else {
        setListExamsStudent(null);
      }
    } catch (error) {
      console.error("Lỗi trong handleFormChange:", error);
      setListExamsStudent(null);
    }
  };

 const handleExportExcel = async () => {
    if (!listExamsStudent || listExamsStudent.length === 0) return;

    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Lấy thông tin đăng ký thi
    const dataDangKyThi = await hamChung.getAll("dang_ky_thi");
    const getOneDangKyThi = dataDangKyThi.find(
      (dk) =>
        dk.ma_lop === form.getFieldValue("ma_lop") &&
        dk.ma_mh === form.getFieldValue("ma_mh")
    );

    const ngayThiRaw = getOneDangKyThi?.ngay_thi;
    const thoiLuongThi = getOneDangKyThi?.thoi_gian;
    const monHoc = await hamChung.getOne(
      "mon_hoc",
      form.getFieldValue("ma_mh")
    );

    let ngayThi = "---";
    if (ngayThiRaw) {
      const dt = new Date(ngayThiRaw);
      ngayThi = dt.toLocaleDateString("vi-VN");
    }

    // --- Header trước bảng điểm ---
    ws_data.push([
      "HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG", // A1
      "", "", "",
      "BẢNG ĐIỂM THI KẾT THÚC HỌC PHẦN", // E1 (Cần in đậm)
      "", "", "", "", "",
    ]);
    ws_data.push([
      "CƠ SỞ THÀNH HỒ CHÍ MINH",
      "", "", "", "", "", "", "", "", "",
    ]);
    ws_data.push([
      "TRUNG TÂM KHẢO THÍ VÀ ĐẢM BẢO CLGD", // A3 (Cần in đậm)
      "", "", "", "", "", "", "", "", "",
    ]);
    ws_data.push([]); // dòng trống

    ws_data.push([
      `Mã môn học: ${monHoc?.ma_mh || "---"}`,
      "", "", "",
      `Tên môn học: ${monHoc?.ten_mh || "---"}`,
      "", "", "", "", "",
    ]);
    ws_data.push([
      `Ngày thi: ${ngayThi}`,
      "", "", "",
      `Thời lượng thi: ${thoiLuongThi || "---"} phút`,
      "", "", "", "", "",
    ]);
    ws_data.push([]); // dòng trống

    // --- Header bảng điểm: 2 dòng (dòng 7 và 8) ---
    ws_data.push([
      "STT",
      "Họ và tên SV",
      "Mã sinh viên",
      "Mã lớp",
      "Số tờ giấy thi",
      "Ký tên",
      "Số phách",
      "Điểm thi", 
      "",
      "Ghi chú",
    ]);
    ws_data.push([
      "", // STT
      "", // Họ và tên SV
      "", // Mã sinh viên
      "", // Mã lớp
      "", // Số tờ giấy thi
      "", // Ký tên
      "", // Số phách
      "Đ.số",
      "Đ.chữ",
      "", // Ghi chú
    ]);

    // --- Dữ liệu sinh viên (Bắt đầu từ dòng 9) ---
    for (let index = 0; index < listExamsStudent.length; index++) {
      const sv = listExamsStudent[index];
      const getIfOneSv = await hamChung.getOne("sinh_vien", sv.ma_sv);

      ws_data.push([
        index + 1,
        `${sv.ho} ${sv.ten}`,
        sv.ma_sv,
        getIfOneSv?.ma_lop || "",
        "", // Số tờ giấy thi
        "", // Ký tên
        "", // Số phách
        sv.diem, // Đ.số (cột 7)
        numberToWords(sv.diem), // Đ.chữ (cột 8)
        sv.ghi_chu || "",
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // --- Merge cells header ---
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // HỌC VIỆN... (A1:D1)
      { s: { r: 0, c: 4 }, e: { r: 0, c: 9 } }, // BẢNG ĐIỂM... (E1:J1)
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // CƠ SỞ... (A2:D2)
      { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // TRUNG TÂM... (A3:D3)
      { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } }, // Mã môn học (A5:D5)
      { s: { r: 4, c: 4 }, e: { r: 4, c: 9 } }, // Tên môn học (E5:J5)
      { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }, // Ngày thi (A6:D6)
      { s: { r: 5, c: 4 }, e: { r: 5, c: 9 } }, // Thời lượng thi (E6:J6)

      // Bổ sung merge 2 dòng cho các cột bảng điểm
      { s: { r: 7, c: 0 }, e: { r: 8, c: 0 } }, // STT (r7 -> r8, c0)
      { s: { r: 7, c: 1 }, e: { r: 8, c: 1 } }, // Họ và tên SV (r7 -> r8, c1)
      { s: { r: 7, c: 2 }, e: { r: 8, c: 2 } }, // Mã sinh viên (r7 -> r8, c2)
      { s: { r: 7, c: 3 }, e: { r: 8, c: 3 } }, // Mã lớp (r7 -> r8, c3)
      { s: { r: 7, c: 4 }, e: { r: 8, c: 4 } }, // Số tờ giấy thi (r7 -> r8, c4)
      { s: { r: 7, c: 5 }, e: { r: 8, c: 5 } }, // Ký tên (r7 -> r8, c5)
      { s: { r: 7, c: 6 }, e: { r: 8, c: 6 } }, // Số phách (r7 -> r8, c6)
      { s: { r: 7, c: 9 }, e: { r: 8, c: 9 } }, // Ghi chú (r7 -> r8, c9)

      // Giữ nguyên merge Điểm thi
      { s: { r: 7, c: 7 }, e: { r: 7, c: 8 } }, // Điểm thi merge Đ.số + Đ.chữ (r7, c7 -> r7, c8)
    ];

    // --- Áp dụng style in đậm cho 2 tiêu đề chính (BỔ SUNG) ---

    // 1. "BẢNG ĐIỂM THI KẾT THÚC HỌC PHẦN" (r:0, c:4)
    const cellBangDiem = XLSX.utils.encode_cell({ r: 0, c: 4 });
    if (ws[cellBangDiem]) {
      ws[cellBangDiem].s = ws[cellBangDiem].s || {};
      ws[cellBangDiem].s.font = { bold: true, sz: 14 }; // Tăng size cho nổi bật
      // Căn giữa sau khi merge E1:J1
      ws[cellBangDiem].s.alignment = { horizontal: "center", vertical: "center", wrapText: true }; 
    }

    // 2. "TRUNG TÂM KHẢO THÍ VÀ ĐẢM BẢO CLGD" (r:2, c:0)
    const cellTrungTam = XLSX.utils.encode_cell({ r: 2, c: 0 });
    if (ws[cellTrungTam]) {
      ws[cellTrungTam].s = ws[cellTrungTam].s || {};
      ws[cellTrungTam].s.font = { bold: true };
      // Căn lề trái cho tên Trung tâm (A3:D3)
      ws[cellTrungTam].s.alignment = { horizontal: "left", vertical: "top" };
    }


    // --- Căn giữa & in đậm header bảng (dòng 7 & 8) ---
    ws["!rows"] = [];
    ws["!rows"][7] = { hpx: 15 }; // dòng tiêu đề trên
    ws["!rows"][8] = { hpx: 15 }; // dòng tiêu đề dưới (Đ.số/Đ.chữ)

    for (let r = 7; r <= 8; r++) {
      for (let c = 0; c <= 9; c++) {
        const cell_ref = XLSX.utils.encode_cell({ r, c });
        if (!ws[cell_ref]) continue;
        ws[cell_ref].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          font: { bold: true },
        };
      }
    }

    // --- Căn giữa cột Đ.số dữ liệu (Bắt đầu từ dòng 9) ---
    for (let i = 9; i < ws_data.length; i++) {
      const cell_ref = XLSX.utils.encode_cell({ r: i, c: 7 }); // cột Đ.số là cột 7
      if (ws[cell_ref]) {
        ws[cell_ref].s = ws[cell_ref].s || {}; // Đảm bảo style tồn tại
        ws[cell_ref].s.alignment = { horizontal: "center" };
      }
    }

    // --- Chiều rộng cột ---
    ws["!cols"] = [
      { wpx: 40 }, // STT
      { wpx: 170 }, // Họ và tên SV
      { wpx: 90 }, // Mã SV
      { wpx: 90 }, // Mã lớp
      { wpx: 60 }, // Số tờ giấy
      { wpx: 80 }, // Ký tên
      { wpx: 60 }, // Số phách
      { wpx: 40 }, // Đ.số
      { wpx: 80 }, // Đ.chữ
      { wpx: 100 }, // Ghi chú
    ];

    XLSX.utils.book_append_sheet(wb, ws, "DanhSachDiem");
    XLSX.writeFile(wb, "DanhSachDiem.xlsx");
  };

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>STT</div>,
      key: "stt",
      width: 40,
      render: (_, __, index) => index + 1,
    },
    {
      title: <div style={{ textAlign: "center" }}>Họ và tên SV</div>,
      dataIndex: "sinh_vien",
      render: (v, record) => (
        <div
          style={{
            width: "170px",
            minHeight: "20px",
            position: "relative",
          }}
        >
          {/* HỌ */}
          <div style={{ width: "100px", wordBreak: "break-word" }}>
            <CellDisplay table="sinh_vien" id={record.ma_sv} fieldName={"ho"} />
          </div>

          {/* TÊN – luôn nằm trên dòng đầu */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "130px",
              width: "calc(170px - 130px)",
              wordBreak: "break-word",
            }}
          >
            <CellDisplay
              table="sinh_vien"
              id={record.ma_sv}
              fieldName={"ten"}
            />
          </div>
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Mã sinh viên</div>,
      dataIndex: "ma_sv",
      key: "ma_sv",
      width: 140,
    },
    {
      title: <div style={{ textAlign: "center" }}>Mã lớp</div>,
      dataIndex: "ma_lop",
      key: "ma_lop",
      width: 140,
      render: (v, record) => (
        <CellDisplay table="sinh_vien" id={record.ma_sv} fieldName="ma_lop" />
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Số tờ giấy thi</div>,
      key: "so_to_giay_thi",
      width: 90,
      render: () => "",
    },
    {
      title: <div style={{ textAlign: "center" }}>Ký tên</div>,
      key: "ky_ten",
      width: 120,
      render: () => "",
    },
    {
      title: <div style={{ textAlign: "center" }}>Số phách</div>,
      key: "so_phach",
      width: 80,
      render: () => "",
    },

    // Cột cha "Điểm thi"
    {
      title: (
        <div style={{ textAlign: "center", fontWeight: "bold" }}>Điểm thi</div>
      ),
      children: [
        {
          title: <div style={{ textAlign: "center" }}>Đ.số</div>, // tiêu đề căn giữa
          dataIndex: "diem",
          key: "diem",
          width: 80,
          align: "center", // ✅ căn giữa giá trị
        },
        {
          title: <div style={{ textAlign: "center" }}>Đ.chữ</div>,
          key: "diem_chu",
          width: 140,
          render: (_, record) => numberToWords(record.diem),
        },
      ],
    },

    {
      title: <div style={{ textAlign: "center" }}>Ghi chú</div>,
      dataIndex: "ghi_chu",
      key: "ghi_chu",
      width: 120,
    },
  ];

  return (
    <>
      <Card className="filter-card" style={{ marginBottom: 20 }}>
        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="ma_gv"
                label="Giáo viên"
                rules={[
                  { required: true, message: "Vui lòng chọn giáo viên!" },
                ]}
              >
                <Select placeholder="Chọn giáo viên" disabled={isTeacher}>
                  {dsGiaoVien.map((gv) => (
                    <Option key={gv.ma_gv} value={gv.ma_gv}>
                      {gv.ho + " " + gv.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="ma_mh"
                label="Môn học"
                rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
              >
                <Select placeholder="Chọn môn học">
                  {dsMon.map((mon) => (
                    <Option key={mon.ma_mh} value={mon.ma_mh}>
                      {mon.ten_mh}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="ma_lop"
                label="Lớp học"
                rules={[{ required: true, message: "Vui lòng chọn lớp!" }]}
              >
                <Select placeholder="Chọn lớp">
                  {dsLop.map((lop) => (
                    <Option key={lop.ma_lop} value={lop.ma_lop}>
                      {lop.ten_lop}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* ✅ Nút Export Excel */}
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          disabled={!listExamsStudent || listExamsStudent.length === 0}
          onClick={handleExportExcel}
          style={{ marginTop: 8 }}
        >
          Xuất Excel Danh Sách Điểm
        </Button>
      </Card>

      {/* ✅ Hiển thị bảng điểm nếu có */}
      {listExamsStudent && listExamsStudent.length > 0 && (
        <Card title="Danh sách bài thi của sinh viên" bordered>
          <Table
            rowKey={(record) => record.ma_sv}
            dataSource={listExamsStudent}
            columns={columns}
            pagination={false}
          />
        </Card>
      )}
    </>
  );
};

export default FilterExamForm;
