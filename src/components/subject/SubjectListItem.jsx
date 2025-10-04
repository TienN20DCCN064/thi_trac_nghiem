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

const subjectActions = createActions("mon_hoc");

const SubjectListItem = ({ data = [], onDataChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    ma_mh: "",
    ten_mh: "",
  });

  const total = Array.isArray(data) ? data.length : 0;
  const maxPage = Math.ceil(total / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), maxPage);
  const paginatedData = Array.isArray(data)
    ? data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize)
    : [];

  const handleSubmit = async () => {
    if (!formData.ma_mh || !formData.ten_mh) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const payload = {
        ma_mh: formData.ma_mh,
        ten_mh: formData.ten_mh,
      };
      if (modalMode === "create") {
        await dispatch(subjectActions.creators.createRequest(payload));
        message.success("Thêm môn học thành công!");
      } else if (modalMode === "edit") {
        await dispatch(
          subjectActions.creators.updateRequest(formData.ma_mh, payload)
        );
        message.success("Cập nhật môn học thành công!");
      }
      setModalVisible(false);
      setFormData({ ma_mh: "", ten_mh: "" });
      onDataChange();
    } catch (error) {
      message.error(`Lỗi: ${error.message}`);
    }
  };

  const handleDelete = async (record) => {
    try {
      await dispatch(subjectActions.creators.deleteRequest(record.ma_mh));
      message.success("Xóa môn học thành công!");
      onDataChange();
    } catch (error) {
      message.error(`Lỗi khi xóa môn học: ${error.message}`);
    }
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
      title: "Mã môn học",
      dataIndex: "ma_mh",
      key: "ma_mh",
    },
    {
      title: "Tên môn học",
      dataIndex: "ten_mh",
      key: "ten_mh",
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
                ma_mh: record.ma_mh,
                ten_mh: record.ten_mh,
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
                title: "Bạn có muốn xóa môn học này không?",
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
            setFormData({ ma_mh: "", ten_mh: "" });
            setModalMode("create");
            setModalVisible(true);
          }}
        >
          Thêm Môn Học
        </Button>
      </div>

      <Table
        rowKey={(record) => record.ma_mh}
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
            ? "Thêm Môn Học"
            : modalMode === "edit"
            ? "Sửa Môn Học"
            : "Chi tiết Môn Học"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFormData({ ma_mh: "", ten_mh: "" });
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
                    setFormData({ ma_mh: "", ten_mh: "" });
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
              <b>Mã môn học:</b> {selectedRecord?.ma_mh}
            </p>
            <p>
              <b>Tên môn học:</b> {selectedRecord?.ten_mh}
            </p>
          </div>
        )}
        {(modalMode === "create" || modalMode === "edit") && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Mã môn học
              </label>
              <Input
                value={formData.ma_mh}
                onChange={(e) =>
                  setFormData({ ...formData, ma_mh: e.target.value })
                }
                disabled={modalMode === "edit"}
                placeholder="Nhập mã môn học"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Tên môn học
              </label>
              <Input
                value={formData.ten_mh}
                onChange={(e) =>
                  setFormData({ ...formData, ten_mh: e.target.value })
                }
                placeholder="Nhập tên môn học"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SubjectListItem;