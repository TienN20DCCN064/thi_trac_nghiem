import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { setRole, getRole, clearRole } from "../../globals/globals.js";
import { useNavigate } from "react-router-dom"; // 👈 import thêm

const { Title, Link } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage(); // 👈 lấy message api
  const navigate = useNavigate(); // 👈 khởi tạo navigate
  // 👇 Reset role khi vào trang login
  useEffect(() => {
    clearRole();
  }, []);

  const onFinish = (values) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (values.ma_nguoi_dung === "1" && values.password === "1") {
        setRole("GV");
        messageApi.success("Đăng nhập thành công! Vai trò: Giáo viên");
        window.location.href = "/register/register-exam"; // 👈 reload lại app
      } else if (values.ma_nguoi_dung === "2" && values.password === "2") {
        setRole("SV");
        messageApi.success("Đăng nhập thành công! Vai trò: Sinh viên");
        window.location.href = "/my-course"; // 👈 reload lại app
      } else {
        messageApi.error("Mã người dùng hoặc mật khẩu không đúng!");
      }
      console.log("Received values of form: ", values);
    }, 1500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f0f2f5",
      }}
    >
      {contextHolder} {/* 👈 bắt buộc để message hiển thị */}
      <Card
        style={{
          width: 360,
          padding: "20px 24px",
          textAlign: "center",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title
          level={2}
          style={{ color: "#1877f2", marginBottom: 20, fontWeight: "bold" }}
        >
          facebook
        </Title>

        <Form
          name="login-form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="ma_nguoi_dung"
            rules={[
              { required: true, message: "Vui lòng nhập mã người dùng!" },
            ]}
          >
            <Input placeholder="Mã người dùng" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" size="large" />
          </Form.Item>

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
    </div>
  );
};

export default LoginPage;
