import React, { useState } from "react";
import { Button, Upload, message, Typography, Card } from "antd";
import {
  InfoCircleOutlined,
  CheckOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import ImportExportGuide from "./ImportExportGuide.jsx";
import hamChung from "../../../services/service.hamChung.js";
import hamChiTiet from "../../../services/service.hamChiTiet.js";
import { getUserInfo } from "../../../globals/globals.js";
import { useDispatch } from "react-redux";
import { createActions } from "../../../redux/actions/factoryActions.js";

const teacherSubjectActions = createActions("cau_hoi");
const { Title } = Typography;

const ImportFileExcel = () => {
  const dispatch = useDispatch();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importedData, setImportedData] = useState(null);
    

  // ✅ Validate file
  const validateFile = async (jsonData) => {
    if (!jsonData || jsonData.length === 0) {
      message.error("❌ File rỗng hoặc không có dữ liệu!");
      return false;
    }

    console.log("📘 Dữ liệu đọc được từ file Excel:", jsonData);

    const requiredColumns = [
      "ma_mh",
      // "ma_gv",
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
    console.log("🔍 Cột trong file Excel:", firstRowKeys);

    // 🔹 Kiểm tra thiếu cột
    const missingColumns = [];
    for (const col of requiredColumns) {
      if (!firstRowKeys.includes(col)) {
        missingColumns.push(col);
      }
    }

    // 🔹 Kiểm tra thừa cột
    const extraColumns = [];
    for (const col of firstRowKeys) {
      if (!requiredColumns.includes(col)) {
        extraColumns.push(col);
      }
    }
    // 🔹 Báo lỗi nếu có
    if (missingColumns.length > 0) {
      message.error(`⚠️ Thiếu cột bắt buộc: ${missingColumns.join(", ")}`);
    }

    if (extraColumns.length > 0) {
      message.warning(`⚠️ Có cột không hợp lệ: ${extraColumns.join(", ")}`);
    }
    // 🔹 Nếu có lỗi thì không hợp lệ
    if (missingColumns.length > 0 || extraColumns.length > 0) {
      return false;
    }

    let data_monHoc;
    try {
      data_monHoc = await hamChung.getAll("mon_hoc");
    } catch (error) {
      message.error("❌ Không thể tải dữ liệu môn học!");
      console.error(error);
      return false;
    }

    const validMaMHs = data_monHoc.map((mh) => mh.ma_mh);

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2;
      // 👉 Gán thêm thuộc tính số dòng
      row.so_dong_trong_file_import = rowNum;
      // Kiểm tra nếu tất cả các cột đều trống thì dừng đọc
      const allEmpty = requiredColumns.every(
        (key) => !row[key] || row[key].toString().trim() === ""
      );
      if (allEmpty) {
        console.warn(`⏹ Dừng đọc tại dòng ${rowNum} (tất cả cột trống).`);
        break;
      }

      if (!validMaMHs.includes(row.ma_mh)) {
        message.error(
          `❌ Dòng ${rowNum}: Mã môn học '${row.ma_mh}' không tồn tại!`
        );
        return false;
      }

      const validTrinhDo = ["CĐ", "VB2", "ĐH"];
      if (!validTrinhDo.includes(row.trinh_do)) {
        message.error(
          `❌ Dòng ${rowNum}: 'trinh_do' không hợp lệ (${row.trinh_do})`
        );
        return false;
      }

      const validLoai = ["chon_1", "dien_khuyet", "yes_no"];
      if (!validLoai.includes(row.loai)) {
        message.error(`❌ Dòng ${rowNum}: 'loai' không hợp lệ (${row.loai})`);
        return false;
      }

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

      if (isNaN(row.chuong_so) || !Number.isInteger(Number(row.chuong_so))) {
        message.error(`❌ Dòng ${rowNum}: 'chuong_so' phải là số nguyên!`);
        return false;
      }

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
            `❌ Dòng ${rowNum}: 'dap_an_dung' phải là Yes hoặc No!`
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

    const processedData = groupQuestionsBySubjectLevelTeacher(jsonData);
    console.log("✅ File hợp lệ, dữ liệu sau xử lý:", processedData);
    message.success("✅ File hợp lệ, sẵn sàng import!");
    return processedData;
  };

  const groupQuestionsBySubjectLevelTeacher = async (questions) => {
    if (!Array.isArray(questions) || questions.length === 0) return [];
    const userInfo = await hamChiTiet.getUserInfoByAccountId(
      getUserInfo().id_tai_khoan
    );

    const grouped = questions.reduce((acc, q) => {
      q.ma_gv = userInfo.ma_gv;
      const key = `${q.ma_mh}-${q.trinh_do}-${q.ma_gv}`;

      if (!acc[key]) {
        acc[key] = {
          ma_mh: q.ma_mh,
          trinh_do: q.trinh_do,
          ma_gv: q.ma_gv,
          questions: [],
        };
      }

      const { ma_mh, trinh_do, ma_gv, ...cleanedQuestion } = q;

      if (cleanedQuestion.loai === "chon_1") {
        const options = ["A", "B", "C", "D"]
          .filter((key) => cleanedQuestion[key] !== undefined)
          .map((key) => ({ noi_dung: String(cleanedQuestion[key]).trim() }));

        cleanedQuestion.chon_lua = options;

        if (["A", "B", "C", "D"].includes(cleanedQuestion.dap_an_dung)) {
          const selectedKey = cleanedQuestion.dap_an_dung;
          const actualValue = cleanedQuestion[selectedKey];
          if (actualValue !== undefined && actualValue !== null) {
            cleanedQuestion.dap_an_dung = String(actualValue).trim();
          } else {
            cleanedQuestion.dap_an_dung = "";
          }
        }

        delete cleanedQuestion.A;
        delete cleanedQuestion.B;
        delete cleanedQuestion.C;
        delete cleanedQuestion.D;
      }

      acc[key].questions.push(cleanedQuestion);
      return acc;
    }, {});

    return Object.values(grouped).map((group) => ({
      ...group,
      questions: group.questions.sort(
        (a, b) => (a.chuong_so || 0) - (b.chuong_so || 0)
      ),
    }));
  };

  // ✅ Import file Excel
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

  // ✅ Xác nhận import
  const handleConfirmImport = async () => {
    if (!importedData) {
      message.warning("⚠️ Chưa có dữ liệu để import!");
      return;
    }

    try {
      const processedGroups = await validateFile(importedData);
      if (!processedGroups || processedGroups.length === 0) {
        message.error("❌ Dữ liệu sau khi xử lý không hợp lệ hoặc trống!");
        return;
      }
      console.log("🚀 Dữ liệu nhóm câu hỏi sau xử lý:", processedGroups);

      // 🧩 Bước 1: Kiểm tra trùng trước khi import
      const checkRes = await hamChung.checkDuplicateGroupQuestions(
        processedGroups
      );
      console.log("Kết quả kiểm tra trùng từ server:", checkRes);
      if (!checkRes.success) {
        // Nếu server trả về danh sách dòng trùng
        if (checkRes.duplicatedRows && checkRes.duplicatedRows.length > 0) {
          message.error(
            `⚠️ Có ${
              checkRes.duplicatedRows.length
            } dòng bị trùng trong CSDL! (Dòng: ${checkRes.duplicatedRows.join(
              ", "
            )})`
          );
          return; // Dừng lại, không import
        } else {
          message.error(checkRes.message || "❌ Lỗi khi kiểm tra trùng!");
          return;
        }
      }
      // 🧩 Bước 2: Thực hiện import
      const res = await hamChung.createMultiGroupListQuestionGroups(
        processedGroups
      );
      console.log("Kết quả import từ server:", res);

      if (res.success) {
        message.success(
          res.message || "✅ Import nhiều nhóm câu hỏi thành công!"
        );
        dispatch(teacherSubjectActions.creators.fetchAllRequest());
        setSelectedFile(null);
        setImportedData(null);
      } else {
        message.error(res.message || "❌ Import thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi import:", error);
      message.error(error.message || "❌ Lỗi khi import!");
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
          body: { padding: "24px" },
        }}
      >
        {/* === Hàng 1: Hướng dẫn === */}
        <div style={{ marginBottom: 20, textAlign: "left" }}>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setIsGuideOpen(true)}
          >
            Hướng dẫn Import
          </Button>
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

        {/* === Hàng 2: Chọn file & Import === */}
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
            icon={<FileExcelOutlined />}
            onClick={() => document.getElementById("hiddenUploadInput").click()}
          >
            {selectedFile
              ? selectedFile.name.length > 20
                ? selectedFile.name.slice(0, 20) + "..."
                : selectedFile.name
              : "Chọn file Excel"}
          </Button>

          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleConfirmImport}
            disabled={!selectedFile}
          >
            OK để Import
          </Button>
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

export default ImportFileExcel;
