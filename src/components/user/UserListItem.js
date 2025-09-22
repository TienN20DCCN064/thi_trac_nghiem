import React from "react";
import { Button, Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as api from '../../api/users';
import "../../style/UserEdit.css";   // ✅ import CSS riêng

function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);

  if (query.get("page") === null || query.get("pageSize") === null) {
    query.set("page", 1);
    query.set("pageSize", 10);
    const newUrl = window.location.pathname + "?" + query.toString();
    window.history.replaceState(null, "", newUrl);
    return { page: 1, pageSize: 10 };
  } else {
    return {
      page: Number(query.get("page")) || 1,
      pageSize: Number(query.get("pageSize")) || 10,
    };
  }
}

const UserListItem = ({ data, onDeleteClick, onEditClick, currentPage, onPageChange, pageSize, total, totalPages }) => {
  handleCheckPageParam();
  console.log("data in UserListItem:", data);

  const handleTableChange = (pagination) => {
    // Cập nhật URL khi đổi trang hoặc pageSize
    const query = new URLSearchParams(window.location.search);
    query.set("page", pagination.current);
    query.set("pageSize", pagination.pageSize);
    const newUrl = window.location.pathname + "?" + query.toString();
    window.history.replaceState(null, "", newUrl);

    if (onPageChange) {
      onPageChange(pagination.current, pagination.pageSize);
    }
  };

  const stringToHslColor = (str = "") => {

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h},60%,80%)`;
  };


  const columns = [
    {
      title: "#",
      key: "image",
      align: "center",
      width: 80,
      render: (_, record) => (
        <div className="avatar-container">
          {record.image ? (
            <img
              src={record.image}
              alt={record.fullName}
              className="user-avatar"
            />
          ) : (
            <div
              className="user-avatar-default"
              style={{ background: stringToHslColor(record.fullName) }}
            >
              {record.fullName ? record.fullName[0].toUpperCase() : ""}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Họ Và Tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "left",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "userName",
      key: "userName",
      align: "left",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Quyền",
      dataIndex: "roleId",
      key: "role",
      align: "center",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Hoạt Động",
      key: "action",
      align: "right",
      width: "15%",
      render: (_, record) => (
        <div className="user-actions">
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => onEditClick({ userId: record.id })}
          />
          <Button
            size="small"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Bạn có muốn xóa không?",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk() {
                  onDeleteClick(record.id);
                },
              })
            }
          />
        </div>
      ),
    },
  ];



  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}

      pagination={{
        current: currentPage,
        pageSize,
        total,
        showSizeChanger: false, // ❌ tắt dropdown chọn số bản ghi
        itemRender: (page, type, originalElement) => {
          if (type === "page" && total <= pageSize && page === 1) {
            return null; // ẩn số 1 nếu chỉ có 1 trang
          }
          return originalElement;
        },
      }}
      onChange={handleTableChange}
      style={{ width: "100%" }}     // fit cha
      tableLayout="fixed"           // 👈 ép chia đều theo % width
    />
  );

};


export default UserListItem;
