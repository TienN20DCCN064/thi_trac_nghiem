import React, { useEffect, useState } from "react";
import { Spin, message, Card } from "antd";
import StudentExamDetail from "../components/studenExam/StudentExamDetail.jsx";
import hamChung from "../services/service.hamChung.js";
import { useParams } from "react-router-dom";

const StudentExamDetailPage = () => {
  const { examId } = useParams();
  const [loading, setLoading] = useState(false);
  const [examDetail, setExamDetail] = useState(null);

  useEffect(() => {
    const fetchExamDetail = async () => {
      setLoading(true);
      try {
        const detail = await hamChung.getExamDetail(examId);
        setExamDetail(detail);
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi tải thông tin chi tiết kỳ thi");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetail();
  }, [examId]);

  if (loading) return <Spin style={{ margin: 20 }} />;

  return (
    <Card title="Chi tiết kỳ thi">
      {examDetail ? <StudentExamDetail detail={examDetail} /> : <p>Không có thông tin kỳ thi.</p>}
    </Card>
  );
};

export default StudentExamDetailPage;