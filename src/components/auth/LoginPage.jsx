import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, message, Modal } from "antd";
import axios from "axios";
import {
  setUserInfo,
  clearUserInfo,
  getLinkCongAPI,
  getLinkCongApi_gmail,
} from "../../globals/globals.js";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [step, setStep] = useState(1); // Bước 1: nhập email, 2: nhập mã, 3: đổi mật khẩu
  const [email, setEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState(""); // ✅ thêm state này
  const [userAccount, setUserAccount] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    clearUserInfo();
  }, []);

  // --- Đăng nhập ---
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(getLinkCongAPI() + "/dang-nhap", {
        ten_dang_nhap: values.ma_nguoi_dung,
        mat_khau: values.password,
      });

      const { token, user } = res.data;
      setUserInfo({ ...user, token });
      messageApi.success(`Đăng nhập thành công! Vai trò: ${user.vai_tro}`);

      if (["GiaoVu", "GiaoVien", "SinhVien"].includes(user.vai_tro)) {
        window.location.href = "/home";
      }
    } catch (error) {
      messageApi.error(
        error.response?.data?.message ||
          "Mã người dùng hoặc mật khẩu không đúng!"
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Bước 1: kiểm tra email, tạo mã random và gửi ---
  const handleCheckEmail = async (values) => {
    try {
      const emailToCheck = values.email;

      // 1️⃣ Gọi API mới: kiểm tra email & lấy thông tin tài khoản
      const res = await axios.post(
        getLinkCongAPI() + "/lay-tai-khoan-theo-email",
        {
          email: emailToCheck,
        }
      );

      if (res.data.success) {
        // Lấy ra thông tin tài khoản (để dùng ở bước đổi mật khẩu sau)
        const taiKhoan = res.data.data;
        console.log("Thông tin tài khoản lấy từ email:", taiKhoan);

        // 2️⃣ Sinh mã random 6 chữ số
        const randomCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const res = await axios.post(getLinkCongApi_gmail() + "/send-email", {
          email_receiver: emailToCheck,
          subject: "Mã xác thực khôi phục mật khẩu",
          message: `<h3>Xin chào,</h3><p>Mã xác thực của bạn là: <b>${randomCode}</b></p>`,
        });

        messageApi.success("✅ Đã gửi mã xác thực đến email của bạn!");

        // 4️⃣ Lưu thông tin để dùng ở bước xác thực
        setEmail(emailToCheck);
        setGeneratedCode(randomCode);
        setUserAccount(taiKhoan); // thêm dòng này để lưu thông tin tài khoản
        setStep(2);
      } else {
        messageApi.error(
          res.data.message || "Email không tồn tại trong hệ thống!"
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra hoặc gửi email:", error);
      messageApi.error("Lỗi khi kiểm tra hoặc gửi email!");
    }
  };

  // --- Bước 2: xác thực mã (so sánh trong UI) ---
  const handleVerifyCode = (values) => {
    if (values.code === generatedCode) {
      messageApi.success("Xác thực thành công! Vui lòng nhập mật khẩu mới.");
      setStep(3);
      console.log("Thông tin tài khoản để đổi mật khẩu:", userAccount);
    } else {
      messageApi.error("Mã xác thực không đúng!");
    }
  };

  // --- Bước 3: đổi mật khẩu ---
  const handleChangePassword = async (values) => {
    try {
      if (!userAccount?.id_tai_khoan) {
        messageApi.error("Không tìm thấy tài khoản để đổi mật khẩu!");
        return;
      }

      const res = await axios.post(getLinkCongAPI() + "/doi-mat-khau", {
        id_tai_khoan: userAccount.id_tai_khoan,
        new_password: values.new_password,
      });

      if (res.data.success) {
        messageApi.success("Đổi mật khẩu thành công!");
        setForgotVisible(false);
        setStep(1);
      } else {
        messageApi.error(res.data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      messageApi.error("Lỗi khi đổi mật khẩu!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f5f5",
      }}
    >
      {contextHolder}
      <Card
        style={{
          width: 360,
          padding: "20px 24px",
          textAlign: "center",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginLeft: "370px",
        }}
      >
        <Title
          level={2}
          style={{ color: "#1877f2", marginBottom: 20, fontWeight: "bold" }}
        >
          Đăng nhập
        </Title>

        <Form name="login-form" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ma_nguoi_dung"
            rules={[
              { required: true, message: "Vui lòng nhập mã người dùng!" },
            ]}
          >
            <Input placeholder="Tên đăng nhập" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: 10 }}>
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => setForgotVisible(true)}
            >
              Quên mật khẩu?
            </Button>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ background: "#1877f2" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Modal Forgot Password */}
      <Modal
        title="Khôi phục mật khẩu"
        open={forgotVisible}
        onCancel={() => {
          setForgotVisible(false);
          setStep(1);
        }}
        footer={null}
      >
        {step === 1 && (
          <Form layout="vertical" onFinish={handleCheckEmail}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi mã xác thực
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form layout="vertical" onFinish={handleVerifyCode}>
            <Form.Item
              label="Mã xác thực"
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã xác thực!" },
              ]}
            >
              <Input placeholder="Nhập mã được gửi qua email" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Xác thực mã
            </Button>
          </Form>
        )}

        {step === 3 && (
          <Form layout="vertical" onFinish={handleChangePassword}>
            <Form.Item
              label="Mật khẩu mới"
              name="new_password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đổi mật khẩu
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default LoginPage;
