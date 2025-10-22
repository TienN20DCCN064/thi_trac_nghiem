import React, { useEffect, useState } from "react";
import { Modal, Card, Typography, Space, Tag, Radio, Divider } from "antd";
import hamChung from "../../../services/service.hamChung";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const ViewExamModal = ({ visible, record, onCancel }) => {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExamData = async () => {
      if (visible && record?.id_dang_ky_thi) {
        try {
          setLoading(true);
          const response = await hamChung.getOneExamForSV(
            record.id_dang_ky_thi,
            record.thi_record.ma_sv
          );
          console.log("Dữ liệu bài thi nhận được:", response);
          setExamData(response);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu bài thi:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExamData();
  }, [visible, record]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderQuestion = (question, index) => {
    const isCorrect = question.cau_tra_loi === question.dap_an_dung;

    return (
      <Card 
        className="question-card" 
        style={{ 
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: "16px"
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* Số thứ tự và trạng thái đúng/sai */}
          <Space>
            <Text strong>{`Câu ${index + 1}:`}</Text>
            <Tag color={isCorrect ? "success" : "error"}>
              {isCorrect ? (
                <>
                  <CheckCircleOutlined /> Đúng
                </>
              ) : (
                <>
                  <CloseCircleOutlined /> Sai
                </>
              )}
            </Tag>
          </Space>

          {/* Nội dung câu hỏi */}
          <div className="question-content">
            <Text>{question.noi_dung}</Text>
          </div>

          {/* Hiển thị các lựa chọn */}
          {question.loai === "chon_1" && question.chon_lua?.length > 0 && (
            <div className="choices-section" style={{ marginTop: 8 }}>
              <Radio.Group
                value={question.cau_tra_loi}
                disabled
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {question.chon_lua.map((choice) => (
                    <Radio
                      key={choice.id_chon_lua}
                      value={choice.noi_dung}
                      style={{
                        ...(choice.noi_dung === question.dap_an_dung && {
                          color: "#52c41a",
                        }),
                        ...(isCorrect === false &&
                          choice.noi_dung === question.cau_tra_loi && {
                            color: "#ff4d4f",
                          }),
                      }}
                    >
                      {choice.noi_dung}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          )}

          {question.loai === "yes_no" && (
            <div className="choices-section" style={{ marginTop: 8 }}>
              <Radio.Group
                value={question.cau_tra_loi}
                disabled
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {["Yes", "No"].map((choice) => (
                    <Radio
                      key={choice}
                      value={choice}
                      style={{
                        ...(choice === question.dap_an_dung && {
                          color: "#52c41a",
                        }),
                        ...(isCorrect === false &&
                          choice === question.cau_tra_loi && {
                            color: "#ff4d4f",
                          }),
                      }}
                    >
                      {choice}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          )}

          {question.loai === "dien_khuyet" && (
            <div className="fill-in-answer" style={{ marginTop: 8 }}>
              <Text strong>Câu trả lời: </Text>
              <Text
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "4px 8px",
                  borderRadius: 4,
                  color: isCorrect ? "#52c41a" : "#ff4d4f",
                }}
              >
                {question.cau_tra_loi}
              </Text>
            </div>
          )}

          {/* Phần câu trả lời */}
          <div className="answer-section" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {/* Đáp án đúng */}
              <div>
                <Text strong>Đáp án đúng: </Text>
                <Text style={{ color: "#52c41a" }}>{question.dap_an_dung}</Text>
              </div>

              {/* Câu trả lời của thí sinh */}
              <div>
                <Text strong>Câu trả lời của bạn: </Text>
                <Text style={{ color: isCorrect ? "#52c41a" : "#ff4d4f" }}>
                  {question.cau_tra_loi || "(Chưa trả lời)"}
                </Text>
              </div>
            </Space>
          </div>
        </Space>
      </Card>
    );
  };

  return (
    <Modal
      title="Kết quả bài thi"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1200} // Increased from 800 to 1200
      bodyStyle={{ 
        maxHeight: "90vh", // Increased from 80vh to 90vh
        overflow: "auto",
        padding: "24px" 
      }}
    >
      {loading ? (
        <div>Đang tải...</div>
      ) : examData ? (
        <>
          {/* Thông tin tổng quan */}
          <Card 
            style={{ 
              marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={4}>{examData.chi_tiet_thi[0]?.ten_mh}</Title>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  fontSize: "16px"
                }}
              >
                <Text>
                  <strong>Điểm số:</strong>{" "}
                  <Text style={{ color: "#1890ff", fontSize: 20, fontWeight: "bold" }}>
                    {examData.thi.diem}
                  </Text>
                </Text>
                <Text>
                  <strong>Trạng thái:</strong>{" "}
                  <Tag color="success" style={{ fontSize: "14px", padding: "4px 12px" }}>
                    {examData.thi.trang_thai}
                  </Tag>
                </Text>
                <Text>
                  <strong>Bắt đầu:</strong>{" "}
                  {formatDate(examData.thi.thoi_gian_bat_dau)}
                </Text>
                <Text>
                  <strong>Kết thúc:</strong>{" "}
                  {formatDate(examData.thi.thoi_gian_ket_thuc)}
                </Text>
              </div>
            </Space>
          </Card>

          <Divider style={{ fontSize: "18px", margin: "24px 0" }}>
            Danh sách câu hỏi
          </Divider>

          {/* Danh sách câu hỏi */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {examData.chi_tiet_thi.map((question, index) =>
              renderQuestion(question, index)
            )}
          </div>
        </>
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </Modal>
  );
};

export default ViewExamModal;
