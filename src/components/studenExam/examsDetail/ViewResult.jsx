// src/components/exam/ViewResult.jsx
import React from "react";
import { Modal, Typography, Button, Space } from "antd";

const { Title, Text } = Typography;

const ViewResult = ({ visible, score, onClose }) => {
  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      width={500}
      bodyStyle={{
        textAlign: "center",
        padding: "40px 24px",
      }}
    >
      <Space direction="vertical" align="center" size="large">
        <Title level={3}>🎉 Kết quả bài thi</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Bạn đã hoàn thành bài thi.
        </Text>
        <div
          style={{
            background: "#e6f7ff",
            border: "2px solid #1890ff",
            borderRadius: 12,
            padding: "20px 40px",
          }}
        >
          <Text strong style={{ fontSize: 22, color: "#1890ff" }}>
            Điểm: {score} / 10
          </Text>
        </div>
        <Button type="primary" onClick={onClose}>
          Thoát
        </Button>
      </Space>
    </Modal>
  );
};

export default ViewResult;
