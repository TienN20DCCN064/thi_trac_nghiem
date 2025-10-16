import React, { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import hamChung from "../../services/service.hamChung.js";
import { useParams } from "react-router-dom";
import CellDisplay from "../common/CellDisplay.jsx";

const StudentExamDetail = () => {
  const { examId } = useParams();
  const [loading, setLoading] = useState(false);
  const [examDetail, setExamDetail] = useState(null);

  useEffect(() => {
    const fetchExamDetail = async () => {
      setLoading(true);
      try {
        const detail = await hamChung.getAll("dang_ky_thi", { id: examId });
        if (detail && detail.length > 0) {
          setExamDetail(detail[0]);
        } else {
          message.error("Không tìm thấy thông tin đăng ký thi.");
        }
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi tải thông tin chi tiết.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetail();
  }, [examId]);

  if (loading) return <Spin style={{ margin: 20 }} />;

  return (
    <Card title="Chi tiết đăng ký thi">
      {examDetail ? (
        <div>
          <p><strong>Môn học:</strong> <CellDisplay table="mon_hoc" id={examDetail.ma_mh} fieldName="ten_mh" /></p>
          <p><strong>Ngày thi:</strong> {examDetail.ngay_thi}</p>
          <p><strong>Thời gian (phút):</strong> {examDetail.thoi_gian}</p>
          <p><strong>Trạng thái:</strong> {examDetail.trang_thai}</p>
          <p><strong>Lý do hủy:</strong> {examDetail.ly_do_huy || "Không có"}</p>
        </div>
      ) : (
        <p>Không có thông tin chi tiết để hiển thị.</p>
      )}
    </Card>
  );
};

export default StudentExamDetail;