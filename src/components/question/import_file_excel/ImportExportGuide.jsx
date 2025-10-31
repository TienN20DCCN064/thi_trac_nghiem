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
          "trinh_do",
          "loai",
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

        <Title level={4} style={{ textAlign: "center", marginBottom: 20 }}>
          🧩 Cách Import file Excel
        </Title>

        <Paragraph>
          1️⃣ Nhấn nút <b>Import từ Excel</b>.<br />
          2️⃣ Chọn tệp Excel (*.xlsx) có cấu trúc đúng.
          <br />
          3️⃣ Dữ liệu sẽ được đọc và hiển thị trong bảng.
        </Paragraph>
        <Paragraph type="secondary" style={{ marginTop: 20, fontSize: 16 }}>
          💡 <b>Lưu ý khi chuẩn bị file Import:</b>
          <br />
          File Excel phải chứa đầy đủ các cột sau, mỗi cột có ý nghĩa như sau:
        </Paragraph>

        <ul
          style={{
            paddingLeft: "28px",
            color: "#333",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          <li>
            <b style={{ color: "#1677ff" }}>ma_mh</b> — Mã môn học
            <span style={{ color: "#555" }}> (ví dụ: </span>
            <i>MH001</i>
            <span style={{ color: "#555" }}>)</span>
          </li>

          {/* <li>
            <b style={{ color: "#1677ff" }}>ma_gv</b> — Mã giáo viên ra đề
            <span style={{ color: "#555" }}> (ví dụ: </span>
            <i>GV001</i>
            <span style={{ color: "#555" }}>)</span>
          </li> */}

          <li>
            <b style={{ color: "#1677ff" }}>loai</b> — Loại câu hỏi
            <span style={{ color: "#555" }}> (ví dụ: </span>
            <i>chon_1, yes_no, dien_khuyet</i>
            <span style={{ color: "#555" }}>)</span>
          </li>

          <li>
            <b style={{ color: "#1677ff" }}>trinh_do</b> — Trình độ câu hỏi
            <span style={{ color: "#555" }}> (ví dụ: </span>
            <i>Đại học, Cao đẳng...</i>
            <span style={{ color: "#555" }}>)</span>
          </li>

          <li>
            <b style={{ color: "#1677ff" }}>chuong_so</b> — Số thứ tự chương
            trong giáo trình
          </li>

          <li>
            <b style={{ color: "#1677ff" }}>noi_dung</b> — Nội dung câu hỏi
            (phần đề)
          </li>

          <li>
            <b style={{ color: "#1677ff" }}>A, B, C, D</b> — Nội dung các đáp án
            lựa chọn
          </li>

          <li>
            <b style={{ color: "#1677ff" }}>dap_an_dung</b> — Chọn 1 trong các
            giá trị <b>A, B, C</b> hoặc <b>D</b>.{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>
              (Không được để trống!)
            </span>
          </li>

          <li style={{ marginTop: "10px" }}>
            <div
              style={{
                background: "#fff7e6",
                border: "1px solid #ffd591",
                borderRadius: 8,
                padding: "10px 14px",
              }}
            >
              <b style={{ color: "#d46b08" }}>Lưu ý quan trọng:</b>
              <ul style={{ marginTop: 6, paddingLeft: 22 }}>
                <li>
                  <b>ma_mh</b>: phải tồn tại trong hệ thống.
                </li>
                <li>
                  <b>loai</b>: <i>chon_1</i>, <i>yes_no</i>, <i>dien_khuyet</i>
                </li>
                <li>
                  <b>trinh_do</b>: <i>ĐH</i>, <i>CĐ</i>, <i>VB2</i>
                </li>
                <li>
                  <b>chuong_so</b>: giá trị <i>số nguyên</i>
                </li>
              </ul>

              <b style={{ color: "#d46b08" }}>Hướng dẫn theo loại câu hỏi:</b>
              <ul style={{ marginTop: 6, paddingLeft: 22 }}>
                <li>
                  <b>chon_1:</b> nhập các lựa chọn vào cột <b>A, B, C, D</b> và{" "}
                  <b>dap_an_dung</b> chỉ được nhập <b>A</b>, <b>B</b>, <b>C</b>,{" "}
                  <b>D</b>.
                </li>
                <li>
                  <b>yes_no:</b> chỉ nhập “<i>YES</i>” hoặc “<i>NO</i>” vào{" "}
                  <b>dap_an_dung</b>, để trống các cột <b>A, B, C, D</b>.
                </li>
                <li>
                  <b>dien_khuyet:</b> chỉ nhập nội dung câu trả lời vào{" "}
                  <b>dap_an_dung</b>, để trống các cột <b>A, B, C, D</b>.
                </li>
              </ul>
            </div>
          </li>
        </ul>

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
