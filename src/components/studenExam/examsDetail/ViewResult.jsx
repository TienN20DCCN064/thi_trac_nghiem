// 📁 src/components/exam/ViewResult.jsx
import React, { useMemo } from "react";
import { Modal, Typography, Button, Space } from "antd";

const { Title, Text } = Typography;

/**
 * Component hiển thị kết quả bài thi.
 * @param {Object} props
 * @param {boolean} visible - Trạng thái hiển thị modal
 * @param {Array} questions - Danh sách câu hỏi [{id_ch, loai, dap_an_dung, chon_lua, ...}]
 * @param {Object} answers - Câu trả lời của sinh viên { id_ch: "..." }
 * @param {Function} onClose - Hàm đóng modal
 */
const ViewResult = ({ visible, questions = [], answers = {}, onClose }) => {
  console.log("ViewResult render", { questions, answers });
  // ✅ Tính điểm dựa trên danh sách câu hỏi & câu trả lời
  const { score, total, correctCount } = useMemo(() => {
    if (!questions || questions.length === 0) return { score: 0, total: 0, correctCount: 0 };

    let correct = 0;

    questions.forEach((q) => {
      const svAnswer = answers[q.id_ch];

      // Xác định đúng / sai tùy loại câu hỏi
      if (q.loai === "chon_1" && svAnswer) {
        // Câu trắc nghiệm 1 lựa chọn
        if (svAnswer.trim().toLowerCase() === q.dap_an_dung?.trim().toLowerCase()) correct++;
      } else if (q.loai === "yes_no" && svAnswer) {
        if (svAnswer.toLowerCase() === q.dap_an_dung?.toLowerCase()) correct++;
      } else if (q.loai === "dien_khuyet" && svAnswer) {
        if (svAnswer.trim().toLowerCase() === q.dap_an_dung?.trim().toLowerCase()) correct++;
      }
    });

    const total = questions.length;
    const score = ((correct / total) * 10).toFixed(2); // Điểm trên thang 10
    return { score, total, correctCount: correct };
  }, [questions, answers]);

  return (
   <Modal
  open={visible}
  footer={null}
  closable={false}
  centered
  width={500}
  styles={{
    body: {
      textAlign: "center",
      padding: "40px 24px",
    },
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
          <br />
          <Text style={{ fontSize: 16 }}>
            Đúng {correctCount}/{total} câu
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
