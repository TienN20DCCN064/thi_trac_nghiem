import React, { useState } from "react";
import { Table, Button, Modal, message } from "antd";
import { EyeOutlined, PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import CancelExamModal from "./CancelExamModal.jsx";
import StudentExamDetailModal from "./StudentExamDetailModal.jsx";
import CellDisplay from "../common/CellDisplay.jsx";
import hamChung from "../../services/service.hamChung.js";
import { createActions } from "../../redux/actions/factoryActions.js";
import { useDispatch } from "react-redux";

const actions = createActions("dang_ky_thi");
const StudentExamListItem = ({ data = [] }) => {
  const dispatch = useDispatch();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  // new: detail modal state
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  const openCancel = (record) => {
    setSelected(record);
    setCancelModalVisible(true);
  };

  const openDetail = (record) => {
    setDetailRecord(record);
    setDetailVisible(true);
  };

  const handleTakeExam = (record) => {
    // chuyển hướng vào trang làm bài (tùy app route)
    // ví dụ: /student/exam/take?id_dang_ky=...
    window.location.href = `/student/exam/take?id=${record.id_dang_ky_thi}`;
  };

  const columns = [
    { title: "#", key: "idx", render: (_, __, i) => i + 1 },
     {
      title: "Mã môn",
      dataIndex: "ma_mh",
    },
    {
      title: "Môn học",
      dataIndex: "ma_mh",
      render: (v) => <CellDisplay table="mon_hoc" id={v} fieldName="ten_mh" />,
    },
    { title: "Ngày thi", dataIndex: "ngay_thi" },
    { title: "Thời gian (phút)", dataIndex: "thoi_gian", align: "center" },
    {
      title: "Trạng thái",
      dataIndex: "status_student",
      align: "center",
      render: (v) => (v === "da_lam" ? "Đã làm" : "Chưa làm"),
    },
    {
      title: "Hành động",
      key: "action",
      align: "right",
      render: (_, record) => (
        <div>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openDetail(record)}
            style={{ marginLeft: 8 }}
          />
          {record.status_student === "chua_lam" && (
            <Button
              size="small"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleTakeExam(record)}
              style={{ marginLeft: 8 }}
            >
              Làm bài
            </Button>
          )}
          {record.status_student === "chua_lam" && (
            <Button
              size="small"
              danger
              icon={<StopOutlined />}
              onClick={() =>
                Modal.confirm({
                  title: "Bạn có muốn bỏ thi đăng ký này không?",
                  okText: "Có",
                  cancelText: "Không",
                  onOk() {
                    openCancel(record);
                  },
                })
              }
              style={{ marginLeft: 8 }}
            >
              Bỏ thi
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey={(r) => r.id_dang_ky_thi}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />

      <CancelExamModal
        visible={cancelModalVisible}
        record={selected}
        onCancel={() => setCancelModalVisible(false)}
        onSuccess={() => {
          setCancelModalVisible(false);
          dispatch(actions.creators.fetchAllRequest && actions.creators.fetchAllRequest());
          message.success("Bỏ thi thành công");
        }}
      />

      <StudentExamDetailModal
        visible={detailVisible}
        record={detailRecord}
        onCancel={() => {
          setDetailVisible(false);
          setDetailRecord(null);
        }}
      />
    </>
  );
};

export default StudentExamListItem;