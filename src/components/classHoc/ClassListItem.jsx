import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, DatePicker, message, Select } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createActions } from "../../redux/actions/factoryActions.js";
import hamChung from "../../services/service.hamChung.js";
import moment from "moment";

const classSubjectActions = createActions("lop");

const ClassListItem = ({ data = [], onDataChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    ma_lop: "",
    ten_lop: "",
    nam_nhap_hoc: null,
    ma_khoa: "",
  });
  const [khoaList, setKhoaList] = useState([]);

  // Lấy danh sách khoa để chọn trong form
  useEffect(() => {
    const fetchKhoaList = async () => {
      try {
        const khoaData = await hamChung.getAll("khoa");
        setKhoaList(khoaData || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách khoa:", err);
      }
    };
    fetchKhoaList();
  }, []);

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
  const handleSubmit = async () => {
    if (!formData.ma_lop || !formData.ten_lop || !formData.ma_khoa) {
      message.error("Vui lòng nhập đầy đủ mã lớp, tên lớp và mã khoa!");
      return;
    }

    const payload = {
      ma_lop: formData.ma_lop,
      ten_lop: formData.ten_lop,
      nam_nhap_hoc: formData.nam_nhap_hoc
        ? moment(formData.nam_nhap_hoc).format("YYYY-MM-DD")
        : null,
      ma_khoa: formData.ma_khoa,
    };

    if (modalMode === "create") {
      const getAllLop = await hamChung.getAll("lop");
      for (let i = 0; i < getAllLop.length; i++) {
        if (getAllLop[i].ma_lop === formData.ma_lop) {
          message.error("Mã lớp đã tồn tại, vui lòng nhập mã khác!");
          return;
        }
        if (getAllLop[i].ten_lop === formData.ten_lop) {
          message.error("Tên lớp đã tồn tại, vui lòng nhập tên khác!");
          return;
        }
      }
      dispatch(
        classSubjectActions.creators.createRequest(payload, (res) => {
          if (res.success) {
            message.success(res.message || "Thêm lớp thành công!");
            setModalVisible(false);
            setFormData({
              ma_lop: "",
              ten_lop: "",
              nam_nhap_hoc: null,
              ma_khoa: "",
            });
            onDataChange(); // tải lại dữ liệu sau khi thêm thành công
          } else {
            message.error(res.message || "Thêm lớp thất bại!");
          }
        })
      );
    } else if (modalMode === "edit") {
      dispatch(
        classSubjectActions.creators.updateRequest(
          formData.ma_lop,
          payload,
          (res) => {
            if (res.success) {
              message.success(res.message || "Cập nhật lớp thành công!");
              setModalVisible(false);
              setFormData({
                ma_lop: "",
                ten_lop: "",
                nam_nhap_hoc: null,
                ma_khoa: "",
              });
              onDataChange(); // tải lại dữ liệu sau khi cập nhật thành công
            } else {
              message.error(res.message || "Cập nhật lớp thất bại!");
            }
          }
        )
      );
    }
  };

  // Xử lý xóa
  const handleDelete = (record) => {
    dispatch(
      classSubjectActions.creators.deleteRequest(record.ma_lop, (res) => {
        if (res.success) {
          message.success(res.message || "Xóa lớp thành công!");
          onDataChange(); // tải lại dữ liệu sau khi xóa thành công
        } else {
          message.error(res.message || "Xóa lớp thất bại!");
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
      title: "Mã Lớp",
      dataIndex: "ma_lop",
      key: "ma_lop",
    },
    {
      title: "Tên Lớp",
      dataIndex: "ten_lop",
      key: "ten_lop",
    },
    {
      title: "Năm Nhập Học",
      dataIndex: "nam_nhap_hoc",
      key: "nam_nhap_hoc",
      render: (value) => (value ? moment(value).format("YYYY") : "N/A"),
    },
    {
      title: "Khoa",
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
                ma_lop: record.ma_lop,
                ten_lop: record.ten_lop,
                nam_nhap_hoc: record.nam_nhap_hoc
                  ? moment(record.nam_nhap_hoc)
                  : null,
                ma_khoa: record.ma_khoa,
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
                title: "Bạn có muốn xóa lớp này không?",
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
              ma_lop: "",
              ten_lop: "",
              nam_nhap_hoc: null,
              ma_khoa: "",
            });
            setModalMode("create");
            setModalVisible(true);
          }}
        >
          Thêm Lớp
        </Button>
      </div>

      <Table
        rowKey={(record) => record.ma_lop}
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
            ? "Thêm Lớp"
            : modalMode === "edit"
            ? "Sửa Lớp"
            : "Chi tiết Lớp"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFormData({
            ma_lop: "",
            ten_lop: "",
            nam_nhap_hoc: null,
            ma_khoa: "",
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
                      ma_lop: "",
                      ten_lop: "",
                      nam_nhap_hoc: null,
                      ma_khoa: "",
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
              <b>Mã lớp:</b> {selectedRecord?.ma_lop}
            </p>
            <p>
              <b>Tên lớp:</b> {selectedRecord?.ten_lop}
            </p>
            <p>
              <b>Năm nhập học:</b>{" "}
              {selectedRecord?.nam_nhap_hoc
                ? moment(selectedRecord.nam_nhap_hoc).format("YYYY")
                : "N/A"}
            </p>
            <p>
              <b>Khoa:</b> {selectedRecord?.ten_khoa}
            </p>
          </div>
        )}
        {(modalMode === "create" || modalMode === "edit") && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Mã lớp
              </label>
              <Input
                value={formData.ma_lop}
                onChange={(e) =>
                  setFormData({ ...formData, ma_lop: e.target.value })
                }
                disabled={modalMode === "edit"}
                placeholder="Nhập mã lớp"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Tên lớp
              </label>
              <Input
                value={formData.ten_lop}
                onChange={(e) =>
                  setFormData({ ...formData, ten_lop: e.target.value })
                }
                placeholder="Nhập tên lớp"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Năm nhập học
              </label>
              <DatePicker
                value={formData.nam_nhap_hoc}
                onChange={(date) =>
                  setFormData({ ...formData, nam_nhap_hoc: date })
                }
                picker="year"
                placeholder="Chọn năm nhập học"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>Khoa</label>
              <Select
                value={formData.ma_khoa}
                onChange={(value) =>
                  setFormData({ ...formData, ma_khoa: value })
                }
                placeholder="Chọn khoa"
                style={{ width: "100%" }}
              >
                {khoaList.map((khoa) => (
                  <Select.Option key={khoa.ma_khoa} value={khoa.ma_khoa}>
                    {khoa.ten_khoa}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ClassListItem;
