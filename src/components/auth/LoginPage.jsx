import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import {
  setUserInfo,
  clearUserInfo,
  getLinkCongAPI,
} from "../../globals/globals.js";

import axios from "axios"; // 👈 cần axios

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    clearUserInfo();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const res = await axios.post(getLinkCongAPI() + "/dang-nhap", {
        ten_dang_nhap: values.ma_nguoi_dung,
        mat_khau: values.password,
      });

      const { token, user } = res.data;
      setUserInfo({ ...user, token }); // Lưu cả token và user info vào localStorage

      messageApi.success(`Đăng nhập thành công! Vai trò: ${user.vai_tro}`);
      console.log("User info:", user);
      console.log("Token:", token);

      // Điều hướng theo vai trò
      if (
        user.vai_tro === "GiaoVu" ||
        user.vai_tro === "GiaoVien" ||
        user.vai_tro === "SinhVien"
      ) {
        window.location.href = "/home"; // 👈 reload lại app
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
          marginLeft: "370px", // 👈 Dịch sang phải 100px
        }}
      >
        <Title
          level={2}
          style={{ color: "#1877f2", marginBottom: 20, fontWeight: "bold" }}
        >
          Đăng nhập
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
            <Input placeholder="Tên đăng nhập" size="large" />
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
