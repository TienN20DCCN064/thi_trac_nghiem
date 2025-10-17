import React from "react";
import { Modal } from "antd";

const ViewExamModal = ({ visible, record, onCancel }) => {
  return (
    <Modal
      title="Xem lại bài thi"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {/* Nội dung xem lại bài thi sẽ được thêm sau */}
      <div>Đang phát triển tính năng xem lại bài thi...</div>
    </Modal>
  );
};

export default ViewExamModal;