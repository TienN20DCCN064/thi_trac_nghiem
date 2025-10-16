import React, { useState } from "react";
import { Table, Button, Modal, message } from "antd";
import { EyeOutlined, PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import CancelExamModal from "./CancelExamModal.jsx";
import CellDisplay from "../common/CellDisplay.jsx";
import hamChung from "../../services/service.hamChung.js";
import { createActions } from "../../redux/actions/factoryActions.js";
import { useDispatch } from "react-redux";
import StudentExamDetail from "./StudentExamDetail.jsx"; // Import the detail component
import { useHistory } from "react-router-dom"; // Import useHistory for navigation

const actions = createActions("dang_ky_thi");
const StudentExamListItem = ({ data = [] }) => {
  const dispatch = useDispatch();
  const history = useHistory(); // Initialize history for navigation
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const openCancel = (record) => {
    setSelected(record);
    setCancelModalVisible(true);
  };

  const handleTakeExam = (record) => {
    window.location.href = `/student/exam/take?id=${record.id_dang_ky_thi}`;
  };

  const handleViewDetail = (record) => {
    history.push(`/student/exam/detail?id=${record.id_dang_ky_thi}`); // Navigate to detail page
  };

  const columns = [
    { title: "#", key: "idx", render: (_, __, i) => i + 1 },
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
            onClick={() => handleViewDetail(record)} // Use the new view detail function
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
    </>
  );
};

export default StudentExamListItem;