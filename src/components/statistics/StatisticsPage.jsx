import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Spin,
  message,
  Statistic,
  Empty,
} from "antd";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  UserOutlined,
  FileOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import hamChung from "../../services/service.hamChung.js";
import {
  getToken,
  getLinkCongAPI,
  getRole,
  getUserInfo,
} from "../../globals/globals.js";

const StatisticsPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(0);
  const [passingScore, setPassingScore] = useState(5);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statisticsData, setStatisticsData] = useState(null);
  const [examList, setExamList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [studentCountByExam, setStudentCountByExam] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState([]);

  const userInfo = getUserInfo();

  // Kiểm tra quyền - chỉ GiaoVu mới xem được
  useEffect(() => {
    if (userInfo?.vai_tro !== "GiaoVu") {
      message.error("Bạn không có quyền truy cập trang này!");
      return;
    }
  }, [userInfo]);

  // Lấy danh sách kỳ thi
  const fetchExamList = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${getLinkCongAPI()}/dang_ky_thi`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.data) {
        setExamList(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kỳ thi:", error);
    }
  };

  // Lấy danh sách môn học
  const fetchSubjectList = async () => {
    try {
      const data = await hamChung.getAll("mon_hoc");
      setSubjectList(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách môn học:", error);
    }
  };

  // Lấy thống kê bài thi theo kỳ thi
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const token = getToken();

      // Lấy danh sách tất cả bài thi
      const [examsRes, studentExamsRes] = await Promise.all([
        axios.get(`${getLinkCongAPI()}/dang_ky_thi`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${getLinkCongAPI()}/thi`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      console.log("Exams Response:", examsRes);
      const exams = examsRes.data || [];
      const studentExams = studentExamsRes.data || [];

      // Lọc theo năm và tháng
      const filteredExams = exams.filter((exam) => {
        if (exam.ngay_thi) {
          const examDate = new Date(exam.ngay_thi);
          const yearMatch = examDate.getFullYear() === year;
          const monthMatch = month === 0 || examDate.getMonth() + 1 === month;
          const subjectMatch = selectedSubject === null || exam.ma_mh === selectedSubject;
          return yearMatch && monthMatch && subjectMatch;
        }
        return false;
      });
      console.log("All Exams:", exams);
      console.log("Filtered Exams:", filteredExams);

      // Tính toán số lượng sinh viên theo kỳ thi
      const examStats = filteredExams.map((exam) => {
        const count = studentExams.filter(
          (se) => se.id_dang_ky_thi === exam.id_dang_ky_thi,
        ).length;
        return {
          name: exam.name_mh || `Kỳ thi ${exam.id_dang_ky_thi}`,
          "Số sinh viên": count,
          id: exam.id_dang_ky_thi,
        };
      });

      setStudentCountByExam(examStats);

      // Tính toán phân phối điểm
      const scoreData = studentExams.filter((se) =>
        filteredExams.some((e) => e.id_dang_ky_thi === se.id_dang_ky_thi),
      );

      const scoreRanges = [
        { range: "0-2", min: 0, max: 2, count: 0 },
        { range: "2-4", min: 2, max: 4, count: 0 },
        { range: "4-6", min: 4, max: 6, count: 0 },
        { range: "6-8", min: 6, max: 8, count: 0 },
        { range: "8-10", min: 8, max: 10, count: 0 },
      ];

      scoreData.forEach((score) => {
        const point = score.diem || 0;
        scoreRanges.forEach((range) => {
          if (point >= range.min && point <= range.max) {
            range.count++;
          }
        });
      });

      setScoreDistribution(
        scoreRanges.map(({ range, count }) => ({
          name: `${range}`,
          value: count,
        })),
      );

      // Tính toán thống kê tổng
      const tongKyThiDuongDuyet = filteredExams.filter(
        (exam) => exam.trang_thai === "Da_phe_duyet",
      ).length;

      setStatisticsData({
        totalExams: filteredExams.length,
        totalStudents: scoreData.length,
        averageScore:
          scoreData.length > 0
            ? (
                scoreData.reduce((sum, se) => sum + (se.diem || 0), 0) /
                scoreData.length
              ).toFixed(2)
            : 0,
        passedStudents: scoreData.filter((se) => se.diem >= passingScore)
          .length,
        approvedExams: tongKyThiDuongDuyet,
      });

      message.success("Lấy thống kê thành công!");
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
      message.error("Lỗi khi lấy dữ liệu thống kê!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamList();
    fetchSubjectList();
    fetchStatistics();
  }, [year, month, passingScore, selectedSubject]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

  const handleYearChange = (value) => {
    setYear(value);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
  };

  // Chỉ hiển thị nếu là GiaoVu
  if (userInfo?.vai_tro !== "GiaoVu") {
    return (
      <div style={{ padding: "50px 20px" }}>
        <Empty description="Bạn không có quyền truy cập trang này!" />
      </div>
    );
  }

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - 2 + i;
    return { label: y.toString(), value: y };
  });

  const monthOptions = [
    { label: "Tất cả các tháng", value: 0 },
    ...Array.from({ length: 12 }, (_, i) => ({
      label: `Tháng ${i + 1}`,
      value: i + 1,
    })),
  ];

  return (
    <>
      <CustomBreadcrumb
        items={[{ label: "Trang Chủ" }, { label: "Thống Kê", isCurrent: true }]}
      />

      <div className="custom-card">
        <h1 style={{ marginBottom: 20 }}>Thống Kê Kỳ Thi</h1>

        {/* Bộ lọc */}
        <Card style={{ marginBottom: 20, padding: "28px 24px" }}>
          <Row gutter={[18, 18]}>
            <Col xs={24} sm={12} md={5}>
              <label style={{ fontWeight: 600, fontSize: "16px" }}>Năm:</label>
              <Select
                value={year}
                onChange={handleYearChange}
                options={yearOptions}
                style={{ width: "100%", marginTop: 10 }}
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <label style={{ fontWeight: 600, fontSize: "16px" }}>
                Tháng:
              </label>
              <Select
                value={month}
                onChange={handleMonthChange}
                options={monthOptions}
                style={{ width: "100%", marginTop: 10 }}
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <label style={{ fontWeight: 600, fontSize: "16px" }}>
                Môn học:
              </label>
              <Select
                value={selectedSubject}
                onChange={setSelectedSubject}
                allowClear
                placeholder="Chọn môn học (tùy chọn)"
                options={[
                  { label: "Tất cả môn học", value: null },
                  ...subjectList.map((subject) => ({
                    label: subject.ten_mh,
                    value: subject.ma_mh,
                  })),
                ]}
                style={{ width: "100%", marginTop: 10 }}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <label style={{ fontWeight: 600, fontSize: "16px" }}>
                Điểm chuẩn:
              </label>
              <Select
                value={passingScore}
                onChange={setPassingScore}
                options={Array.from({ length: 10 }, (_, i) => ({
                  label: `${i + 1} điểm`,
                  value: i + 1,
                }))}
                style={{ width: "100%", marginTop: 10 }}
              />
            </Col>
            <Col
              xs={24}
              sm={12}
              md={3}
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <Button
                type="primary"
                onClick={fetchStatistics}
                loading={loading}
                style={{ width: "100%", height: "36px", fontSize: "14px" }}
              >
                Tải dữ liệu
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Thống kê tổng quan */}
        <Spin spinning={loading}>
          {statisticsData && (
            <Row gutter={[16, 16]} style={{ marginBottom: 30 }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Kỳ thi được duyệt"
                    value={`${statisticsData.approvedExams}/${statisticsData.totalExams}`}
                    prefix={<FileOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tổng sinh viên tham gia"
                    value={statisticsData.totalStudents}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Điểm trung bình"
                    value={statisticsData.averageScore}
                    suffix="/ 10"
                    precision={2}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Sinh viên đạt yêu cầu"
                    value={statisticsData.passedStudents}
                    prefix={
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    }
                  />
                </Card>
              </Col>
            </Row>
          )}

          {/* Biểu đồ */}
          <Row gutter={[16, 16]}>
            {/* Biểu đồ cột - Số sinh viên theo kỳ thi */}
            <Col xs={24} md={12}>
              <Card title="Số sinh viên theo kỳ thi">
                {studentCountByExam.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentCountByExam}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Số sinh viên" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>

            {/* Biểu đồ tròn - Phân phối điểm */}
            <Col xs={24} md={12}>
              <Card title="Phân bố điểm sinh viên">
                {scoreDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    </>
  );
};

export default StatisticsPage;
