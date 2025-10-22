import React from "react";
import { Modal, Typography, Button, Space } from "antd";

const { Title, Text } = Typography;

const ExamResult = ({ visible, score, correctCount, total, onClose }) => {
  return (
    <Modal
      open={visible}
      title={<Title level={4}>🎯 Kết quả bài thi</Title>}
      footer={null}
      centered
      maskClosable={false}
      closable={false}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%", textAlign: "center" }}>
        <Text strong style={{ fontSize: 18 }}>
          Số câu đúng: {correctCount}/{total}
        </Text>
        <Text style={{ fontSize: 18 }}>
          Điểm: <Text strong style={{ color: "#1890ff" }}>{score}</Text>
        </Text>

        <Button type="primary" onClick={onClose}>
          Đóng
        </Button>
      </Space>
    </Modal>
  );
};

export default ExamResult;
