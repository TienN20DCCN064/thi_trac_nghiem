import React, { useState } from "react";
import { Table, Button, Modal, Input, Select, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createActions } from "../../redux/actions/factoryActions.js";
import CellDisplay from "../../components/common/CellDisplay.jsx";

const accoutActions = createActions("tai_khoan");

const vaiTroOptions = [
  { value: "GiaoVu", label: "Giáo Vụ" },
  { value: "GiaoVien", label: "Giáo Viên" },
  { value: "SinhVien", label: "Sinh Viên" },
];

const AccoutListItem = ({ data = [], onDataChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    id_tai_khoan: "",
    ten_dang_nhap: "",
    mat_khau: "",
    vai_tro: "",
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
    if (!formData.ten_dang_nhap || !formData.mat_khau || !formData.vai_tro) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const payload = {
      ten_dang_nhap: formData.ten_dang_nhap,
      mat_khau: formData.mat_khau,
      vai_tro: formData.vai_tro,
    };

    if (modalMode === "create") {
      dispatch(
        accoutActions.creators.createRequest(payload, (res) => {
          if (res.success) {
            message.success(res.message || "Thêm tài khoản thành công!");
            setModalVisible(false);
            setFormData({
              id_tai_khoan: "",
              ten_dang_nhap: "",
              mat_khau: "",
              vai_tro: "",
            });
            onDataChange();
          } else {
            message.error(res.message || "Thêm tài khoản thất bại!");
          }
        })
      );
    } else if (modalMode === "edit") {
      dispatch(
        accoutActions.creators.updateRequest(
          formData.id_tai_khoan,
          payload,
          (res) => {
            if (res.success) {
              message.success(res.message || "Cập nhật tài khoản thành công!");
              setModalVisible(false);
              setFormData({
                id_tai_khoan: "",
                ten_dang_nhap: "",
                mat_khau: "",
                vai_tro: "",
              });
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
      accoutActions.creators.deleteRequest(record.id_tai_khoan, (res) => {
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
      title: "Tên Đăng Nhập",
      dataIndex: "ten_dang_nhap",
      key: "ten_dang_nhap",
    },
    {
      title: "User",
      dataIndex: "user_id",
      key: "user_id",
      render: (_, record) => {
        console.log("Record in User column:", record, record.id_tai_khoan); // Debugging line
        if (record.vai_tro === "GiaoVu" || record.vai_tro === "GiaoVien") {
          return (
            <CellDisplay
              table="tai_khoan_nguoi_dung"
              id={record.id_tai_khoan}
              fieldName="ma_gv"
            />
          );
        } else if (record.vai_tro === "SinhVien") {
          return (
            <CellDisplay
              table="tai_khoan_nguoi_dung"
              id={record.id_tai_khoan}
              fieldName="ma_sv"
            />
          );
        } else {
          return "N/A";
        }
      },
    },
    {
      title: "Vai Trò",
      dataIndex: "vai_tro",
      key: "vai_tro",
      render: (text) => {
        const found = vaiTroOptions.find((v) => v.value === text);
        return found ? found.label : text;
      },
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
                ten_dang_nhap: record.ten_dang_nhap,
                mat_khau: record.mat_khau,
                vai_tro: record.vai_tro,
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
            setFormData({
              id_tai_khoan: "",
              ten_dang_nhap: "",
              mat_khau: "",
              vai_tro: "",
            });
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
          setFormData({
            id_tai_khoan: "",
            ten_dang_nhap: "",
            mat_khau: "",
            vai_tro: "",
          });
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
                    setFormData({
                      id_tai_khoan: "",
                      ten_dang_nhap: "",
                      mat_khau: "",
                      vai_tro: "",
                    });
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
              <b>Tên đăng nhập:</b> {selectedRecord?.ten_dang_nhap}
            </p>
            <p>
              <b>Vai trò:</b>{" "}
              {vaiTroOptions.find((v) => v.value === selectedRecord?.vai_tro)
                ?.label || selectedRecord?.vai_tro}
            </p>
          </div>
        )}
        {(modalMode === "create" || modalMode === "edit") && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Tên đăng nhập
              </label>
              <Input
                value={formData.ten_dang_nhap}
                onChange={(e) =>
                  setFormData({ ...formData, ten_dang_nhap: e.target.value })
                }
                placeholder="Nhập tên đăng nhập"
                disabled={modalMode === "edit"}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Mật khẩu
              </label>
              <Input.Password
                value={formData.mat_khau}
                onChange={(e) =>
                  setFormData({ ...formData, mat_khau: e.target.value })
                }
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Vai trò
              </label>

              <Select
                value={formData.vai_tro}
                onChange={(value) =>
                  setFormData({ ...formData, vai_tro: value })
                }
                placeholder="Chọn vai trò"
                style={{ width: "100%" }}
                options={
                  modalMode === "create"
                    ? vaiTroOptions
                    : formData.vai_tro === "SinhVien"
                    ? [{ value: "SinhVien", label: "Sinh Viên" }]
                    : vaiTroOptions.filter(
                        (v) => v.value === "GiaoVien" || v.value === "GiaoVu"
                      )
                }
                disabled={modalMode === "view"}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AccoutListItem;
