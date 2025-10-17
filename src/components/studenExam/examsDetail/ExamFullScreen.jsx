import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Button, Typography, Space } from "antd";
import { FullscreenExitOutlined } from "@ant-design/icons";
import hamChung from "../../../services/service.hamChung.js";

const { Title, Text } = Typography;

/**
 * Props:
 * - visible
 * - exam: đăng ký thi record (foundDKT)
 * - student: userInfo
 * - onClose
 */
const ExamFullScreen = ({ visible, exam, student, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(exam?.thoi_gian ? exam.thoi_gian * 60 : 0);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setTimeLeft(exam?.thoi_gian ? exam.thoi_gian * 60 : 0);
    setStarted(false);
    setQuestions([]);
  }, [exam, visible]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft]);

  // demo: load questions related to exam (you should adapt logic)
  useEffect(() => {
    const load = async () => {
      if (!exam) return;
      try {
        // giả sử bảng 'cau_hoi' và có trường ma_mh hoặc id_dang_ky_thi liên kết
        const all = await hamChung.getAll("cau_hoi");
        const related = (all || []).filter(q => String(q.ma_mh) === String(exam.ma_mh));
        setQuestions(related.slice(0, 20)); // lấy tạm 20 câu
      } catch (e) {
        console.error(e);
        setQuestions([]);
      }
    };
    load();
  }, [exam]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={() => {}}
      footer={null}
      width="100%"
      style={{ top: 0, padding: 0 }}
      bodyStyle={{ height: "100vh", padding: 0 }}
      closable={false}
      maskClosable={false}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{
          background: "#001529", color: "#fff",
          padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <Space>
            <Title level={4} style={{ color: "#fff", margin: 0 }}>
              Bài thi: {exam?.ma_mh} - {exam?.ten_mh || ""}
            </Title>
            <Text type="secondary">Mã SV: {student?.ma_sv}</Text>
          </Space>

          <Space>
            <Text style={{ color: "#fff" }}>Thời gian còn lại: {formatTime(timeLeft)}</Text>
            <Button
              danger
              icon={<FullscreenExitOutlined />}
              onClick={() => {
                // confirm close/submit nếu muốn
                if (window.confirm("Kết thúc làm bài và thoát?")) {
                  onClose && onClose();
                }
              }}
            >
              Thoát
            </Button>
          </Space>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 24, background: "#f0f2f5" }}>
          {!started ? (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <Title level={3}>Sẵn sàng làm bài?</Title>
              <Text>Thời gian: {exam?.thoi_gian} phút</Text>
              <div style={{ marginTop: 24 }}>
                <Button type="primary" size="large" onClick={() => setStarted(true)}>
                  Bắt đầu làm bài
                </Button>
                <Button style={{ marginLeft: 12 }} onClick={() => onClose && onClose()}>
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Row gutter={16}>
                <Col span={18}>
                  {/* Demo hiển thị danh sách câu hỏi dạng liệt kê; thay bằng UI đề thi thực */}
                  {questions.length === 0 ? (
                    <div>Không có câu hỏi demo cho môn này.</div>
                  ) : (
                    questions.map((q, idx) => (
                      <div key={q.id || idx} style={{ padding: 12, background: "#fff", marginBottom: 12 }}>
                        <Text strong>{idx + 1}. </Text>
                        <Text>{q.noi_dung || q.tieu_de || "Nội dung câu hỏi demo"}</Text>
                        {/* TODO: hiển thị đáp án, lựa chọn, lưu câu trả lời */}
                      </div>
                    ))
                  )}
                </Col>
                <Col span={6}>
                  <div style={{ position: "sticky", top: 24 }}>
                    <Title level={5}>Bảng điều khiển</Title>
                    <div>Thời gian: {formatTime(timeLeft)}</div>
                    <div style={{ marginTop: 12 }}>
                      <Button danger onClick={() => {
                        if (window.confirm("Nộp bài và kết thúc?")) {
                          // TODO: nộp kết quả lên server
                          onClose && onClose();
                        }
                      }}>
                        Nộp bài
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ExamFullScreen;