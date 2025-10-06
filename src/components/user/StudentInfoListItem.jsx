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

const studentSubjectActions = createActions("sinh_vien");

const StudentInfoListItem = ({ data = [], onDataChange }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    ma_sv: "",
    ho: "",
    ten: "",
    phai: "",
    dia_chi: "",
    ngay_sinh: null,
    ma_lop: "",
    hinh_anh: "",
  });
  const [lopList, setLopList] = useState([]);

  useEffect(() => {
    const fetchLopList = async () => {
      try {
        const lopData = await hamChung.getAll("lop");
        setLopList(lopData || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách lớp:", err);
      }
    };
    fetchLopList();
  }, []);

  const handleCheckPageParam = () => {
    const query = new URLSearchParams(window.location.search);
    let page = Number(query.get("page")) || 1;
    let pageSize = Number(query.get("pageSize")) || 10;
    return { page, pageSize };
  };

  useEffect(() => {
    const { page, pageSize: newPageSize } = handleCheckPageParam();
    setCurrentPage(page);
    setPageSize(newPageSize);
  }, []);

  const total = Array.isArray(data) ? data.length : 0;
  const maxPage = Math.ceil(total / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), maxPage);
  const paginatedData = Array.isArray(data)
    ? data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize)
    : [];
// Xử lý khi submit form
const handleSubmit = () => {
  if (!formData.ma_sv || !formData.ho || !formData.ten || !formData.phai || !formData.ma_lop) {
    message.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
    return;
  }

  const payload = {
    ma_sv: formData.ma_sv,
    ho: formData.ho,
    ten: formData.ten,
    phai: formData.phai,
    dia_chi: formData.dia_chi,
    ngay_sinh: formData.ngay_sinh
      ? moment(formData.ngay_sinh).format("YYYY-MM-DD")
      : null,
    ma_lop: formData.ma_lop,
    hinh_anh: formData.hinh_anh,
  };

  if (modalMode === "create") {
    dispatch(
      studentSubjectActions.creators.createRequest(payload, (res) => {
        if (res.success) {
          message.success(res.message || "Thêm sinh viên thành công!");
          setModalVisible(false);
          setFormData({
            ma_sv: "",
            ho: "",
            ten: "",
            phai: "",
            dia_chi: "",
            ngay_sinh: null,
            ma_lop: "",
            hinh_anh: "",
          });
          onDataChange();
        } else {
          message.error(res.message || "Thêm sinh viên thất bại!");
        }
      })
    );
  } else if (modalMode === "edit") {
    dispatch(
      studentSubjectActions.creators.updateRequest(formData.ma_sv, payload, (res) => {
        if (res.success) {
          message.success(res.message || "Cập nhật sinh viên thành công!");
          setModalVisible(false);
          setFormData({
            ma_sv: "",
            ho: "",
            ten: "",
            phai: "",
            dia_chi: "",
            ngay_sinh: null,
            ma_lop: "",
            hinh_anh: "",
          });
          onDataChange();
        } else {
          message.error(res.message || "Cập nhật sinh viên thất bại!");
        }
      })
    );
  }
};

// Xử lý xóa
const handleDelete = (record) => {
  dispatch(
    studentSubjectActions.creators.deleteRequest(record.ma_sv, (res) => {
      if (res.success) {
        message.success(res.message || "Xóa sinh viên thành công!");
        onDataChange();
      } else {
        message.error(res.message || "Xóa sinh viên thất bại!");
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
      title: "Mã SV",
      dataIndex: "ma_sv",
      key: "ma_sv",
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
      render: (_, record) => `${record.ho} ${record.ten}`,
    },
    
    {
      title: "Phái",
      dataIndex: "phai",
      key: "phai",
      render: (value) => (value === "Nam" ? "Nam" : value === "Nu" ? "Nữ" : "Khác"),
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngay_sinh",
      key: "ngay_sinh",
      render: (value) => (value ? moment(value).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Lớp",
      dataIndex: "ten_lop",
      key: "ten_lop",
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
                ma_sv: record.ma_sv,
                ho: record.ho,
                ten: record.ten,
                phai: record.phai,
                dia_chi: record.dia_chi,
                ngay_sinh: record.ngay_sinh ? moment(record.ngay_sinh) : null,
                ma_lop: record.ma_lop,
                hinh_anh: record.hinh_anh,
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
                title: "Bạn có muốn xóa sinh viên này không?",
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
              ma_sv: "",
              ho: "",
              ten: "",
              phai: "",
              dia_chi: "",
              ngay_sinh: null,
              ma_lop: "",
              hinh_anh: "",
            });
            setModalMode("create");
            setModalVisible(true);
          }}
        >
          Thêm Sinh Viên
        </Button>
      </div>

      <Table
        rowKey={(record) => record.ma_sv}
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
            ? "Thêm Sinh Viên"
            : modalMode === "edit"
            ? "Sửa Sinh Viên"
            : "Chi tiết Sinh Viên"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFormData({
            ma_sv: "",
            ho: "",
            ten: "",
            phai: "",
            dia_chi: "",
            ngay_sinh: null,
            ma_lop: "",
            hinh_anh: "",
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
                      ma_sv: "",
                      ho: "",
                      ten: "",
                      phai: "",
                      dia_chi: "",
                      ngay_sinh: null,
                      ma_lop: "",
                      hinh_anh: "",
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
              <b>Mã SV:</b> {selectedRecord?.ma_sv}
            </p>
            <p>
              <b>Họ:</b> {selectedRecord?.ho}
            </p>
            <p>
              <b>Tên:</b> {selectedRecord?.ten}
            </p>
            <p>
              <b>Phái:</b> {selectedRecord?.phai}
            </p>
            <p>
              <b>Địa chỉ:</b> {selectedRecord?.dia_chi}
            </p>
            <p>
              <b>Ngày sinh:</b>{" "}
              {selectedRecord?.ngay_sinh
                ? moment(selectedRecord.ngay_sinh).format("DD/MM/YYYY")
                : "N/A"}
            </p>
            <p>
              <b>Lớp:</b> {selectedRecord?.ten_lop}
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
          </div>
        )}
        {(modalMode === "create" || modalMode === "edit") && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Mã SV
              </label>
              <Input
                value={formData.ma_sv}
                onChange={(e) =>
                  setFormData({ ...formData, ma_sv: e.target.value })
                }
                disabled={modalMode === "edit"}
                placeholder="Nhập mã sinh viên"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Họ
              </label>
              <Input
                value={formData.ho}
                onChange={(e) =>
                  setFormData({ ...formData, ho: e.target.value })
                }
                placeholder="Nhập họ"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Tên
              </label>
              <Input
                value={formData.ten}
                onChange={(e) =>
                  setFormData({ ...formData, ten: e.target.value })
                }
                placeholder="Nhập tên"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Phái
              </label>
              <Select
                value={formData.phai}
                onChange={(value) =>
                  setFormData({ ...formData, phai: value })
                }
                placeholder="Chọn phái"
                style={{ width: "100%" }}
              >
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nu">Nữ</Select.Option>
              </Select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Địa chỉ
              </label>
              <Input
                value={formData.dia_chi}
                onChange={(e) =>
                  setFormData({ ...formData, dia_chi: e.target.value })
                }
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>
                Ngày sinh
              </label>
              <DatePicker
                value={formData.ngay_sinh}
                onChange={(date) =>
                  setFormData({ ...formData, ngay_sinh: date })
                }
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>Lớp</label>
              <Select
                value={formData.ma_lop}
                onChange={(value) =>
                  setFormData({ ...formData, ma_lop: value })
                }
                placeholder="Chọn lớp"
                style={{ width: "100%" }}
              >
                {lopList.map((lop) => (
                  <Select.Option key={lop.ma_lop} value={lop.ma_lop}>
                    {lop.ten_lop}
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
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default StudentInfoListItem;