import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import RegisterExamDetailModal from "./RegisterExamDetailModal.jsx";

// Lấy page & pageSize từ URL, nếu không có thì mặc định
function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);
  let page = Number(query.get("page")) || 1;
  let pageSize = Number(query.get("pageSize")) || 10;
  let ma_lop = query.get("ma_lop") || "";
  let ma_mh = query.get("ma_mh") || "";
  console.log("URL Params - page:", page, "pageSize:", pageSize, "ma_lop:", ma_lop, "ma_mh:", ma_mh);

  // Đảm bảo page và pageSize là hợp lệ
  page = isNaN(page) || page < 1 ? 1 : page;
  pageSize = isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;

  return { page, pageSize };
}

const RegisterExamListItem = ({
  data = [],
  onDeleteClick,
  // onEditClick,
  // onViewDetailClick,
}) => {
  console.log("Render RegisterExamListItem with data:", data);

  const [currentPage, setCurrentPage] = useState(handleCheckPageParam().page);
  const [pageSize, setPageSize] = useState(handleCheckPageParam().pageSize);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // Thêm state cho mode
  const [mode, setMode] = useState("view");

  const total = Array.isArray(data) ? data.length : 0;

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
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${query.toString()}`
      );
    }
  }, [validCurrentPage, currentPage]);

  // Xử lý khi click "Xem chi tiết"
  // Trong RegisterExamListItem.jsx
  const handleViewDetailClick = (status, id) => {
    console.log("Xem chi tiết đăng ký thi ID:", id);
    console.log("Trạng thái đăng ký thi:", status);
    setSelectedId(id);
    setDetailModalVisible(true);
    setMode(status); // Thêm state để lưu mode
  };

  // Dữ liệu cho trang hiện tại
  const paginatedData = Array.isArray(data)
    ? data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize)
    : [];

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1 + (validCurrentPage - 1) * pageSize,
    },
    // { title: "ID Đăng Ký", dataIndex: "id_dang_ky_thi", key: "id_dang_ky_thi" },
    { title: "Mã GV", dataIndex: "ma_gv", key: "ma_gv" },
    { title: "Mã Lớp", dataIndex: "ma_lop", key: "ma_lop" },
    { title: "Mã Môn", dataIndex: "ma_mh", key: "ma_mh" },
    { title: "Trình Độ", dataIndex: "trinh_do", key: "trinh_do" },
    {
      title: "Ngày Thi",
      dataIndex: "ngay_thi",
      key: "ngay_thi",
      render: (value) =>
        value ? new Date(value).toLocaleString("vi-VN") : "-",
    },
    { title: "Số Câu Thi", dataIndex: "so_cau_thi", key: "so_cau_thi" },
    { title: "Thời Gian (phút)", dataIndex: "thoi_gian", key: "thoi_gian" },

    {
      title: "Trạng Thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (value) => {
        if (!value) return "-";

        let color = "default";
        let text = value;

        switch (value) {
          case "Cho_phe_duyet":
            color = "orange";
            text = "Chờ Duyệt";
            break;
          case "Da_phe_duyet":
            color = "green";
            text = "Đã Duyệt";
            break;
          case "Tu_choi":
            color = "red";
            text = "Từ Chối";
            break;
          default:
            color = "gray";
            text = value;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Người Phê Duyệt",
      dataIndex: "nguoi_phe_duyet",
      key: "nguoi_phe_duyet",
      render: (value) => value || "-",
    },
    {
      title: "Hành Động",
      key: "action",
      align: "right",
      width: 150,
      render: (_, record) => {
        const isEditable = record.trang_thai === "Cho_phe_duyet"; // Chỉ mở khi Chờ Duyệt

        return (
          <div>
            {/* Nút Xem luôn mở */}
            <Button
              size="small"
              type="primary"
              icon={<EyeOutlined />}
              onClick={() =>
                handleViewDetailClick("view", record.id_dang_ky_thi)
              }
              style={{ marginLeft: 8 }}
            />

            {/* Nút Edit */}
            <Button
              size="small"
              type="dashed"
              icon={<EditOutlined />}
              // onClick={() => onEditClick(record.id_dang_ky_thi)}
              onClick={() =>
                handleViewDetailClick("edit", record.id_dang_ky_thi)
              }
              disabled={!isEditable} // Khóa nếu không Chờ Duyệt
              style={{ marginLeft: 8 }}
            />

            {/* Nút Delete */}
            <Button
              size="small"
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() =>
                Modal.confirm({
                  title: "Bạn có muốn xóa đăng ký thi này không?",
                  okText: "Có",
                  okType: "danger",
                  cancelText: "Không",
                  onOk() {
                    onDeleteClick(record.id_dang_ky_thi);
                  },
                })
              }
              disabled={!isEditable} // Khóa nếu không Chờ Duyệt
              style={{ marginLeft: 8 }}
            />
            
          </div>
          
        );
      },
    },
  ];

  return (
    <>
      <Table
        rowKey="id_dang_ky_thi"
        columns={columns}
        dataSource={paginatedData}
        locale={{ emptyText: "Không có dữ liệu đăng ký thi" }}
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
            window.history.pushState(
              null,
              "",
              `${window.location.pathname}?${query.toString()}`
            );
          },
        }}
        style={{ width: "100%" }}
        tableLayout="fixed"
      />
      <RegisterExamDetailModal
        visible={detailModalVisible}
        id_dang_ky_thi={selectedId}
        mode={mode} // Truyền prop mode
        onCancel={() => {
          setDetailModalVisible(false);
          setMode("view"); // Reset mode về view khi đóng
        }}
      />
    </>
  );
};

export default RegisterExamListItem;
