import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import {
  EyeOutlined,
} from "@ant-design/icons";
import ViewExamModal from "./examsDetail/ViewExamModal.jsx";
import StudentExamDetailModal from "./examsDetail/StudentExamDetailModal.jsx";
import CellDisplay from "../common/CellDisplay.jsx";
import hamChung from "../../services/service.hamChung.js";
import { createActions } from "../../redux/actions/factoryActions.js";
import { useDispatch } from "react-redux";

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
  const [viewExamVisible, setViewExamVisible] = useState(false); // renamed from cancelModalVisible
  const [selected, setSelected] = useState(null);
  
  // detail modal state
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

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
    { title: "Ngày thi", dataIndex: "ngay_thi",  key: "ngay_thi",
      // width: 100,
      render: (value) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "-",
    },
    { title: "Thời gian (phút)", dataIndex: "thoi_gian", align: "center" },
    {
      title: "Trạng thái",
      dataIndex: "status_student",
      align: "center",
      render: (v) => (v === "da_lam" ? "Đã làm" : "Chưa làm"),
    },
    {
      title: "Hành động",
      key: "action",
      align: "right", 
      render: (_, record) => (
        <div>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openDetail(record)}
            style={{ marginLeft: 8 }}
          >
            {/* Xem chi tiết */}
          </Button>

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
    </>
  );
};

export default StudentExamListItem;
