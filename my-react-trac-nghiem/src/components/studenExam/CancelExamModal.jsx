import React, { useEffect, useState } from "react";
import { Modal, Button, Spin, message } from "antd";
import hamChung from "../../services/service.hamChung.js";
import { getUserInfo } from "../../globals/globals.js";

/**
 * Modal to display detailed information about an exam registration
 * - record: object containing exam registration details
 */
const StudentExamDetail = ({ visible, record, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [examDetails, setExamDetails] = useState(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!record) return;

      setLoading(true);
      try {
        const details = await hamChung.getExamDetails(record.id_dang_ky_thi);
        setExamDetails(details);
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi tải thông tin chi tiết kỳ thi");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [record]);

  if (loading) return <Spin style={{ margin: 20 }} />;

  return (
    <Modal
      title="Chi tiết đăng ký thi"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      {examDetails ? (
        <div>
          <p><strong>Môn học:</strong> {examDetails.ma_mh}</p>
          <p><strong>Ngày thi:</strong> {examDetails.ngay_thi}</p>
          <p><strong>Thời gian:</strong> {examDetails.thoi_gian} phút</p>
          <p><strong>Trạng thái:</strong> {examDetails.trang_thai}</p>
          <p><strong>Lý do bỏ thi:</strong> {examDetails.ly_do_huy || "Không có"}</p>
        </div>
      ) : (
        <p>Không có thông tin chi tiết.</p>
      )}
    </Modal>
  );
};

export default StudentExamDetail;