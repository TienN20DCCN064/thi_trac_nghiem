import React, { useState } from "react";
import { Table, Button, Modal, Input, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createActions } from "../../redux/actions/factoryActions.js";

const teacherAccoutActions = createActions("tai_khoan_giao_vien");

const TeacherAccoutsListItem = ({ data = [], onDataChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    id_tai_khoan: "",
    ma_gv: "",
  });

  // Pagination
  const total = Array.isArray(data) ? data.length : 0;
  const maxPage = Math.ceil(total / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), maxPage);
  const paginatedData = Array.isArray(data)
    ? data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize)
    : [];


  // Submit
  const handleSubmit = () => {
    if (!formData.id_tai_khoan || !formData.ma_gv) {
      message.error("Vui lòng nhập đầy đủ ID tài khoản và mã giáo viên!");
      return;
    }

    const payload = {
      id_tai_khoan: formData.id_tai_khoan,
      ma_gv: formData.ma_gv,
    };

    if (modalMode === "create") {
      dispatch(
        teacherAccoutActions.creators.createRequest(payload, (res) => {
          if (res.success) {
            message.success(res.message || "Thêm tài khoản thành công!");
            setModalVisible(false);
            setFormData({ id_tai_khoan: "", ma_gv: "" });
            onDataChange();
          } else {
            message.error(res.message || "Thêm tài khoản thất bại!");
          }
        })
      );
    } else if (modalMode === "edit") {
      dispatch(
        teacherAccoutActions.creators.updateRequest(
          formData.id_tai_khoan,
          payload,
          (res) => {
            if (res.success) {
              message.success(res.message || "Cập nhật tài khoản thành công!");
              setModalVisible(false);
              setFormData({ id_tai_khoan: "", ma_gv: "" });
              onDataChange();
            } else {
              message.error(res.message || "Cập nhật tài khoản thất bại!");
            }
          }
        )
      );
    }
  };

  // Delete
  const handleDelete = (record) => {
    dispatch(
      teacherAccoutActions.creators.deleteRequest(record.id_tai_khoan, (res) => {
        if (res.success) {
          message.success(res.message || "Xóa tài khoản thành công!");
          onDataChange();
        } else {
          message.error(res.message || "Xóa tài khoản thất bại!");
        }
      })
    );
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 50,
      align: "center",
      render: (_, __, index) => index + 1 + (validCurrentPage - 1) * pageSize,
    },
    {
      title: "ID Tài Khoản",
      dataIndex: "id_tai_khoan",
      key: "id_tai_khoan",
    },
    {
      title: "Mã Giáo Viên",
      dataIndex: "ma_gv",
      key: "ma_gv",
    },
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
            onClick={() => {
              setSelectedRecord(record);
              setModalMode("view");
              setModalVisible(true);
            }}
            style={{ marginLeft: 8 }}
          />
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setFormData({
                id_tai_khoan: record.id_tai_khoan,
                ma_gv: record.ma_gv,
              });
              setModalMode("edit");
              setModalVisible(true);
            }}
            style={{ marginLeft: 8 }}
          />
          <Button
            size="small"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Bạn có muốn xóa tài khoản này không?",
                okText: "Có",
                okType: "danger",
                cancelText: "Không",
                onOk() {
                  handleDelete(record);
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
    <>
      <div style={{ marginBottom: 10, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedRecord(null);
            setFormData({ id_tai_khoan: "", ma_gv: "" });
            setModalMode("create");
            setModalVisible(true);
          }}
        >
          Thêm Tài Khoản
        </Button>
      </div>

      <Table
        rowKey={(record) => record.id_tai_khoan}
        columns={columns}
        dataSource={paginatedData}
        locale={{ emptyText: "Không có dữ liệu" }}
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
        style={{ width: "100%" }}
        tableLayout="fixed"
      />

      <Modal
        title={
          modalMode === "create"
            ? "Thêm Tài Khoản"
            : modalMode === "edit"
            ? "Sửa Tài Khoản"
            : "Chi tiết Tài Khoản"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFormData({ id_tai_khoan: "", ma_gv: "" });
        }}
        footer={
          modalMode === "view"
            ? [
                <Button key="cancel" onClick={() => setModalVisible(false)}>
                  Đóng
                </Button>,
              ]
            : [
                <Button
                  key="cancel"
                  onClick={() => {
                    setModalVisible(false);
                    setFormData({ id_tai_khoan: "", ma_gv: "" });
                  }}
                >
                  Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                  Lưu
                </Button>,
              ]
        }
      >
        {modalMode === "view" && (
          <div>
            <p>
              <b>ID tài khoản:</b> {selectedRecord?.id_tai_khoan}
            </p>
            <p>
              <b>Mã giáo viên:</b> {selectedRecord?.ma_gv}
            </p>
          </div>
        )}
        {(modalMode === "create" || modalMode === "edit") && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                ID tài khoản
              </label>
              <Input
                value={formData.id_tai_khoan}
                onChange={(e) =>
                  setFormData({ ...formData, id_tai_khoan: e.target.value })
                }
                disabled={modalMode === "edit"}
                placeholder="Nhập ID tài khoản"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Mã giáo viên
              </label>
              <Input
                value={formData.ma_gv}
                onChange={(e) =>
                  setFormData({ ...formData, ma_gv: e.target.value })
                }
                placeholder="Nhập mã giáo viên"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TeacherAccoutsListItem;