import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Typography,
  Space,
  message,
  Radio,
  Input,
} from "antd";
import { FullscreenExitOutlined } from "@ant-design/icons";
import hamChung from "../../../services/service.hamChung.js";
import CellDisplay from "../../common/CellDisplay.jsx";
import ViewResult from "./ViewResult.jsx"; // ✅ import thêm
import ExamInfo from "./ExamInfo.jsx"; // ✅ import component mới

const { confirm } = Modal;
const { Title, Text } = Typography;

const ExamFullScreen = ({ visible, exam, student, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(
    exam?.thoi_gian ? exam.thoi_gian * 60 : 0
  );
  // test cho thời giam là 3 s
  // const [timeLeft, setTimeLeft] = useState(3);

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false); // ✅ thêm
  const [score, setScore] = useState(0); // ✅ thêm
  const questionRefs = useRef({});
  const warnedRef = useRef(false);
  const [showExamInfo, setShowExamInfo] = useState(false);

  // Reset khi mở modal mới
  useEffect(() => {
    // test cho thời gian là 3 s
    setTimeLeft(exam?.thoi_gian ? exam.thoi_gian * 60 : 0);
    //  setTimeLeft(3);

    setStarted(false);
    setQuestions([]);
    setAnswers({});
    setShowResult(false);
    setScore(0);
    warnedRef.current = false;
  }, [exam, visible]);

  // ✅ Đếm ngược thời gian
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  // ✅ Cảnh báo & tự nộp khi hết giờ
  useEffect(() => {
    if (!started) return;
    if (timeLeft === 180 && !warnedRef.current) {
      warnedRef.current = true;
      message.warning("⏰ Còn 3 phút nữa là hết thời gian làm bài!", 5);
    }
    if (timeLeft === 0) {
      handleSubmitExam(true);
    }
  }, [timeLeft, started]);

  // ✅ Bắt đầu thi
  const handleStartExam = async () => {
    if (!exam?.id_dang_ky_thi) {
      message.error("Không xác định được kỳ thi!");
      return;
    }
    setLoading(true);
    try {
      const res = await hamChung.getListQuestionsByDangKyThi(
        exam.id_dang_ky_thi
      );
      console.log("Đề thi tải về:", res);
      if (res?.success) {
        setQuestions(res.data?.danh_sach_cau_hoi || []);
        setStarted(true);
      } else message.error(res?.message || "Không thể tải đề thi!");
    } catch {
      message.error("Không thể tải đề thi, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Ghi nhận đáp án
  const handleAnswerChange = (id_ch, value) => {
    setAnswers((prev) => ({ ...prev, [id_ch]: value }));
  };

  // ✅ Hàm định dạng thời gian
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ✅ Cuộn đến câu hỏi
  const scrollToQuestion = (id_ch) => {
    const el = questionRefs.current[id_ch];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  // ✅ Hàm gửi dữ liệu lên CSDL
  const submitToDatabase = async (answersData) => {
    // try {
    //   const payload = {
    //     id_dang_ky_thi: exam.id_dang_ky_thi,
    //     ma_sv: student.ma_sv,
    //     answers: answersData,
    //     thoi_gian_hoan_thanh: exam.thoi_gian * 60 - timeLeft, // thời gian đã làm
    //   };
    //   const res = await hamChung.submitExam(payload); // hamChung.submitExam là API bạn tạo
    //   if (res?.success) {
    //     message.success("✅ Kết quả đã được lưu vào cơ sở dữ liệu!");
    //   } else {
    //     message.error(res?.message || "Lưu kết quả thất bại!");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   message.error("Lỗi khi gửi dữ liệu lên cơ sở dữ liệu!");
    // }
    const payload = {
        id_dang_ky_thi: exam.id_dang_ky_thi,
        ma_sv: student.ma_sv,
        answers: answersData,
        thoi_gian_hoan_thanh: exam.thoi_gian * 60 - timeLeft, // thời gian đã làm
    }
    console.log("Dữ liệu gửi lên CSDL:", payload);
  };

  const handleSubmitExam = (isAuto = false) => {
    const doSubmit = async () => {
      setShowResult(true);
      await submitToDatabase(answers); // gửi dữ liệu lên CSDL
      message.success(
        isAuto
          ? "⏰ Hết giờ! Hệ thống đã tự động nộp bài."
          : "Nộp bài thành công!"
      );
    };

    if (isAuto) {
      // Không cần confirm, tự nộp luôn
      doSubmit();
      return;
    }

    // Nếu nộp sớm thì hỏi xác nhận
    confirm({
      title: "Xác nhận nộp bài",
      content: "Bạn có chắc chắn muốn nộp bài thi sớm không?",
      okText: "Nộp bài",
      cancelText: "Hủy",
      okType: "danger",
      centered: true,
      onOk() {
        doSubmit();
      },
      onCancel() {
        message.info("Tiếp tục làm bài nhé!");
      },
    });
  };

  return (
    <>
      {/* ✅ Nếu đang xem kết quả thì chỉ hiện ViewResult, ẩn giao diện thi */}
      {showResult ? (
        <ViewResult
          visible={showResult}
          questions={questions}
          answers={answers}
          onClose={() => {
            setShowResult(false);
            onClose && onClose();
          }}
        />
      ) : (
        <Modal
          title={null}
          open={visible}
          footer={null}
          width="100%"
          styles={{ body: { height: "100vh", padding: 0 } }}
          closable={false}
          maskClosable={false}
        >
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* HEADER */}
            <div
              style={{
                background: "#001529",
                color: "#fff",
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space direction="vertical" size={0}>
                <Title level={4} style={{ color: "#fff", margin: 0 }}>
                  THI TRẮC NGHIỆM MÔN: {exam?.ma_mh} -{" "}
                  <CellDisplay
                    table="mon_hoc"
                    id={exam?.ma_mh}
                    fieldName="ten_mh"
                  />
                </Title>
                <Text type="secondary">
                  Sinh viên: {student?.ma_sv} -{" "}
                  <CellDisplay
                    table="sinh_vien"
                    id={student?.ma_sv}
                    fieldName="ho_ten"
                  />
                </Text>
                <Text type="secondary">
                  Lớp học: {student?.ma_lop} -{" "}
                  <CellDisplay
                    table="lop"
                    id={student?.ma_lop}
                    fieldName="ten_lop"
                  />
                </Text>
              </Space>

              <Space>
                <Text style={{ color: "#fff" }}>
                  Thời gian còn lại: {formatTime(timeLeft)}
                </Text>
                <Button
                  danger
                  icon={<FullscreenExitOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: "Xác nhận thoát",
                      content:
                        "Bạn có chắc chắn muốn kết thúc làm bài và thoát không?",
                      okText: "Thoát",
                      cancelText: "Hủy",
                      okType: "danger",
                      centered: true,
                      onOk() {
                        onClose && onClose();
                        message.info("Đã thoát khỏi bài thi!");
                      },
                      onCancel() {
                        message.success("Tiếp tục làm bài nhé!");
                      },
                    });
                  }}
                >
                  Thoát
                </Button>
              </Space>
            </div>

            {/* BODY */}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: 24,
                background: "#f0f2f5",
              }}
            >
              {!started ? (
                <div style={{ textAlign: "center", marginTop: 80 }}>
                  <Title level={3}>Sẵn sàng làm bài?</Title>
                  <Text>Thời gian: {exam?.thoi_gian} phút</Text>

                  <div style={{ marginTop: 24 }}>
                    {/* ✅ Modal xem thông tin thi */}
                    {showExamInfo && (
                      <ExamInfo
                        visible={showExamInfo}
                        onClose={() => setShowExamInfo(false)}
                        exam={exam}
                      />
                    )}

                    {/* ✅ Thứ tự: Xem thông tin → Bắt đầu → Hủy */}
                    <Button
                      style={{ marginRight: 12 }}
                      onClick={() => setShowExamInfo(true)}
                    >
                      Xem thông tin
                    </Button>

                    <Button
                      type="primary"
                      size="large"
                      loading={loading}
                      onClick={handleStartExam}
                      style={{ marginRight: 12 }}
                    >
                      {loading ? "Đang tải đề..." : "Bắt đầu làm bài"}
                    </Button>

                    <Button danger onClick={() => onClose()}>
                      Chưa sẵn sàng
                    </Button>
                  </div>
                </div>
              ) : (
                <Row gutter={16}>
                  {/* DANH SÁCH CÂU HỎI */}
                  <Col span={18}>
                    {questions.map((q, idx) => (
                      <div
                        key={q.id_ch || idx}
                        ref={(el) => (questionRefs.current[q.id_ch] = el)}
                        style={{
                          padding: 16,
                          background: "#fff",
                          marginBottom: 16,
                          borderRadius: 8,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Text strong>Câu {idx + 1}: </Text>
                        <Text>{q.noi_dung}</Text>

                        <div style={{ marginTop: 12 }}>
                          {q.loai === "chon_1" && Array.isArray(q.chon_lua) && (
                            <Radio.Group
                              onChange={(e) =>
                                handleAnswerChange(q.id_ch, e.target.value)
                              }
                              value={answers[q.id_ch]}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginTop: 8,
                              }}
                            >
                              {q.chon_lua.map((opt, optIdx) => (
                                <Radio
                                  key={opt.id_chon_lua}
                                  value={opt.noi_dung}
                                >
                                  {String.fromCharCode(65 + optIdx)}.{" "}
                                  {opt.noi_dung}
                                </Radio>
                              ))}
                            </Radio.Group>
                          )}

                          {q.loai === "yes_no" && (
                            <Radio.Group
                              onChange={(e) =>
                                handleAnswerChange(q.id_ch, e.target.value)
                              }
                              value={answers[q.id_ch]}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginTop: 8,
                              }}
                            >
                              <Radio value="Yes">Đúng</Radio>
                              <Radio value="No">Sai</Radio>
                            </Radio.Group>
                          )}

                          {q.loai === "dien_khuyet" && (
                            <Input
                              placeholder="Nhập câu trả lời..."
                              value={answers[q.id_ch] || ""}
                              onChange={(e) =>
                                handleAnswerChange(q.id_ch, e.target.value)
                              }
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </Col>

                  {/* BẢNG ĐIỀU KHIỂN */}
                  <Col span={6}>
                    <div style={{ position: "sticky", top: 24 }}>
                      <Title level={5}>Bảng điều khiển</Title>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "2px solid #1890ff",
                          borderRadius: 8,
                          padding: "8px 16px",
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#1890ff",
                          margin: "12px auto",
                          width: "fit-content",
                          background: "#f0f8ff",
                        }}
                      >
                        {formatTime(timeLeft)}
                      </div>

                      {/* Danh sách câu */}
                      <div
                        style={{
                          marginTop: 16,
                          maxHeight: "65vh",
                          overflowY: "auto",
                          border: "1px solid #ddd",
                          borderRadius: 8,
                          padding: 8,
                          background: "#fff",
                        }}
                      >
                        {questions.map((q, idx) => {
                          const answered =
                            answers[q.id_ch] !== undefined &&
                            answers[q.id_ch] !== "";
                          let display = "—";
                          if (answered) {
                            if (q.loai === "chon_1") {
                              const index = q.chon_lua?.findIndex(
                                (opt) => opt.noi_dung === answers[q.id_ch]
                              );
                              display =
                                index >= 0
                                  ? String.fromCharCode(65 + index)
                                  : "—";
                            } else if (q.loai === "yes_no") {
                              display =
                                answers[q.id_ch] === "Yes" ? "Đúng" : "Sai";
                            } else display = answers[q.id_ch];
                          }

                          return (
                            <div
                              key={q.id_ch}
                              onClick={() => scrollToQuestion(q.id_ch)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                padding: "6px 8px",
                                marginBottom: 6,
                                borderRadius: 6,
                                border: "1px solid #ddd",
                                background: answered ? "#e6fffb" : "#fff",
                              }}
                            >
                              <div
                                style={{
                                  width: "30%",
                                  textAlign: "center",
                                  color: answered ? "#1890ff" : "#000",
                                }}
                              >
                                {idx + 1}
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                  textAlign: "center",
                                  color: answered ? "#000" : "#aaa",
                                }}
                              >
                                {display}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <Button
                          danger
                          block
                          onClick={() => handleSubmitExam(false)}
                        >
                          Nộp bài
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ExamFullScreen;
