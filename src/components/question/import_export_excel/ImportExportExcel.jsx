import React, { useState } from "react";
import { Button, Upload, Select, message, Typography, Card, Space } from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import ImportExportGuide from "./ImportExportGuide.jsx";
import hamChung from "../../../services/service.hamChung.js";

const { Option } = Select;
const { Title } = Typography;

const ImportExportExcel = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [mode, setMode] = useState("import");
  const [selectedFile, setSelectedFile] = useState(null);
  const [importedData, setImportedData] = useState(null);

  // const validateFile = async (jsonData) => {
  //   if (!jsonData || jsonData.length === 0) {
  //     message.error("❌ File rỗng hoặc không có dữ liệu!");
  //     return false;
  //   }

  //   // 🔹 Cột bắt buộc
  //   const requiredColumns = [
  //     "ma_mh",
  //     "ma_gv",
  //     "trinh_do",
  //     "loai",
  //     "chuong_so",
  //     "noi_dung",
  //     "A",
  //     "B",
  //     "C",
  //     "D",
  //     "dap_an_dung",
  //   ];

  //   const firstRowKeys = Object.keys(jsonData[0]);
  //   for (const col of requiredColumns) {
  //     if (!firstRowKeys.includes(col)) {
  //       message.error(`⚠️ Thiếu cột bắt buộc: ${col}`);
  //       return false;
  //     }
  //   }

  //   // 🔹 Lấy dữ liệu tham chiếu (chỉ gọi 1 lần)
  //   let data_giaoVien, data_monHoc;
  //   try {
  //     data_giaoVien = await hamChung.getAll("giao_vien");
  //     data_monHoc = await hamChung.getAll("mon_hoc");
  //   } catch (error) {
  //     message.error("❌ Không thể tải dữ liệu giáo viên hoặc môn học!");
  //     console.error(error);
  //     return false;
  //   }

  //   const validMaGVs = data_giaoVien.map((gv) => gv.ma_gv);
  //   const validMaMHs = data_monHoc.map((mh) => mh.ma_mh);

  //   // 🔹 Duyệt từng dòng dữ liệu
  //   for (let i = 0; i < jsonData.length; i++) {
  //     const row = jsonData[i];
  //     const rowNum = i + 2; // +2 vì Excel có tiêu đề ở dòng 1

  //     // --- Kiểm tra mã môn học ---
  //     if (!validMaMHs.includes(row.ma_mh)) {
  //       message.error(
  //         `❌ Dòng ${rowNum}: Mã môn học '${row.ma_mh}' không tồn tại trong hệ thống!`
  //       );
  //       return false;
  //     }

  //     // --- Kiểm tra mã giáo viên ---
  //     if (!validMaGVs.includes(row.ma_gv)) {
  //       message.error(
  //         `❌ Dòng ${rowNum}: Mã giáo viên '${row.ma_gv}' không tồn tại trong hệ thống!`
  //       );
  //       return false;
  //     }

  //     // --- Kiểm tra trinh_do ---
  //     const validTrinhDo = ["CĐ", "VB2", "ĐH"];
  //     if (!validTrinhDo.includes(row.trinh_do)) {
  //       message.error(
  //         `❌ Dòng ${rowNum}: Giá trị 'trinh_do' không hợp lệ (${
  //           row.trinh_do
  //         }). Chỉ được: ${validTrinhDo.join(", ")}`
  //       );
  //       return false;
  //     }

  //     // --- Kiểm tra loai ---
  //     const validLoai = ["chon_1", "dien_khuyet", "yes_no"];
  //     if (!validLoai.includes(row.loai)) {
  //       message.error(
  //         `❌ Dòng ${rowNum}: Giá trị 'loai' không hợp lệ (${
  //           row.loai
  //         }). Chỉ được: ${validLoai.join(", ")}`
  //       );
  //       return false;
  //     }

  //     // --- Kiểm tra chuong_so ---
  //     if (isNaN(row.chuong_so) || !Number.isInteger(Number(row.chuong_so))) {
  //       message.error(`❌ Dòng ${rowNum}: 'chuong_so' phải là số nguyên!`);
  //       return false;
  //     }

  //     // --- Kiểm tra logic theo loại câu hỏi ---
  //     if (row.loai === "chon_1") {
  //       const validAnswers = ["A", "B", "C", "D"];
  //       if (!validAnswers.includes(row.dap_an_dung)) {
  //         message.error(
  //           `❌ Dòng ${rowNum}: 'dap_an_dung' phải là A, B, C, hoặc D cho loại 'chon_1'!`
  //         );
  //         return false;
  //       }

  //       const answerContent = row[row.dap_an_dung];
  //       if (!answerContent || answerContent.toString().trim() === "") {
  //         message.error(
  //           `⚠️ Dòng ${rowNum}: Ô '${row.dap_an_dung}' không được trống vì là đáp án đúng!`
  //         );
  //         return false;
  //       }

  //       if (!row.A && !row.B && !row.C && !row.D) {
  //         message.error(
  //           `⚠️ Dòng ${rowNum}: Cần có ít nhất 1 lựa chọn A, B, C, D!`
  //         );
  //         return false;
  //       }
  //     } else if (row.loai === "yes_no") {
  //       if (row.A || row.B || row.C || row.D) {
  //         message.error(
  //           `⚠️ Dòng ${rowNum}: Loại 'yes_no' không được có dữ liệu ở các cột A, B, C, D!`
  //         );
  //         return false;
  //       }
  //       if (
  //         !["YES", "NO"].includes(row.dap_an_dung?.toString().toUpperCase())
  //       ) {
  //         message.error(
  //           `❌ Dòng ${rowNum}: 'dap_an_dung' phải là YES hoặc NO cho loại 'yes_no'!`
  //         );
  //         return false;
  //       }
  //     } else if (row.loai === "dien_khuyet") {
  //       if (row.A || row.B || row.C || row.D) {
  //         message.error(
  //           `⚠️ Dòng ${rowNum}: Loại 'dien_khuyet' không được có dữ liệu ở A, B, C, D!`
  //         );
  //         return false;
  //       }
  //       if (!row.dap_an_dung || row.dap_an_dung.toString().trim() === "") {
  //         message.error(
  //           `❌ Dòng ${rowNum}: 'dap_an_dung' không được để trống!`
  //         );
  //         return false;
  //       }
  //     }
  //   }

  //   message.success("✅ File hợp lệ, sẵn sàng import!");
  //   return true;
  // };

  const validateFile = async (jsonData) => {
    if (!jsonData || jsonData.length === 0) {
      message.error("❌ File rỗng hoặc không có dữ liệu!");
      return false;
    }

    // 🧩 Log dữ liệu thô đọc được từ file
    console.log("📘 Dữ liệu đọc được từ file Excel:", jsonData);

    // 🔹 Cột bắt buộc
    const requiredColumns = [
      "ma_mh",
      "ma_gv",
      "trinh_do",
      "loai",
      "chuong_so",
      "noi_dung",
      "A",
      "B",
      "C",
      "D",
      "dap_an_dung",
    ];

    const firstRowKeys = Object.keys(jsonData[0]);
    for (const col of requiredColumns) {
      if (!firstRowKeys.includes(col)) {
        message.error(`⚠️ Thiếu cột bắt buộc: ${col}`);
        return false;
      }
    }

    // 🔹 Lấy dữ liệu tham chiếu (chỉ gọi 1 lần)
    let data_giaoVien, data_monHoc;
    try {
      data_giaoVien = await hamChung.getAll("giao_vien");
      data_monHoc = await hamChung.getAll("mon_hoc");
    } catch (error) {
      message.error("❌ Không thể tải dữ liệu giáo viên hoặc môn học!");
      console.error(error);
      return false;
    }

    const validMaGVs = data_giaoVien.map((gv) => gv.ma_gv);
    const validMaMHs = data_monHoc.map((mh) => mh.ma_mh);

    // 🔹 Duyệt từng dòng dữ liệu
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2; // +2 vì Excel có tiêu đề ở dòng 1

      // --- 🧩 Dừng khi tất cả cột đều trống ---
      const allEmpty = requiredColumns.every(
        (key) => !row[key] || row[key].toString().trim() === ""
      );
      if (allEmpty) {
        console.warn(`⏹ Dừng đọc tại dòng ${rowNum} (tất cả cột trống).`);
        break;
      }

      // --- Kiểm tra mã môn học ---
      if (!validMaMHs.includes(row.ma_mh)) {
        message.error(
          `❌ Dòng ${rowNum}: Mã môn học '${row.ma_mh}' không tồn tại!`
        );
        return false;
      }

      // --- Kiểm tra mã giáo viên ---
      if (!validMaGVs.includes(row.ma_gv)) {
        message.error(
          `❌ Dòng ${rowNum}: Mã giáo viên '${row.ma_gv}' không tồn tại!`
        );
        return false;
      }

      // --- Kiểm tra trình độ ---
      const validTrinhDo = ["CĐ", "VB2", "ĐH"];
      if (!validTrinhDo.includes(row.trinh_do)) {
        message.error(
          `❌ Dòng ${rowNum}: Giá trị 'trinh_do' không hợp lệ (${row.trinh_do})`
        );
        return false;
      }

      // --- Kiểm tra loại ---
      const validLoai = ["chon_1", "dien_khuyet", "yes_no"];
      if (!validLoai.includes(row.loai)) {
        message.error(
          `❌ Dòng ${rowNum}: Giá trị 'loai' không hợp lệ (${row.loai})`
        );
        return false;
      }

      // --- Nếu loại KHÔNG phải "chon_1" thì A, B, C, D phải để trống ---
      if (row.loai !== "chon_1") {
        const filledOptions = ["A", "B", "C", "D"].filter(
          (opt) => row[opt] && row[opt].toString().trim() !== ""
        );
        if (filledOptions.length > 0) {
          message.error(
            `❌ Dòng ${rowNum}: Vì 'loai' là '${row.loai}' nên các cột A, B, C, D phải để trống!`
          );
          return false;
        }
      }

      // --- Kiểm tra chương số ---
      if (isNaN(row.chuong_so) || !Number.isInteger(Number(row.chuong_so))) {
        message.error(`❌ Dòng ${rowNum}: 'chuong_so' phải là số nguyên!`);
        return false;
      }

      // --- Kiểm tra logic theo loại ---
      if (row.loai === "chon_1") {
        const validAnswers = ["A", "B", "C", "D"];
        if (!validAnswers.includes(row.dap_an_dung)) {
          message.error(
            `❌ Dòng ${rowNum}: 'dap_an_dung' phải là A, B, C, hoặc D!`
          );
          return false;
        }
      } else if (row.loai === "yes_no") {
        const answer = row.dap_an_dung?.toString().trim();
        if (!["Yes", "No"].includes(answer)) {
          message.error(
            `❌ Dòng ${rowNum}: 'dap_an_dung' phải là Yes hoặc No! (Giá trị hiện tại: ${row.dap_an_dung})`
          );
          return false;
        }
      } else if (row.loai === "dien_khuyet") {
        if (!row.dap_an_dung || row.dap_an_dung.toString().trim() === "") {
          message.error(
            `❌ Dòng ${rowNum}: 'dap_an_dung' không được để trống!`
          );
          return false;
        }
      }
    }

    // 🔄 Xử lý chuyển đáp án + gom nhóm
    const processedData = groupQuestionsBySubjectLevelTeacher(jsonData);

    console.log("✅ Dữ liệu hợp lệ đã đọc được:", jsonData);
    // 🧾 In ra kết quả sau xử lý
    console.log("🟢 Dữ liệu sau khi xử lý hoàn chỉnh:", processedData);

    message.success("✅ File hợp lệ, sẵn sàng import!");

    // 👉 Trả về dữ liệu đã xử lý
    return processedData;
  };

  // 🧩 Gom nhóm + Chuyển đổi đáp án đúng từ ký tự (A,B,C,D) sang nội dung thực tế
  // 🧩 Gom nhóm + chuyển A/B/C/D → chon_lua[] + ánh xạ đáp án đúng
  const groupQuestionsBySubjectLevelTeacher = (questions) => {
    if (!Array.isArray(questions) || questions.length === 0) return [];

    const grouped = questions.reduce((acc, q) => {
      const key = `${q.ma_mh}-${q.trinh_do}-${q.ma_gv}`;

      if (!acc[key]) {
        acc[key] = {
          ma_mh: q.ma_mh,
          trinh_do: q.trinh_do,
          ma_gv: q.ma_gv,
          questions: [],
        };
      }

      // 🧹 Tạo bản sao và loại bỏ ma_mh, trinh_do, ma_gv
      const { ma_mh, trinh_do, ma_gv, ...cleanedQuestion } = q;

      // 🧩 Nếu loại là "chon_1" → chuyển A,B,C,D thành mảng chon_lua
      if (cleanedQuestion.loai === "chon_1") {
        const options = ["A", "B", "C", "D"]
          .filter(
            (key) =>
              cleanedQuestion[key] !== undefined &&
              cleanedQuestion[key] !== null
          )
          .map((key) => ({
            noi_dung:
              typeof cleanedQuestion[key] === "string"
                ? cleanedQuestion[key].trim()
                : String(cleanedQuestion[key]),
          }));

        cleanedQuestion.chon_lua = options;

        // 🧩 Chuyển đáp án đúng từ ký tự sang nội dung thực tế (nếu có)
        if (["A", "B", "C", "D"].includes(cleanedQuestion.dap_an_dung)) {
          const selectedKey = cleanedQuestion.dap_an_dung;
          const actualValue = cleanedQuestion[selectedKey];
          if (actualValue !== undefined && actualValue !== null) {
            cleanedQuestion.dap_an_dung =
              typeof actualValue === "string"
                ? actualValue.trim()
                : String(actualValue);
          }
        }

        // 🧹 Xóa các key A,B,C,D để dữ liệu gọn gàng
        delete cleanedQuestion.A;
        delete cleanedQuestion.B;
        delete cleanedQuestion.C;
        delete cleanedQuestion.D;
      }

      acc[key].questions.push(cleanedQuestion);
      return acc;
    }, {});

    // 🧩 (Tùy chọn) Sắp xếp câu hỏi theo chương
    return Object.values(grouped).map((group) => ({
      ...group,
      questions: group.questions.sort(
        (a, b) => (a.chuong_so || 0) - (b.chuong_so || 0)
      ),
    }));
  };

  // ✅ Import
  const handleImport = (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setImportedData(jsonData);
        setSelectedFile(file);
        message.success(`📂 Đã chọn file: ${file.name}`);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      message.error("❌ Lỗi khi đọc file Excel!");
    }
    return false;
  };

  // ✅ Xác nhận import (multi-group)
const handleConfirmImport = async () => {
  if (!importedData) {
    message.warning("⚠️ Chưa có dữ liệu để import!");
    return;
  }

  try {
    // 🔹 Chờ validateFile() kiểm tra xong trước khi thông báo
    const processedGroups = await validateFile(importedData);

    if (!processedGroups || processedGroups.length === 0) {
      message.error("❌ Dữ liệu sau khi xử lý không hợp lệ hoặc trống!");
      return;
    }

    // 🔹 Gọi API multi-group
    const res = await hamChung.createMultiGroupListQuestionGroups(processedGroups);
    console.log("Kết quả import từ server:", res);

    if (res.success) {
      message.success(res.message || "✅ Import nhiều nhóm câu hỏi thành công!");
      setSelectedFile(null);
      setImportedData(null);
    } else {
      message.error(res.message || "❌ Import thất bại!");
    }
  } catch (error) {
    console.error("❌ Lỗi khi import:", error);
    message.error(error.message || "❌ Lỗi khi import nhiều nhóm câu hỏi!");
  }
};


  // ✅ Export
  const handleExport = () => {
    if (!importedData) {
      message.warning("⚠️ Vui lòng import dữ liệu trước khi export!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(importedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dữ liệu");
    const exportFileName = selectedFile
      ? `Export_${selectedFile.name}`
      : "ExportData.xlsx";
    XLSX.writeFile(workbook, exportFileName);
    message.success("✅ Xuất file Excel thành công!");
  };

  // ✅ Chọn file / export
  const handleSelectClick = () => {
    if (mode === "export") {
      handleExport();
    } else {
      document.getElementById("hiddenUploadInput").click();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Card
        style={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
        styles={{
          body: {
            padding: "24px",
          },
        }}
      >
        {/* === Hàng 1: Hướng dẫn & Select === */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setIsGuideOpen(true)}
          >
            Hướng dẫn Import / Export
          </Button>

          <Select
            value={mode}
            style={{ width: 180 }}
            onChange={(value) => {
              setMode(value);
              setSelectedFile(null);
              setImportedData(null);
            }}
          >
            <Option value="import">Import từ Excel</Option>
            <Option value="export">Export ra Excel</Option>
          </Select>
        </div>

        {/* Upload ẩn */}
        <Upload
          id="hiddenUploadInput"
          beforeUpload={handleImport}
          showUploadList={false}
          style={{ display: "none" }}
        >
          <div />
        </Upload>

        {/* === Hàng 2: Chọn file & Nút OK === */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Button
            type="primary"
            icon={
              mode === "import" ? <FileExcelOutlined /> : <DownloadOutlined />
            }
            onClick={handleSelectClick}
          >
            {mode === "import"
              ? selectedFile
                ? selectedFile.name.length > 20
                  ? selectedFile.name.slice(0, 20) + "..."
                  : selectedFile.name
                : "Chọn file Excel"
              : "Thực hiện Export"}
          </Button>

          {mode === "import" && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleConfirmImport}
              disabled={!selectedFile}
            >
              OK để Import
            </Button>
          )}
        </div>
      </Card>

      {/* Modal hướng dẫn */}
      <ImportExportGuide
        open={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};

export default ImportExportExcel;
