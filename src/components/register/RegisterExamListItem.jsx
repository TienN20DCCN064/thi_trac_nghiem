// RegisterExamListItem.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

// Lấy page & pageSize từ URL, nếu không có thì mặc định
function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);
  let page = Number(query.get("page")) || 1;
  let pageSize = Number(query.get("pageSize")) || 10;

  // Đảm bảo page và pageSize là hợp lệ
  page = isNaN(page) || page < 1 ? 1 : page;
  pageSize = isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;

  return { page, pageSize };
}

const RegisterExamListItem = ({ data = [], onDeleteClick, onEditClick, onViewDetailClick }) => {
  const [currentPage, setCurrentPage] = useState(handleCheckPageParam().page);
  const [pageSize, setPageSize] = useState(handleCheckPageParam().pageSize);

  const total = data?.length || 0;

  // Đảm bảo currentPage không vượt quá số trang tối đa
  const maxPage = Math.ceil(total / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), maxPage);

  // Lắng nghe sự kiện popstate để cập nhật state khi URL thay đổi
  useEffect(() => {
    const handlePopState = () => {
      const { page, pageSize } = handleCheckPageParam();
      setCurrentPage(page);
      setPageSize(pageSize);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Cập nhật URL nếu currentPage không hợp lệ
  useEffect(() => {
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
      const query = new URLSearchParams(window.location.search);
      query.set("page", validCurrentPage);
      window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
    }
  }, [validCurrentPage, currentPage]);

  // Dữ liệu cho trang hiện tại
  const paginatedData = data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize);

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1 + (validCurrentPage - 1) * pageSize,
    },
    { title: "ID Đăng Ký", dataIndex: "id_dang_ky_thi", key: "id_dang_ky_thi" },
    { title: "Mã GV", dataIndex: "ma_gv", key: "ma_gv" },
    { title: "Mã lớp", dataIndex: "ma_lop", key: "ma_lop" },
    { title: "Mã môn", dataIndex: "ma_mh", key: "ma_mh" },
    {
      title: "Ngày thi",
      dataIndex: "ngay_thi",
      key: "ngay_thi",
      render: (value) => (value ? new Date(value).toLocaleString() : "-"),
    },
    { title: "Số câu thi", dataIndex: "so_cau_thi", key: "so_cau_thi" },
    { title: "Thời gian (phút)", dataIndex: "thoi_gian", key: "thoi_gian" },
    { title: "Trình độ", dataIndex: "trinh_do", key: "trinh_do" },
    {
      title: "Hành động",
      key: "action",
      align: "right",
      width: 150,
      render: (_, record) => (
        <div>
          <Button
            size="small"
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => onViewDetailClick(record.id_dang_ky_thi)}
            style={{ marginLeft: 8 }}
          />
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => onEditClick(record.id_dang_ky_thi)}
            style={{ marginLeft: 8 }}
          />
          <Button
            size="small"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Bạn có muốn xóa đăng ký thi này không?",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk() {
                  onDeleteClick(record.id_dang_ky_thi);
                },
              })
            }
            style={{ marginLeft: 8 }}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="id_dang_ky_thi"
      columns={columns}
      dataSource={paginatedData}
      pagination={{
        current: validCurrentPage,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: ["10", "15", "20", "50"],
        showQuickJumper: false,
        onChange: (page, newPageSize) => {
          setCurrentPage(page);
          setPageSize(newPageSize);
          const query = new URLSearchParams(window.location.search);
          query.set("page", page);
          query.set("pageSize", newPageSize);
          window.history.pushState(null, "", `${window.location.pathname}?${query.toString()}`);
        },
      }}
      style={{ width: "100%" }}
      tableLayout="fixed"
    />
  );
};

export default RegisterExamListItem;