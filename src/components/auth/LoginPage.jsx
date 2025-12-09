import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  message,
  Modal,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  setUserInfo,
  clearUserInfo,
  getLinkCongAPI,
  getLinkCongApi_gmail,
} from "../../globals/globals.js";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
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

  // --- Bước 1: kiểm tra email ---
  const handleCheckEmail = async (values) => {
    try {
      const emailToCheck = values.email;
      const res = await axios.post(
        getLinkCongAPI() + "/lay-tai-khoan-theo-email",
        { email: emailToCheck }
      );

      if (res.data.success) {
        const taiKhoan = res.data.data;
        const randomCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        await axios.post(getLinkCongApi_gmail() + "/send-email", {
          email_receiver: emailToCheck,
          subject: "Mã xác thực khôi phục mật khẩu",
          message: `<h3>Xin chào,</h3><p>Mã xác thực của bạn là: <b>${randomCode}</b></p>`,
        });

        messageApi.success("✅ Đã gửi mã xác thực đến email của bạn!");
        setEmail(emailToCheck);
        setGeneratedCode(randomCode);
        setUserAccount(taiKhoan);
        setStep(2);
      } else {
        messageApi.error(
          res.data.message || "Email không tồn tại trong hệ thống!"
        );
      }
    } catch {
      messageApi.error("Lỗi khi kiểm tra hoặc gửi email!");
    }
  };

  // --- Bước 2: xác thực mã ---
  const handleVerifyCode = (values) => {
    if (values.code === generatedCode) {
      messageApi.success("Xác thực thành công! Vui lòng nhập mật khẩu mới.");
      setStep(3);
    } else {
      messageApi.error("Mã xác thực không đúng!");
    }
  };

  // --- Bước 3: đổi mật khẩu ---
  const handleChangePassword = async (values) => {
    try {
      if (!userAccount?.id_tai_khoan)
        return messageApi.error("Không tìm thấy tài khoản để đổi mật khẩu!");

      const res = await axios.post(getLinkCongAPI() + "/doi-mat-khau", {
        id_tai_khoan: userAccount.id_tai_khoan,
        new_password: values.new_password,
      });

      if (res.data.success) {
        messageApi.success("Đổi mật khẩu thành công!");
        setForgotVisible(false);
        setStep(1);
      } else messageApi.error("Đổi mật khẩu thất bại!");
    } catch {
      messageApi.error("Lỗi khi đổi mật khẩu!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "flex-end", // 🔥 đẩy sang phải
        alignItems: "center",
        paddingRight: 10, // 🔥 cách lề phải 80px
        // background: "linear-gradient(135deg, #74ABE2 0%, #5563DE 100%)",
        background: "#ebeef4ff",
      }}
    >
      {contextHolder}

      <Card
        style={{
          width: 500,
          // padding: "30px 35px",
          textAlign: "center",
          // borderRadius: 16,
          // boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
          background: "white",
          borderRadius: 20,
          boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
          padding: "40px 45px",
          border: "1px solid #dce3f0",


          backdropFilter: "blur(6px)",
          transition: "0.3s",
        }}
        hoverable
      >
        <Title
          level={2}
          style={{
            color: "#2E4EDE",
            marginBottom: 25,
            fontWeight: "800",
          }}
        >
          🔐 Đăng nhập
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ma_nguoi_dung"
            rules={[
              { required: true, message: "Vui lòng nhập mã người dùng!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#888" }} />}
              placeholder="Tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#888" }} />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: 12 }}>
            <Button
              type="link"
              style={{ padding: 0, fontSize: 14 }}
              onClick={() => setForgotVisible(true)}
            >
              Quên mật khẩu?
            </Button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{
              borderRadius: 8,
              background: "#2E4EDE",
              fontWeight: 600,
              boxShadow: "0 3px 8px rgba(46,78,222,0.3)",
            }}
          >
            Đăng nhập
          </Button>
        </Form>

        <Divider />
        <Text type="secondary" style={{ fontSize: 13 }}>
          © {new Date().getFullYear()} Hệ thống thi trắc nghiệm online
        </Text>
      </Card>

      {/* MODAL QUÊN MẬT KHẨU */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            🔑 Khôi phục mật khẩu
          </Title>
        }
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
              label="Email đăng ký"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email của bạn"
                size="large"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
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
              <Input
                prefix={<KeyOutlined />}
                placeholder="Nhập mã được gửi qua email"
                size="large"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
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
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
                size="large"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đổi mật khẩu
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default LoginPage;
