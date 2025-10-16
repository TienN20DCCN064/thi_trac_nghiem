import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Button } from "antd";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { getUserInfo } from "../../globals/globals";

const { Content } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  const [user, setUser] = useState(getUserInfo());

  const roleUI = {
    GiaoVu: {
      color: "#722ed1",
      gradient: "linear-gradient(135deg, #f3e8ff, #e0c3fc)",
      title: "Trang quản lý giáo vụ",
      desc: "Bạn có thể quản lý kỳ thi, đề thi, và phân công giảng viên.",
      icon: <SettingOutlined style={{ fontSize: 64, color: "#722ed1" }} />,
      actions: [
        { label: "Quản lý kỳ thi", icon: <BookOutlined /> },
        { label: "Quản lý giảng viên", icon: <TeamOutlined /> },
      ],
    },
    GiaoVien: {
      color: "#1890ff",
      gradient: "linear-gradient(135deg, #e6f0ff, #b3d4ff)",
      title: "Trang giảng viên",
      desc: "Bạn có thể tạo, chỉnh sửa câu hỏi và đề thi cho môn học của mình.",
      icon: <BookOutlined style={{ fontSize: 64, color: "#1890ff" }} />,
      actions: [
        { label: "Soạn câu hỏi", icon: <BookOutlined /> },
        { label: "Xem bài thi", icon: <TeamOutlined /> },
      ],
    },
    SinhVien: {
      color: "#52c41a",
      gradient: "linear-gradient(135deg, #d9fdd3, #b3f0b0)",
      title: "Trang sinh viên",
      desc: "Bạn có thể tham gia các bài thi và xem kết quả của mình.",
      icon: <UserOutlined style={{ fontSize: 64, color: "#52c41a" }} />,
      actions: [
        { label: "Vào thi", icon: <BookOutlined /> },
        { label: "Xem kết quả", icon: <TeamOutlined /> },
      ],
    },
  };

  const ui = roleUI[user?.vai_tro] || {};

  return (
    <Layout
      style={{
        height: "100vh",
        background: "linear-gradient(-45deg, #f0f9ff, #e0f7fa, #e6f0ff, #f8f9ff)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 12s ease infinite",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Hiệu ứng hạt sáng nhẹ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "moveDots 20s linear infinite",
          opacity: 0.5,
        }}
      />

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 24,
          zIndex: 2,
        }}
      >
        <Card
          style={{
            width: 500,
            maxWidth: "90%",
            textAlign: "center",
            borderRadius: 20,
            padding: "40px 36px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          hoverable
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {ui.icon}
            <Title
              level={2}
              style={{
                color: ui.color,
                marginTop: 16,
                marginBottom: 8,
                fontWeight: "bold",
              }}
            >
              {ui.title}
            </Title>
            <Text
              style={{
                fontSize: 16,
                color: "#444",
                display: "block",
                marginBottom: 20,
              }}
            >
              {ui.desc}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#666",
              }}
            >
              👋 Xin chào,{" "}
              <strong style={{ color: ui.color }}>{user?.ten_nguoi_dung}</strong>
            </Text>
          </div>

          <div style={{ marginTop: 28 }}>
            {ui.actions?.map((act, idx) => (
              <Button
                key={idx}
                type="primary"
                icon={act.icon}
                size="large"
                style={{
                  background: ui.color,
                  border: "none",
                  width: "100%",
                  marginTop: 14,
                  borderRadius: 12,
                  fontWeight: "500",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                {act.label}
              </Button>
            ))}
          </div>
        </Card>
      </Content>

      {/* CSS animation keyframes */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes moveDots {
            from { background-position: 0 0; }
            to { background-position: 100px 100px; }
          }
        `}
      </style>
    </Layout>
  );
};

export default HomePage;
