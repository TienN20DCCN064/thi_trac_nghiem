import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import RegisterExamDetailModal from "./RegisterExamDetailModal.jsx";
import { useDispatch } from "react-redux";
import RegisterExamApproveModal from "./RegisterExamApproveModal.jsx"; // Thêm dòng này
import { createActions } from "../../redux/actions/factoryActions.js";
import CellDisplay from "../../components/common/CellDisplay.jsx";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import hamChung from "../../services/service.hamChung.js";
import { getUserInfo } from "../../globals/globals.js";
// import { useDispatch } from "react-redux";

const dangKyThiActions = createActions("dang_ky_thi");

function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);
  let page = Number(query.get("page")) || 1;
  let pageSize = Number(query.get("pageSize")) || 10;

  // Đảm bảo page và pageSize là hợp lệ
  page = isNaN(page) || page < 1 ? 1 : page;
  pageSize = isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;

  return { page, pageSize };
}

const RegisterExamListItem = ({
  data = [],
  //onDeleteClick,
  // onEditClick,
  // onViewDetailClick,
}) => {
  console.log("Render RegisterExamListItem with data:", data);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(handleCheckPageParam().page);
  const [pageSize, setPageSize] = useState(handleCheckPageParam().pageSize);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // Thêm state cho mode
  const [mode, setMode] = useState("view");
  const [soCauThiMap, setSoCauThiMap] = useState({});

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
  // 🔁 Tự động đếm số câu thi khi có data
  useEffect(() => {
    const fetchSoCauThi = async () => {
      const newMap = {};
      for (const item of data) {
        const count = await hamChiTiet.countSoCauThiByidDangKyThi(
          item.id_dang_ky_thi
        );
        newMap[item.id_dang_ky_thi] = count;
      }
      setSoCauThiMap(newMap);
    };

    if (data.length > 0) {
      fetchSoCauThi();
    }
  }, [data]);
  // Xử lý khi click "Xem chi tiết"
  // Trong RegisterExamListItem.jsx
  const handleViewDetailClick = (status, id) => {
    console.log("Xem chi tiết đăng ký thi ID:", id);
    console.log("Trạng thái đăng ký thi:", status);
    setSelectedId(id);
    setDetailModalVisible(true);
    setMode(status); // Thêm state để lưu mode
  };

  // Xử lý xóa
  const handleDelete = (record) => {
    hamChung
      .deleteExam(record.id_dang_ky_thi)
      .then(() => {
        message.success("Xóa đăng ký thi thành công");
        // // Cập nhật lại danh sách sau khi xóa
        dispatch(dangKyThiActions.creators.fetchAllRequest());
      })
      .catch((error) => {
        console.error("Lỗi khi xóa đăng ký thi:", error);
        message.error("Xóa đăng ký thi thất bại");
      });
  };
  // Dữ liệu cho trang hiện tại
  const paginatedData = Array.isArray(data)
    ? data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize)
    : [];
  const columns = [
    {
      title: "#",
      key: "index",
      width: 40,
      align: "center",
      render: (_, __, index) => index + 1 + (validCurrentPage - 1) * pageSize,
    },
    // { title: "ID Đăng Ký", dataIndex: "id_dang_ky_thi", key: "id_dang_ky_thi" },
    {
      title: "Giáo Viên",
      dataIndex: "ma_gv",
      // width: 150,
      key: "ma_gv",
      render: (value) => <CellDisplay table="giao_vien" id={value} />,
    },
    {
      title: "Lớp Học",
      dataIndex: "ma_lop",
      key: "ma_lop",
      // width: 150,
      render: (value) => (
        <CellDisplay table="lop" id={value} fieldName="ten_lop" />
      ),
    },
    {
      title: "Môn Học",
      dataIndex: "ma_mh",
      // width: 150,
      key: "ma_mh",
      render: (value) => (
        <CellDisplay table="mon_hoc" id={value} fieldName="ten_mh" />
      ),
    },

    {
      title: "Trình Độ",
      dataIndex: "trinh_do",
      key: "trinh_do",
      // width: 150,
      render: (value) => {
        if (value === "ĐH") return "ĐH - Đại Học";
        if (value === "CĐ") return "CĐ - Cao Đẳng";
        if (value === "VB2") return "VB2 - Văn Bằng 2";
        return value;
      },
    },
    {
      title: "Ngày Thi",
      dataIndex: "ngay_thi",
      key: "ngay_thi",
      // width: 100,
      render: (value) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "-",
    },
    // {
    //   title: "Số Câu / Thời Gian",
    //   dataIndex: "so_cau_thi/thoi_gian",
    //   key: "so_cau_thi/thoi_gian",
    //   render: (_, record) => `${record.so_cau_thi} câu / ${record.thoi_gian} phút`,
    // },
    {
      title: "Số Câu",
      dataIndex: "so_cau_thi",
      // width: 100,
      render: (_, record) => soCauThiMap[record.id_dang_ky_thi] ?? "-",
    },
    {
      title: "Thời Gian ",
      dataIndex: "thoi_gian",
      key: "thoi_gian",
      // width: 100,
      render: (value) => `${value} phút`,
    },

    {
      title: "Trạng Thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      width: 100,
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
    // {
    //   title: "Người Phê Duyệt",
    //   dataIndex: "nguoi_phe_duyet",
    //   key: "nguoi_phe_duyet",
    //   render: (value) => value || "-",
    // },
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
                  title: "Xác nhận xóa",
                  content: "Bạn có chắc chắn muốn xóa đăng ký thi này không?",
                  okText: "Xóa",
                  okType: "danger",
                  cancelText: "Hủy",
                  onOk: () => handleDelete(record),
                })
              }
              disabled={!isEditable}
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
      {/* Hiển thị modal phù hợp */}
      {getUserInfo().vai_tro === "GiaoVu" && mode === "edit" ? (
        <RegisterExamApproveModal
          visible={detailModalVisible}
          id_dang_ky_thi={selectedId}
          onCancel={() => {
            setDetailModalVisible(false);
            setMode("view");
          }}
          onSuccess={() => {
            setDetailModalVisible(false);
            setMode("view");
            // Có thể reload lại danh sách nếu cần
          }}
        />
      ) : (
        <RegisterExamDetailModal
          visible={detailModalVisible}
          id_dang_ky_thi={selectedId}
          mode={mode}
          onCancel={() => {
            setDetailModalVisible(false);
            setMode("view");
          }}
        />
      )}
    </>
  );
};

export default RegisterExamListItem;
