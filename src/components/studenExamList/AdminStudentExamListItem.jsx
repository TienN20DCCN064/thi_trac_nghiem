import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import ViewExamModal from "../studenExam/examsDetail/ViewExamModal.jsx";
import StudentExamDetailModal from "../studenExam/examsDetail/StudentExamDetailModal.jsx";
import CellDisplay from "../common/CellDisplay.jsx";
import { getUserInfo } from "../../globals/globals.js";

const AdminStudentExamListItem = ({ data = [] }) => {
  console.log("AdminStudentExamListItem data:", data);
  const [viewExamVisible, setViewExamVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = Array.isArray(data) ? data.length : 0;
  const maxPage = Math.ceil(total / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), maxPage);

  useEffect(() => {
    if (validCurrentPage !== currentPage) setCurrentPage(validCurrentPage);
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

  const userInfo = getUserInfo();
  const isGiaoVu = userInfo?.vai_tro === "GiaoVu";

  const baseColumns = [
    {
      title: "#",
      key: "idx",
      render: (_, __, i) => i + 1 + (validCurrentPage - 1) * pageSize,
    },
    {
      title: "Môn học",
      dataIndex: "ma_mh",
      render: (v) => <CellDisplay table="mon_hoc" id={v} fieldName="ten_mh" />,
    },
    {
      title: "Lớp học",
      dataIndex: "ma_lop",
      render: (v) => <CellDisplay table="lop" id={v} fieldName="ten_lop" />,
    },
    { title: "Mã sinh viên", dataIndex: "sinh_vien" },
    {
      title: "Sinh viên",
      dataIndex: "sinh_vien",
      render: (v) =>
        v ? <CellDisplay table="sinh_vien" id={v} fieldName="ten_sv" /> : "-",
    },
    {
      title: "Ngày thi",
      dataIndex: "ngay_thi",
      render: (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "-"),
    },
    {
      title: "Điểm số",
      dataIndex: "diem",
      align: "center",
      render: (v, record) => {
        const diem = record.thi_record.diem;
        return diem !== null && diem !== undefined ? diem : "-";
      },
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
          />
          <Button
            size="small"
            type="primary"
            disabled={record.status_student !== "da_lam"}
            onClick={() =>
              record.status_student === "da_lam" && openViewExam(record)
            }
            style={{ marginLeft: 8 }}
          >
            Xem lại bài
          </Button>
        </div>
      ),
    },
  ];

  // Thêm cột giáo viên nếu là GiaoVu
  const columns = isGiaoVu
    ? [
        ...baseColumns.slice(0, 5),
        {
          title: "Giáo viên",
          dataIndex: "ma_gv",
          render: (v) => <CellDisplay table="giao_vien" id={v} fieldName="ten_gv" />,
        },
        ...baseColumns.slice(5),
      ]
    : baseColumns;

  return (
    <>
      <Table
        rowKey={(r) => r.id_dang_ky_thi + r.sinh_vien}
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

export default AdminStudentExamListItem;
