import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { getUserInfo } from "../../../globals/globals.js";
import hamChiTiet from "../../../services/service.hamChiTiet.js";
import hamChung from "../../../services/service.hamChung.js";

const CheckExamForm = ({ onSuccess } = {}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const accountId = getUserInfo()?.id_tai_khoan;
      if (!accountId) {
        message.error('Vui lòng đăng nhập để tiếp tục');
        return;
      }

      const userInfo = await hamChiTiet.getUserInfoByAccountId(accountId);
      if (!userInfo?.ma_sv) {
        message.error('Không tìm thấy thông tin sinh viên');
        return;
      }

      if (values.ma_sv !== userInfo.ma_sv) {
        message.error('Mã sinh viên không chính xác');
        return;
      }

      const monHoc = await hamChung.getAll('mon_hoc');
      const foundMH = (monHoc || []).find(mh => mh.ma_mh === values.ma_mh);
      if (!foundMH) {
        message.error('Mã môn học không tồn tại');
        return;
      }

      const dangKyThi = await hamChung.getAll('dang_ky_thi');
      const foundDKT = (dangKyThi || []).find(dk =>
        dk.ma_mh === values.ma_mh &&
        dk.ma_lop === userInfo.ma_lop &&
        dk.trang_thai === 'Da_phe_duyet'
      );

      if (!foundDKT) {
        message.error('Môn học này chưa có lịch thi hoặc chưa được phê duyệt');
        return;
      }

      const thiRecords = await hamChung.getAll('thi');
      const daThi = (thiRecords || []).find(t =>
        String(t.ma_sv) === String(values.ma_sv) &&
        String(t.id_dang_ky_thi) === String(foundDKT.id_dang_ky_thi)
      );

      if (daThi) {
        message.error('Bạn đã thi môn học này');
        return;
      }

      // thành công -> gọi callback để mở giao diện thi full screen
      message.success('Kiểm tra thành công! Bắt đầu làm bài.');
      form.resetFields();
      if (typeof onSuccess === 'function') {
        onSuccess(foundDKT, userInfo);
      }

    } catch (err) {
      console.error(err);
      message.error('Đã có lỗi xảy ra khi kiểm tra thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: '0 auto' }}
    >
      <Form.Item
        label="Mã sinh viên"
        name="ma_sv"
        rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
      >
        <Input placeholder="Nhập mã sinh viên" />
      </Form.Item>

      <Form.Item
        label="Mã môn học"
        name="ma_mh"
        rules={[{ required: true, message: 'Vui lòng nhập mã môn học' }]}
      >
        <Input placeholder="Nhập mã môn học" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Kiểm tra
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CheckExamForm;