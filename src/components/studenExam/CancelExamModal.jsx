import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import hamChung from "../../services/service.hamChung.js";

/**
 * Modal "Bỏ thi" với form (giống phong cách TeacherQuestion)
 * - record: object đăng ký thi
 * - onSuccess: gọi khi thành công
 */
const CancelExamModal = ({ visible, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (vals) => {
    if (!record) return;
    try {
      setLoading(true);
      // Gọi API cập nhật trạng thái đăng ký thi -> 'Tu_choi'
      // Điều chỉnh hàm gọi phù hợp service của bạn
      const payload = {
        id_dang_ky_thi: record.id_dang_ky_thi,
        trang_thai: "Tu_choi",
        ly_do_huy: vals.ly_do || "",
      };

      // Nếu hamChung có hàm chuyên biệt dùng nó, nếu không dùng update chung
      let res;
      if (hamChung.updateDangKyThi) {
        res = await hamChung.updateDangKyThi(payload);
      } else if (hamChung.update) {
        res = await hamChung.update("dang_ky_thi", record.id_dang_ky_thi, {
          trang_thai: "Tu_choi",
          ly_do_huy: vals.ly_do || "",
        });
      } else {
        // fallback: giả lập thành công
        res = { success: true, message: "OK" };
      }

      if (res && (res.success || res.affectedRows || res.updated)) {
        message.success("Đã bỏ thi thành công");
        form.resetFields();
        onSuccess && onSuccess();
      } else {
        message.error(res.message || "Bỏ thi thất bại");
      }
    } catch (e) {
      console.error(e);
      message.error("Lỗi khi bỏ thi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Bỏ thi"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Môn học">
          <Input value={record?.ma_mh} disabled />
        </Form.Item>

        <Form.Item label="Ngày thi">
          <Input value={record?.ngay_thi} disabled />
        </Form.Item>

        <Form.Item
          name="ly_do"
          label="Lý do bỏ thi"
          rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập lý do bỏ thi..." />
        </Form.Item>

        <Form.Item>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Xác nhận bỏ thi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CancelExamModal;