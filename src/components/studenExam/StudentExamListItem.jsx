import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal } from "antd";
import { Tag } from "antd";

import { EyeOutlined } from "@ant-design/icons";
import ViewExamModal from "./examsDetail/ViewExamModal.jsx";
import StudentExamDetailModal from "./examsDetail/StudentExamDetailModal.jsx";
import CellDisplay from "../common/CellDisplay.jsx";
import hamChung from "../../services/service.hamChung.js";
import { createActions } from "../../redux/actions/factoryActions.js";
import { useDispatch } from "react-redux";
import ExamFullScreen from "./examsDetail/ExamFullScreen.jsx";
import { getUserInfo } from "../../globals/globals.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";

const actions = createActions("dang_ky_thi");

// ✅ Lấy page và pageSize từ URL
function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);
  let page = Number(query.get("page")) || 1;
  let pageSize = Number(query.get("pageSize")) || 10;
  return { page, pageSize };
}

const StudentExamListItem = ({ data = [] }) => {
  const dispatch = useDispatch();
  const [viewExamVisible, setViewExamVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  // detail modal state
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  // take exam state
  const [takeExamVisible, setTakeExamVisible] = useState(false);
  const [takeExamRecord, setTakeExamRecord] = useState(null);
  const [takeStudentInfo, setTakeStudentInfo] = useState(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(handleCheckPageParam().page);
  const [pageSize, setPageSize] = useState(handleCheckPageParam().pageSize);

  const total = Array.isArray(data) ? data.length : 0;
  const maxPage = Math.ceil(total / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), maxPage);

  useEffect(() => {
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }
  }, [validCurrentPage, currentPage]);

  const paginatedData = Array.isArray(data)
    ? data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize)
    : [];

  const openViewExam = (record) => {
    setSelected(record);
    setViewExamVisible(true);
  };

  const openDetail = (record) => {
    setDetailRecord(record);
    setDetailVisible(true);
  };

  const handleStartExamFromList = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn làm bài thi ngay bây giờ?",
      okText: "Bắt đầu",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          const accountId = getUserInfo()?.id_tai_khoan;
          if (!accountId) {
            message.error("Vui lòng đăng nhập để tiếp tục");
            return Promise.reject();
          }
          const userInfo = await hamChiTiet.getUserInfoByAccountId(accountId);
          if (!userInfo?.ma_sv) {
            message.error("Không tìm thấy thông tin sinh viên");
            return Promise.reject();
          }
          // open full screen exam
          setTakeExamRecord(record);
          setTakeStudentInfo(userInfo);
          setTakeExamVisible(true);
        } catch (e) {
          console.error(e);
          message.error("Không thể bắt đầu làm bài, vui lòng thử lại");
          return Promise.reject();
        }
      },
    });
  };

  const columns = [
    {
      title: "#",
      key: "idx",
      render: (_, __, i) => i + 1 + (validCurrentPage - 1) * pageSize,
    },
    {
      title: "Mã môn",
      dataIndex: "ma_mh",
    },
    {
      title: "Môn học",
      dataIndex: "ma_mh",
      render: (v) => <CellDisplay table="mon_hoc" id={v} fieldName="ten_mh" />,
    },
    // chỉ render ngày tháng năm
    {
      title: "Ngày thi",
      dataIndex: "ngay_thi",
      key: "ngay_thi",
      // width: 100,
      render: (value) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "-",
    },
    { title: "Thời gian (phút)", dataIndex: "thoi_gian", align: "center" },

    // <-- Thêm cột Điểm số ở đây
    {
      title: "Điểm số",
      dataIndex: "diem",
      align: "center",
      render: (v, record) => {
        const diem = record.thi_record?.diem;
        // nếu đã làm thì hiển thị điểm (nếu có), ngược lại hiện '---'
        return record.status_student === "da_lam"
          ? diem !== null && diem !== undefined
            ? diem
            : "---"
          : "---";
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status_student",
      align: "center",
      render: (v) => {
        let color = v === "da_lam" ? "green" : "volcano";
        let text = v === "da_lam" ? "Đã thi" : "Chưa thi";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "right",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* Nút xem chi tiết */}
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openDetail(record)}
            style={{ marginLeft: 8 }}
          >
          
          </Button>

          {/* Nút xem lại bài */}
          <Button
            size="small"
            type="primary"
            disabled={record.status_student !== "da_lam"}
            onClick={() => {
              if (record.status_student === "da_lam") {
                openViewExam(record);
              }
            }}
            style={{ marginLeft: 8 }}
          >
            Xem lại bài
          </Button>

          {/* Nút làm bài thi (màu cam) */}
          <Button
            size="small"
            type="primary"
            disabled={record.status_student !== "chua_lam"}
            onClick={() => handleStartExamFromList(record)}
            style={{
              marginLeft: 8,
              backgroundColor:
                record.status_student === "chua_lam" ? "#fa8c16" : undefined, // màu cam Ant Design
              borderColor:
                record.status_student === "chua_lam" ? "#fa8c16" : undefined,
            }}
          >
            Làm Bài Thi
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey={(r) => r.id_dang_ky_thi}
        columns={columns}
        dataSource={paginatedData}
        pagination={{
          current: validCurrentPage,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "15", "20", "50"],
          onChange: (page, newPageSize) => {
            setCurrentPage(page);
            setPageSize(newPageSize);
            const query = new URLSearchParams(window.location.search);
            query.set("page", page);
            query.set("pageSize", newPageSize);
            window.history.pushState(
              null,
              "",
              `${window.location.pathname}?${query.toString()}`
            );
          },
        }}
        locale={{ emptyText: "Không có dữ liệu" }}
      />

      <ViewExamModal
        visible={viewExamVisible}
        record={selected}
        onCancel={() => setViewExamVisible(false)}
      />

      <StudentExamDetailModal
        visible={detailVisible}
        record={detailRecord}
        onCancel={() => {
          setDetailVisible(false);
          setDetailRecord(null);
        }}
      />

      {/* Exam full screen when student confirms */}
      <ExamFullScreen
        visible={takeExamVisible}
        exam={takeExamRecord}
        student={takeStudentInfo}
        onClose={() => {
          setTakeExamVisible(false);
          setTakeExamRecord(null);
          setTakeStudentInfo(null);
        }}
      />
    </>
  );
};

export default StudentExamListItem;
