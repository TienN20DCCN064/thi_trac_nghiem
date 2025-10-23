import React, { useEffect, useState, useRef, useMemo } from "react";
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
import ExamInfo from "./ExamInfo.jsx";
import ExamResult from "./ExamResult.jsx"; // ✅ import ExamResult

import { createActions } from "../../../redux/actions/factoryActions.js";
import { useDispatch } from "react-redux";
const dangKyThiActions = createActions("dang_ky_thi");

const { confirm } = Modal;
const { Title, Text } = Typography;

const ExamFullScreen = ({ visible, exam, student, onClose }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(
    exam?.thoi_gian ? exam.thoi_gian * 60 : 0
  );

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const questionRefs = useRef({});
  const warnedRef = useRef(false);
  const [showExamInfo, setShowExamInfo] = useState(false);

  // result modal state (local, also sync to URL)
  const [showResult, setShowResult] = useState(false);

  // Thêm state để lưu trữ dữ liệu câu hỏi
  const [questionsData, setQuestionsData] = useState(null);

  // Reset khi mở modal mới
  useEffect(() => {
    setTimeLeft(exam?.thoi_gian ? exam.thoi_gian * 60 : 0);
    setStarted(false);
    setQuestions([]);
    setAnswers({});
    setScore(0);
    warnedRef.current = false;
    setShowResult(false);
  }, [exam, visible]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

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
        setQuestionsData(res.data); // Lưu trữ dữ liệu câu hỏi
        setStarted(true);
      } else message.error(res?.message || "Không thể tải đề thi!");
    } catch {
      message.error("Không thể tải đề thi, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (id_ch, value) => {
    setAnswers((prev) => ({ ...prev, [id_ch]: value }));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const scrollToQuestion = (id_ch) => {
    const el = questionRefs.current[id_ch];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const {
    score: computedScore,
    total,
    correctCount,
  } = useMemo(() => {
    if (!questions || questions.length === 0)
      return { score: 0, total: 0, correctCount: 0 };

    let correct = 0;

    questions.forEach((q) => {
      const svAnswer = answers[q.id_ch];
      if (!svAnswer) return;

      if (q.loai === "chon_1") {
        if (
          svAnswer.trim().toLowerCase() === q.dap_an_dung?.trim().toLowerCase()
        )
          correct++;
      } else if (q.loai === "yes_no") {
        if (svAnswer.toLowerCase() === q.dap_an_dung?.toLowerCase()) correct++;
      } else if (q.loai === "dien_khuyet") {
        if (
          svAnswer.trim().toLowerCase() === q.dap_an_dung?.trim().toLowerCase()
        )
          correct++;
      }
    });

    const total = questions.length || 0;
    const score = total === 0 ? 0 : ((correct / total) * 10).toFixed(2);

    return { score, total, correctCount: correct };
  }, [questions, answers]);

  const submitToDatabase = async (answersData) => {
    // 🕒 Hàm định dạng thời gian theo chuẩn SQL DATETIME
    const formatDateTime = (timestamp) => {
      const date = new Date(timestamp);
      const pad = (n) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;
    };

    const timeNow = Date.now();

    // 🧮 Tính thời gian bắt đầu (nếu đang thi thì tính ngược lại)
    const startTime = started
      ? timeNow - (exam.thoi_gian * 60 - timeLeft) * 1000
      : timeNow;

    // 🧩 Làm sạch dữ liệu câu hỏi + thêm đáp án sinh viên
    const listQuestions = (questionsData?.danh_sach_cau_hoi || []).map((q) => {
      const cleaned = { ...q };

      // Loại bỏ các trường không cần thiết
      delete cleaned.loai;
      delete cleaned.noi_dung;
      delete cleaned.dap_an_dung;
      delete cleaned.ma_mh;
      delete cleaned.chon_lua;
      delete cleaned.chuong_so;

      // Ghi nhận đáp án sinh viên (nếu không có thì để rỗng)
      cleaned.cau_tra_loi = answersData[q.id_ch] ?? "";

      return cleaned;
    });

    // 📦 Tạo payload gửi lên CSDL
    const payload = {
      id_dang_ky_thi: exam.id_dang_ky_thi,
      ma_sv: student.ma_sv,
      thoi_gian_bat_dau: formatDateTime(startTime),
      thoi_gian_ket_thuc: formatDateTime(timeNow),
      diem: computedScore,
      chi_tiet_thi: listQuestions,
    };

    console.log("📘 Đề thi tải về:", questionsData);
    console.log("📦 Dữ liệu gửi lên CSDL:", payload);

    try {
      // ⏳ Gửi kết quả thi lên API
      const res = await hamChung.submitOneExamForSV(payload);
      message.success(res.message || "✅ Nộp bài thi thành công!");
      console.log("📨 Kết quả API:", res);
    } catch (err) {
      message.error("❌ Lỗi khi nộp bài thi!");
      console.error(err);
    }

    // 🧩 Cập nhật query string để hiển thị kết quả (score, correct, total)
    try {
      const q = new URLSearchParams(window.location.search);
      q.set("score", String(computedScore));
      q.set("correct", String(correctCount));
      q.set("total", String(total));

      const newUrl = `${window.location.pathname}?${q.toString()}`;
      window.history.pushState(null, "", newUrl);

      // Phát sự kiện để component khác (ExamResult) có thể lắng nghe
      try {
        window.dispatchEvent(new PopStateEvent("popstate"));
      } catch {
        window.dispatchEvent(new Event("urlchange"));
      }
    } catch (e) {
      console.error("⚠️ Lỗi khi cập nhật URL:", e);
    }
    dispatch(dangKyThiActions.creators.fetchAllRequest());
    // ✅ Không ẩn bài thi tại đây — chỉ trả về dữ liệu kết quả
    return {
      score: computedScore,
      correct: correctCount,
      total,
    };
  };

  const handleSubmitExam = (isAuto = false) => {
    const doSubmit = async () => {
      await submitToDatabase(answers);
      // show result modal locally as well
      setShowResult(true);
      message.success(
        isAuto
          ? "⏰ Hết giờ! Hệ thống đã tự động nộp bài."
          : "Nộp bài thành công!"
      );
    };

    if (isAuto) {
      doSubmit();
      return;
    }

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

  const handleCloseResult = () => {
    // xóa params khỏi URL khi đóng
    const q = new URLSearchParams(window.location.search);
    q.delete("score");
    q.delete("correct");
    q.delete("total");
    const qs = q.toString();
    const newUrl = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;
    window.history.pushState(null, "", newUrl);

    setShowResult(false);
    // close exam full screen after viewing result
    onClose && onClose();
  };

  return (
    <>
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
                  {showExamInfo && (
                    <ExamInfo
                      visible={showExamInfo}
                      onClose={() => setShowExamInfo(false)}
                      exam={exam}
                    />
                  )}

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
                              <Radio key={opt.id_chon_lua} value={opt.noi_dung}>
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

      <ExamResult
        visible={showResult}
        score={computedScore}
        correctCount={correctCount}
        total={total}
        onClose={handleCloseResult}
      />
    </>
  );
};

export default ExamFullScreen;
