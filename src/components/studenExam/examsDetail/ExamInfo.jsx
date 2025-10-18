// 📁 src/components/exam/ExamInfo.jsx
import React from "react";
import { Modal, Typography, List, Divider } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import CellDisplay from "../../common/CellDisplay";

const { Title, Text, Paragraph } = Typography;

const ExamInfo = ({ visible, onClose, exam }) => {
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={720} // ⬅️ tăng kích thước modal
      bodyStyle={{
        padding: "28px 36px", // ⬅️ tăng padding bên trong
        background: "#fff",
        borderRadius: 12,
      }}
    >
      {/* Tiêu đề */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          {exam?.ten_ky_thi || "Kỳ thi trắc nghiệm"}
        </Title>
        <Text type="secondary" style={{ fontSize: 15 }}>
          Vui lòng đọc kỹ thông tin trước khi bắt đầu làm bài
        </Text>
      </div>

      {/* 🧾 Thông tin chính */}
      <List
        size="large"
        bordered
        style={{
          borderRadius: 8,
          marginBottom: 24,
          fontSize: 15,
        }}
        dataSource={[
          <span key="monhoc">
            <BookOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            <Text strong>Môn học:</Text> {exam?.ma_mh} -{" "}
            <CellDisplay table="mon_hoc" id={exam?.ma_mh} fieldName="ten_mh" />
          </span>,
          <span key="time">
            <ClockCircleOutlined style={{ marginRight: 8, color: "#faad14" }} />
            <Text strong>Thời gian làm bài:</Text> {exam?.thoi_gian || 0} phút
          </span>,
          <span key="type">
            <LaptopOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            <Text strong>Hình thức thi:</Text>{" "}
            {exam?.hinh_thuc || "Trắc nghiệm trên máy tính"}
          </span>,
          <span key="score">
            <InfoCircleOutlined style={{ marginRight: 8, color: "#13c2c2" }} />
            <Text strong>Cách tính điểm:</Text> Thang điểm 10, mỗi câu đúng được{" "}
            <Text code>10 / số câu</Text>
          </span>,
        ]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />

      {/* 📋 Quy định & Hướng dẫn */}
      <Divider orientation="left" style={{ margin: "16px 0", fontWeight: 600 }}>
        Quy định & Hướng dẫn
      </Divider>

      <Paragraph style={{ fontSize: 15, lineHeight: 1.7 }}>
        <ul style={{ paddingLeft: 24 }}>
          <li>Hình thức thi có thể bao gồm:</li>
          <ul style={{ paddingLeft: 24, marginTop: 4 }}>
            <li>
              <b>Trắc nghiệm:</b> Chọn đáp án đúng trong các lựa chọn cho sẵn.
            </li>
            <li>
              <b>Yes/No:</b> Chọn đúng hoặc sai cho câu hỏi.
            </li>
            <li>
              <b>Điền khuyết:</b> Nhập từ còn thiếu vào ô trống.
            </li>
          </ul>

          <li>
            Thời gian làm bài sẽ được <b>đếm ngược</b> và tự động nộp khi hết
            giờ.
          </li>
          <li>Không thoát cửa sổ hoặc tải lại trang trong khi làm bài.</li>
        </ul>
      </Paragraph>

      <div
        style={{
          marginTop: 16,
          textAlign: "center",
          background: "#f6ffed",
          border: "1px solid #b7eb8f",
          borderRadius: 8,
          padding: "10px 16px",
        }}
      >
        <Text type="success" style={{ fontSize: 15 }}>
          ✅ Hãy đảm bảo bạn đã sẵn sàng trước khi bắt đầu làm bài.
        </Text>
      </div>
    </Modal>
  );
};

export default ExamInfo;
