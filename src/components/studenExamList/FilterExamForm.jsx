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
          ho_ten: `${sv.ho} ${sv.ten}`,
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

    const values = form.getFieldsValue();
    const infoGV = dsGiaoVien.find((gv) => gv.ma_gv === values.ma_gv);
    const infoMH = dsMon.find((mh) => mh.ma_mh === values.ma_mh);
    const infoLop = dsLop.find((lop) => lop.ma_lop === values.ma_lop);

    // 👉 Lấy thời gian thi từ bảng đăng ký thi
    const dataDangKyThi = await hamChung.getAll("dang_ky_thi");
    const dkThi = dataDangKyThi.find(
      (dk) => dk.ma_lop === values.ma_lop && dk.ma_mh === values.ma_mh
    );
    const timeThi = dkThi?.thoi_gian_thi
      ? new Date(dkThi.thoi_gian_thi).toLocaleString("vi-VN")
      : "---";

    // 🏷️ Header layout theo yêu cầu
    const headerInfo = [
      [
        {
          v: infoMH?.ten_mh?.toUpperCase() || "TÊN MÔN HỌC",
          s: {
            font: { bold: true, sz: 18 },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
      [],
      [
        {
          v: "Mã lớp: " + (infoLop?.ma_lop || "---"),
          s: { alignment: { horizontal: "left" } },
        },
        {},
        {
          v: "Tên lớp: " + (infoLop?.ten_lop || "---"),
          s: { alignment: { horizontal: "left" } }, // ✅ căn trái
        },
        {},
      ],
      [
        {
          v: "Mã môn: " + (infoMH?.ma_mh || "---"),
          s: { alignment: { horizontal: "left" } },
        },
        {},
        {
          v: "Tên môn: " + (infoMH?.ten_mh || "---"),
          s: { alignment: { horizontal: "left" } }, // ✅ căn trái
        },
        {},
      ],
      [
        {
          v: "Mã giáo viên: " + (infoGV?.ma_gv || "---"),
          s: { alignment: { horizontal: "left" } },
        },
        {},
        {
          v: "Tên giáo viên: " + (infoGV?.ten || "---"),
          s: { alignment: { horizontal: "left" } }, // ✅ căn trái
        },
        {},
      ],
      [
        {
          v: "Thời gian thi: " + timeThi,
          s: { alignment: { horizontal: "right" } }, // giữ nguyên dòng này
        },
      ],
      [],
    ];

    const headers = [
      "Mã sinh viên",
      "Họ tên",
      "Ngày làm bài",
      "Điểm (số)",
      "Điểm (chữ)",
      "Ghi chú",
      "Chữ ký",
    ];

    const dataRows = listExamsStudent.map((item) => ({
      "Mã sinh viên": item.ma_sv,
      "Họ tên": item.ho_ten,
      "Ngày làm bài":
        item.thoi_gian_ket_thuc && item.thoi_gian_ket_thuc !== "---"
          ? new Date(item.thoi_gian_ket_thuc).toLocaleDateString("vi-VN")
          : "---",
      "Điểm (số)": item.diem,
      "Điểm (chữ)": numberToWords(item.diem),
      "Ghi chú": item.ghi_chu,
      "Chữ ký": "",
    }));

    // ✅ Tạo sheet SAU khi định nghĩa header
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, headerInfo, { origin: "A1" });
    XLSX.utils.sheet_add_json(ws, dataRows, {
      origin: "A8",
      header: headers,
      skipHeader: false,
    });

    // ✅ Merge cells — đặt sau khi ws đã được tạo
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Tên môn học (A1:G1)

      { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }, // Mã lớp: A3–B3
      { s: { r: 2, c: 2 }, e: { r: 2, c: 4 } }, // ✅ Tên lớp: C3–E3

      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // Mã môn: A4–B4
      { s: { r: 3, c: 2 }, e: { r: 3, c: 4 } }, // ✅ Tên môn: C4–E4

      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, // Mã giáo viên: A5–B5
      { s: { r: 4, c: 2 }, e: { r: 4, c: 4 } }, // ✅ Tên giáo viên: C5–E5

      { s: { r: 5, c: 0 }, e: { r: 5, c: 6 } }, // Thời gian thi: A6–G6
    ];

    // ✅ Auto width
    const allRows = [
      headers,
      ...dataRows.map((r) => headers.map((h) => String(r[h] ?? ""))),
    ];
    ws["!cols"] = headers.map((_, i) => {
      const max = Math.max(...allRows.map((r) => r[i].length)) + 2;
      return { wch: Math.min(max, 40) };
    });

    // ✅ Viền và căn giữa
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = 7; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) continue;
        const isHeader = R === 7;
        ws[cellAddress].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
          alignment: {
            horizontal: isHeader ? "center" : "left",
            vertical: "center",
            wrapText: true,
          },
          font: isHeader
            ? { bold: true, color: { rgb: "000000" } }
            : { color: { rgb: "000000" } },
        };
      }
    }

    // ✅ Xuất file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DiemSinhVien");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Danh_sach_diem_sinh_vien.xlsx");
  };

  const columns = [
    { title: "Mã sinh viên", dataIndex: "ma_sv", key: "ma_sv" },
    {
      title: "Họ tên",
      dataIndex: "sinh_vien",
      render: (v, record) => (
        <CellDisplay table="sinh_vien" id={record.ma_sv} />
      ),
    },
    {
      title: "Ngày làm bài",
      key: "ngay_lam_bai",
      render: (_, record) => {
        if (!record.thoi_gian_ket_thuc || record.thoi_gian_ket_thuc === "---")
          return "---";
        const date = new Date(record.thoi_gian_ket_thuc);
        return date.toLocaleDateString("vi-VN");
      },
    },
    { title: "Điểm (số)", dataIndex: "diem", key: "diem" },
    {
      title: "Điểm (chữ)",
      key: "diem_chu",
      render: (_, record) => numberToWords(record.diem),
    },
    { title: "Ghi chú", dataIndex: "ghi_chu", key: "ghi_chu" },
    { title: "Chữ ký", key: "chu_ky", render: () => "" },
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
