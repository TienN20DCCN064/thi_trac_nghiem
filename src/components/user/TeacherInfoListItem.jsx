import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, message, Select } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import CellDisplay from "../../components/common/CellDisplay.jsx";
import { createActions } from "../../redux/actions/factoryActions.js";
import hamChung from "../../services/service.hamChung.js";

const teacherSubjectActions = createActions("giao_vien");

const InfoTeacherListItem = ({ data = [], onDataChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    ma_gv: "",
    ho: "",
    ten: "",
    hoc_vi: "",
    ma_khoa: "",
    hinh_anh: "",
    ghi_chu: "",
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
  const handleSubmit = () => {
    if (
      !formData.ma_gv ||
      !formData.ho ||
      !formData.ten ||
      !formData.hoc_vi ||
      !formData.ma_khoa
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    const payload = {
      ma_gv: formData.ma_gv,
      ho: formData.ho,
      ten: formData.ten,
      hoc_vi: formData.hoc_vi,
      ma_khoa: formData.ma_khoa,
      hinh_anh: formData.hinh_anh || null,
      ghi_chu: formData.ghi_chu || null,
    };

    if (modalMode === "create") {
      dispatch(
        teacherSubjectActions.creators.createRequest(payload, (res) => {
          if (res.success) {
            message.success(res.message || "Thêm giảng viên thành công!");
            setModalVisible(false);
            setFormData({
              ma_gv: "",
              ho: "",
              ten: "",
              hoc_vi: "",
              ma_khoa: "",
              hinh_anh: "",
              ghi_chu: "",
            });
            onDataChange();
          } else {
            message.error(res.message || "Thêm giảng viên thất bại!");
          }
        })
      );
    } else if (modalMode === "edit") {
      dispatch(
        teacherSubjectActions.creators.updateRequest(
          formData.ma_gv,
          payload,
          (res) => {
            if (res.success) {
              message.success(res.message || "Cập nhật giảng viên thành công!");
              setModalVisible(false);
              setFormData({
                ma_gv: "",
                ho: "",
                ten: "",
                hoc_vi: "",
                ma_khoa: "",
                hinh_anh: "",
                ghi_chu: "",
              });
              onDataChange();
            } else {
              message.error(res.message || "Cập nhật giảng viên thất bại!");
            }
          }
        )
      );
    }
  };

  // Xử lý xóa
  const handleDelete = (record) => {
    dispatch(
      teacherSubjectActions.creators.deleteRequest(record.ma_gv, (res) => {
        if (res.success) {
          message.success(res.message || "Xóa giảng viên thành công!");
          onDataChange();
        } else {
          message.error(res.message || "Xóa giảng viên thất bại!");
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
      title: "Mã GV",
      dataIndex: "ma_gv",
      key: "ma_gv",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinh_anh",
      key: "hinh_anh",
      render: (value) =>
        value ? (
          <img src={value} alt="Hình ảnh" style={{ maxWidth: 60 }} />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Họ và Tên",
      dataIndex: "ho_ten",
      key: "ho_ten",
      width: 180,
      render: (_, record) => `${record.ho} ${record.ten}`,
    },
    {
      title: "Học vị",
      dataIndex: "hoc_vi",
      key: "hoc_vi",
      render: (value) => {
        switch (value) {
          case "CuNhan":
            return "Cử nhân";
          case "ThacSi":
            return "Thạc sĩ";
          case "TienSi":
            return "Tiến sĩ";
          default:
            return value || "N/A";
        }
      },
    },
    {
      title: "Khoa",
      dataIndex: "ma_khoa",
      key: "ma_khoa",
      render: (value) => (
        <CellDisplay table="khoa" id={value} fieldName="ten_khoa" />
      ),
    },

    // {
    //   title: "Ghi chú",
    //   dataIndex: "ghi_chu",
    //   key: "ghi_chu",
    //   render: (value) => value || "N/A",
    // },
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
                ma_gv: record.ma_gv,
                ho: record.ho,
                ten: record.ten,
                hoc_vi: record.hoc_vi,
                ma_khoa: record.ma_khoa,
                hinh_anh: record.hinh_anh || "",
                ghi_chu: record.ghi_chu || "",
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
                title: "Bạn có muốn xóa giảng viên này không?",
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
              ma_gv: "",
              ho: "",
              ten: "",
              hoc_vi: "",
              ma_khoa: "",
              hinh_anh: "",
              ghi_chu: "",
            });
            setModalMode("create");
            setModalVisible(true);
          }}
        >
          Thêm Giảng Viên
        </Button>
      </div>

      <Table
        rowKey={(record) => record.ma_gv}
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
            ? "Thêm Giảng Viên"
            : modalMode === "edit"
            ? "Sửa Giảng Viên"
            : "Chi tiết Giảng Viên"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFormData({
            ma_gv: "",
            ho: "",
            ten: "",
            hoc_vi: "",
            ma_khoa: "",
            hinh_anh: "",
            ghi_chu: "",
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
                      ma_gv: "",
                      ho: "",
                      ten: "",
                      hoc_vi: "",
                      ma_khoa: "",
                      hinh_anh: "",
                      ghi_chu: "",
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
              <b>Mã GV:</b> {selectedRecord?.ma_gv}
            </p>
            <p>
              <b>Họ và Tên:</b> {selectedRecord?.ho} {selectedRecord?.ten}
            </p>
            <p>
              <b>Học vị:</b>{" "}
              {selectedRecord?.hoc_vi
                ? selectedRecord.hoc_vi === "CuNhan"
                  ? "Cử nhân"
                  : selectedRecord.hoc_vi === "ThacSi"
                  ? "Thạc sĩ"
                  : selectedRecord.hoc_vi === "TienSi"
                  ? "Tiến sĩ"
                  : selectedRecord.hoc_vi
                : "N/A"}
            </p>
            <p>
              <b>Khoa:</b> {selectedRecord?.ma_khoa} -{" "}
              <CellDisplay
                table="khoa"
                id={selectedRecord?.ma_khoa}
                fieldName="ten_khoa"
              />
            </p>
            <p>
              <b>Hình ảnh:</b>{" "}
              {selectedRecord?.hinh_anh ? (
                <img
                  src={selectedRecord.hinh_anh}
                  alt="Hình ảnh"
                  style={{ maxWidth: 100 }}
                />
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <b>Ghi chú:</b> {selectedRecord?.ghi_chu || "N/A"}
            </p>
          </div>
        )}
        {(modalMode === "create" || modalMode === "edit") && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Mã Giảng Viên
              </label>
              <Input
                value={formData.ma_gv}
                onChange={(e) =>
                  setFormData({ ...formData, ma_gv: e.target.value })
                }
                disabled={modalMode === "edit"}
                placeholder="Nhập mã giảng viên"
                maxLength={50}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>Họ</label>
              <Input
                value={formData.ho}
                onChange={(e) =>
                  setFormData({ ...formData, ho: e.target.value })
                }
                placeholder="Nhập họ"
                maxLength={50}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>Tên</label>
              <Input
                value={formData.ten}
                onChange={(e) =>
                  setFormData({ ...formData, ten: e.target.value })
                }
                placeholder="Nhập tên"
                maxLength={10}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Học vị
              </label>
              <Select
                value={formData.hoc_vi}
                onChange={(value) =>
                  setFormData({ ...formData, hoc_vi: value })
                }
                placeholder="Chọn học vị"
                style={{ width: "100%" }}
              >
                <Select.Option value="CuNhan">Cử nhân</Select.Option>
                <Select.Option value="ThacSi">Thạc sĩ</Select.Option>
                <Select.Option value="TienSi">Tiến sĩ</Select.Option>
              </Select>
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
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Hình ảnh (URL)
              </label>
              <Input
                value={formData.hinh_anh}
                onChange={(e) =>
                  setFormData({ ...formData, hinh_anh: e.target.value })
                }
                placeholder="Nhập đường dẫn hình ảnh"
                maxLength={255}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Ghi chú
              </label>
              <Input.TextArea
                value={formData.ghi_chu}
                onChange={(e) =>
                  setFormData({ ...formData, ghi_chu: e.target.value })
                }
                placeholder="Nhập ghi chú"
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default InfoTeacherListItem;
