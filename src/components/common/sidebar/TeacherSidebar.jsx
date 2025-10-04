// TeacherSidebar.jsx (code bạn đã có)
import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, BookOutlined, SettingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const TeacherSidebar = () => {
  console.log("Rendering TeacherSidebar");
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenRoutes = ["/login"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <Sider width={220} style={{ minHeight: "100vh", background: "#001529" }}>
      <div
        style={{
          height: 80,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer", // Thêm hiệu ứng con trỏ
        }}
        onClick={() => navigate("/")} // Thêm sự kiện click
      >
        <img
          src="/images/cms.png"
          alt="CMS"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        onClick={({ key }) => navigate("/" + key)}
        items={[
          {
            key: "user",
            icon: <UserOutlined />,
            label: "Quản lý người dùng",
            children: [
              { key: "users/users-list", label: "Người dùng" },
              { key: "users/user-groups", label: "Nhóm tài khoản" },
            ],
          },
          {
            key: "course",
            icon: <BookOutlined />,
            label: "Quản lý môn học",
          },
          {
            key: "question",
            icon: <SettingOutlined />,
            label: "Câu hỏi",
            children: [
              { key: "question/list-question", label: "Danh sách câu hỏi" },
              { key: "question/add-question", label: "Thêm câu hỏi" },
            ],
          },
          {
            key: "register",
            icon: <SettingOutlined />,
            label: "Quản lý đăng ký",
            children: [
              { key: "register/register-exam", label: "Danh sách đăng ký" },
              { key: "register/add-register", label: "Thêm đăng ký" },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default TeacherSidebar;
