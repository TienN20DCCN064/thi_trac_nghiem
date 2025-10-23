import React from "react";
import { Modal, Typography, Button, Image, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import formImportImg from "../../../assets/img_import_form.png";

const { Title, Paragraph } = Typography;

const ImportExportGuide = ({ open, onClose }) => {
  const handleDownloadSample = () => {
    try {
      const header = [
        [
          "ma_mh",
          "ma_gv",
          "trinh_do",
          "chuong_so",
          "noi_dung",
          "A",
          "B",
          "C",
          "D",
          "dap_an_dung",
        ],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(header);
      worksheet["!cols"] = [
        { wch: 7 },
        { wch: 7 },
        { wch: 7 },
        { wch: 9 },
        { wch: 35 },
        { wch: 14 },
        { wch: 14 },
        { wch: 14 },
        { wch: 14 },
        { wch: 14 },
      ];

      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "000000" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "MauImport");
      XLSX.writeFile(workbook, "File_mau_import.xlsx");

      message.success("✅ Đã tạo file Excel mẫu thành công!");
    } catch (error) {
      console.error(error);
      message.error("❌ Lỗi khi tạo file Excel mẫu!");
    }
  };

  return (
    <Modal
      title="📘 Hướng dẫn Export và Import questions Excel"
      open={open}
      onOk={onClose}
      onCancel={onClose}
      okText="Đã hiểu"
      cancelText="Đóng"
      width={850} // ✅ Tăng kích thước modal từ 700 → 850
      style={{ top: 40 }} // ✅ Giảm khoảng cách với mép trên
      bodyStyle={{
        fontSize: 16, // ✅ Tăng cỡ chữ trong nội dung
        lineHeight: 1.75,
        padding: "24px 32px",
      }}
    >
      <Typography>
        <Title level={4} style={{ textAlign: "center", marginBottom: 15 }}>
          📤 Cách Export file Excel
        </Title>
        <Paragraph>
          1️⃣ Nhấn nút <b>Export ra Excel</b>.<br />
          2️⃣ File chứa dữ liệu hiện tại sẽ tự động tải xuống máy bạn.
        </Paragraph>

        <Paragraph type="secondary" style={{ marginTop: 20, fontSize: 16 }}>
          💡 <b>Lưu ý khi chuẩn bị file Import:</b>
          <br />
          File Excel phải chứa đầy đủ các cột sau, mỗi cột có ý nghĩa như sau:
        </Paragraph>

        <ul style={{ paddingLeft: "26px", color: "#444", fontSize: 15 }}>
          <li>
            <b>ma_mh</b> — Mã môn học (ví dụ: <i>MH001</i>)
          </li>
          <li>
            <b>ma_gv</b> — Mã giáo viên ra đề (ví dụ: <i>GV001</i>)
          </li>
          <li>
            <b>trinh_do</b> — Trình độ của câu hỏi (ví dụ:{" "}
            <i>Đại học, Cao đẳng...</i>)
          </li>
          <li>
            <b>chuong_so</b> — Số thứ tự chương trong giáo trình
          </li>
          <li>
            <b>noi_dung</b> — Nội dung câu hỏi (phần đề)
          </li>
          <li>
            <b>A, B, C, D</b> — Nội dung các đáp án lựa chọn
          </li>
          <li>
            <b>dap_an_dung</b> — Chọn 1 trong các giá trị <b>A, B, C hoặc D</b>.{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>
              (Không được để trống!)
            </span>
          </li>
        </ul>
        <Title level={4} style={{ textAlign: "center", marginBottom: 20 }}>
          🧩 Cách Import file Excel
        </Title>

        <Paragraph>
          1️⃣ Nhấn nút <b>Import từ Excel</b>.<br />
          2️⃣ Chọn tệp Excel (*.xlsx) có cấu trúc đúng.
          <br />
          3️⃣ Dữ liệu sẽ được đọc và hiển thị trong bảng.
        </Paragraph>

        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Image
            src={formImportImg}
            alt="Form Import minh họa"
            style={{
              maxWidth: "90%", // ✅ to hơn
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          />
          <Paragraph type="secondary" style={{ marginTop: 10, fontSize: 15 }}>
            (Hình minh họa giao diện form Import)
          </Paragraph>
        </div>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Button
            size="large" // ✅ nút to hơn
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadSample}
          >
            📥 Tải file Excel mẫu
          </Button>
        </div>
      </Typography>
    </Modal>
  );
};

export default ImportExportGuide;
