import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CellDisplay from "../common/CellDisplay.jsx";
import TeacherQuestionDetailModal from "./TeacherQuestionDetailModal.jsx";
import ImportExportExcel from "./import_export_excel/ImportExportExcel.jsx";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import { getUserInfo } from "../../globals/globals.js";
import { useDispatch } from "react-redux";
import { createActions } from "../../redux/actions/factoryActions.js";
import hamChung from "../../services/service.hamChung.js";

const teacherSubjectActions = createActions("cau_hoi");

function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);
  let page = Number(query.get("page")) || 1;
  let pageSize = Number(query.get("pageSize")) || 10;
  return { page, pageSize };
}

const TeacherQuestionListItem = ({ data = [], status_question }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(handleCheckPageParam().page);
  const [pageSize, setPageSize] = useState(handleCheckPageParam().pageSize);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  const [infoTeacher, setInfoTeacher] = useState(null);
  const [showImportExport, setShowImportExport] = useState(false);

  const total = Array.isArray(data) ? data.length : 0;
  const maxPage = Math.ceil(total / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), maxPage);

  useEffect(() => {
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }
  }, [validCurrentPage, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      const info = await hamChiTiet.getUserInfoByAccountId(
        getUserInfo().id_tai_khoan
      );
      setInfoTeacher(info);
    };
    fetchData();
  }, []);

  const paginatedData = Array.isArray(data)
    ? data.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize)
    : [];

  // Xử lý xóa
  const handleDelete = async (record) => {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Kết nối máy chủ thất bại sau 10 giây!")),
          10000
        )
      );
      const res = await Promise.race([
        hamChung.deleteListQuestions(record),
        timeout,
      ]);

      if (res.success) {
        message.success(res.message || "Xóa câu hỏi thành công!");
        dispatch(teacherSubjectActions.creators.fetchAllRequest());
      } else {
        message.error(res.message || "Xóa câu hỏi thất bại!");
      }
    } catch (error) {
      message.error(error.message || "Không thể kết nối máy chủ!");
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 40,
      align: "center",
      render: (_, __, index) => index + 1 + (validCurrentPage - 1) * pageSize,
    },
    {
      title: "Giảng Viên",
      dataIndex: "ma_gv",
      key: "ma_gv",
      render: (value) => <CellDisplay table="giao_vien" id={value} />,
    },
    {
      title: "Môn Học",
      dataIndex: "ma_mh",
      key: "ma_mh",
      render: (value) => (
        <CellDisplay table="mon_hoc" id={value} fieldName="ten_mh" />
      ),
    },
    {
      title: "Trình độ",
      dataIndex: "trinh_do",
      key: "trinh_do",
      align: "center",
      render: (value) =>
        value === "ĐH"
          ? "Đại Học"
          : value === "CĐ"
          ? "Cao Đẳng"
          : value === "VB2"
          ? "Văn Bằng 2"
          : "Khác",
    },
    {
      title: "Số câu hỏi đã soạn",
      dataIndex: "so_cau_hoi",
      key: "so_cau_hoi",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "right",
      width: 150,
      render: (_, record) => {
        const user = getUserInfo();
        return (
          <div>
            <Button
              size="small"
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedId({
                  ma_gv: record.ma_gv,
                  ma_mh: record.ma_mh,
                  trinh_do: record.trinh_do,
                });
                setModalMode("view");
                setModalVisible(true);
              }}
              style={{ marginLeft: 8 }}
            />
            <Button
              size="small"
              type="dashed"
              icon={<EditOutlined />}
              disabled={user?.vai_tro !== "GiaoVien"}
              onClick={() => {
                if (user?.vai_tro !== "GiaoVien") return;
                setSelectedId({
                  ma_gv: record.ma_gv,
                  ma_mh: record.ma_mh,
                  trinh_do: record.trinh_do,
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
              disabled={user?.vai_tro !== "GiaoVien"}
              onClick={() => {
                if (user?.vai_tro !== "GiaoVien") return;
                Modal.confirm({
                  title: "Bạn có muốn xóa câu hỏi này không?",
                  okText: "Có",
                  okType: "danger",
                  cancelText: "Không",
                  onOk() {
                    handleDelete(record);
                  },
                });
              }}
              style={{ marginLeft: 8 }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      {status_question === "chua_xoa" &&
      getUserInfo().vai_tro === "GiaoVien" ? (
        <div style={{ marginBottom: 10, textAlign: "right" }}>
          {/* ✅ Nút mở modal Import/Export */}
          <Button
            type="default"
            onClick={() => setShowImportExport(true)}
            style={{ marginRight: 8 }}
          >
            Import/Export
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedId(null);
              setModalMode("create");
              setModalVisible(true);
            }}
          >
            Thêm Câu Hỏi
          </Button>
        </div>
      ) : (
        <div style={{ marginBottom: 10, textAlign: "right", marginTop: 60 }} />
      )}

      {/* ❌ Xóa đoạn showImportExport cũ */}
      {/* ✅ Thêm Modal hiển thị Import/Export */}
      <Modal
        open={showImportExport}
        title="📂 Import / Export Question"
        footer={null}
        centered
        destroyOnClose
        onCancel={() => setShowImportExport(false)}
      >
        <ImportExportExcel/>
      </Modal>

      <Table
        rowKey={(record) =>
          record.id_cau_hoi ||
          `${record.ma_gv}_${record.ma_mh}_${record.trinh_do}`
        }
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

      <TeacherQuestionDetailModal
        visible={modalVisible}
        maGV={selectedId?.ma_gv || infoTeacher?.ma_gv}
        maMH={selectedId?.ma_mh}
        trinhDo={selectedId?.trinh_do || "ĐH"}
        mode={modalMode}
        onCancel={() => setModalVisible(false)}
        status_question={status_question}
      />
    </>
  );
};

export default TeacherQuestionListItem;
