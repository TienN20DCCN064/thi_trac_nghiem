import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createActions } from "../../redux/actions/factoryActions.js";

const khoaSubjectActions = createActions("khoa");

const KhoaListItem = ({ data = [], onDataChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({ ma_khoa: "", ten_khoa: "" });

  // Hàm lấy tham số phân trang từ URL
  const handleCheckPageParam = () => {
    const query = new URLSearchParams(window.location.search);
    let page = Number(query.get("page")) || 1;
    let pageSize = Number(query.get("pageSize")) || 10;
    return { page, pageSize };
  };

  // Cập nhật phân trang từ URL khi mount
  useEffect(() => {
    const { page, pageSize: newPageSize } = handleCheckPageParam();
    setCurrentPage(page);
    setPageSize(newPageSize);
  }, []);

  // Xử lý phân trang
  const total = Array.isArray(data) ? data.length : 0;
  const maxPage = Math.ceil(total / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), maxPage);
  const paginatedData = Array.isArray(data)
    ? data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize)
    : [];

  // Xử lý khi submit form
  const handleSubmit = () => {
    if (!formData.ma_khoa || !formData.ten_khoa) {
      message.error("Vui lòng nhập đầy đủ mã khoa và tên khoa!");
      return;
    }

    const payload = {
      ma_khoa: formData.ma_khoa,
      ten_khoa: formData.ten_khoa,
    };

    if (modalMode === "create") {
      dispatch(
        khoaSubjectActions.creators.createRequest(payload, (res) => {
          if (res.success) {
            message.success(res.message || "Thêm khoa thành công!");
            setModalVisible(false);
            setFormData({ ma_khoa: "", ten_khoa: "" });
            onDataChange(); // tải lại dữ liệu sau khi tạo thành công
          } else {
            message.error(res.message || "Thêm khoa thất bại!");
          }
        })
      );
    } else if (modalMode === "edit") {
      dispatch(
        khoaSubjectActions.creators.updateRequest(
          formData.ma_khoa,
          payload,
          (res) => {
            if (res.success) {
              message.success(res.message || "Cập nhật khoa thành công!");
              setModalVisible(false);
              setFormData({ ma_khoa: "", ten_khoa: "" });
              onDataChange(); // tải lại dữ liệu sau khi cập nhật thành công
            } else {
              message.error(res.message || "Cập nhật khoa thất bại!");
            }
          }
        )
      );
    }
  };

  // Xử lý xóa
  const handleDelete = (record) => {
    dispatch(
      khoaSubjectActions.creators.deleteRequest(record.ma_khoa, (res) => {
        if (res.success) {
          message.success(res.message || "Xóa khoa thành công!");
          onDataChange(); // tải lại dữ liệu sau khi xóa thành công
        } else {
          message.error(res.message || "Xóa khoa thất bại!");
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
      title: "Mã Khoa",
      dataIndex: "ma_khoa",
      key: "ma_khoa",
    },
    {
      title: "Tên Khoa",
      dataIndex: "ten_khoa",
      key: "ten_khoa",
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
                ma_khoa: record.ma_khoa,
                ten_khoa: record.ten_khoa,
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
                title: "Bạn có muốn xóa khoa này không?",
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
            setFormData({ ma_khoa: "", ten_khoa: "" });
            setModalMode("create");
            setModalVisible(true);
          }}
        >
          Thêm Khoa
        </Button>
      </div>

      <Table
        rowKey={(record) => record.ma_khoa}
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
            ? "Thêm Khoa"
            : modalMode === "edit"
            ? "Sửa Khoa"
            : "Chi tiết Khoa"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFormData({ ma_khoa: "", ten_khoa: "" });
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
                    setFormData({ ma_khoa: "", ten_khoa: "" });
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
              <b>Mã khoa:</b> {selectedRecord?.ma_khoa}
            </p>
            <p>
              <b>Tên khoa:</b> {selectedRecord?.ten_khoa}
            </p>
          </div>
        )}
        {(modalMode === "create" || modalMode === "edit") && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Mã khoa
              </label>
              <Input
                value={formData.ma_khoa}
                onChange={(e) =>
                  setFormData({ ...formData, ma_khoa: e.target.value })
                }
                disabled={modalMode === "edit"}
                placeholder="Nhập mã khoa"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Tên khoa
              </label>
              <Input
                value={formData.ten_khoa}
                onChange={(e) =>
                  setFormData({ ...formData, ten_khoa: e.target.value })
                }
                placeholder="Nhập tên khoa"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default KhoaListItem;
