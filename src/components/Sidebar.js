import React from "react";
import { Layout, Menu } from "antd";
import '../style/App.css';

import {
  UserOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "users":
        window.location.href = "/users";
        break;
      case "user-groups":
        window.location.href = "/user-groups";
        break;
      case "course-management":
        window.location.href = "/courses";
        break;
      case "system":
        window.location.href = "/system";
        break;
      case "role":
        window.location.href = "/role";
        break;
      case "add_question":
        window.location.href = "/add_question";
        break;
      case "list_question":
        window.location.href = "/list_question";
        break;
      default:
        window.location.href = "/";
    }
  };

  const currentPath = window.location.pathname;
  let selectedKey = "users"; // mặc định

  if (currentPath.startsWith("/users")) selectedKey = "users";
  else if (currentPath.startsWith("/user-groups")) selectedKey = "user-groups";
  else if (currentPath.startsWith("/courses")) selectedKey = "course-management";
  else if (currentPath.startsWith("/system")) selectedKey = "system";
  else if (currentPath.startsWith("/role")) selectedKey = "role";
  else if (currentPath.startsWith("/add_question")) selectedKey = "add_question";
  else if (currentPath.startsWith("/list_question")) selectedKey = "list_question";

  // xác định menu cha mở theo selectedKey
  let openKey = "user-management"; // mặc định
  if (selectedKey === "role") openKey = "system";
  else if (selectedKey === "users" || selectedKey === "user-groups") openKey = "user-management";
  else if (selectedKey === "add_question" || selectedKey === "list_question") openKey = "question";
  else openKey = "";

  return (
    <Sider
      width={220}
      style={{
        minHeight: "100vh",
        background: "#001529",
      }}
    >
      <div
        style={{
          height: 80,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
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
        defaultOpenKeys={[openKey]} // 👈 mở menu cha tương ứng
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={[
          {
            key: "user-management",
            icon: <UserOutlined />,
            label: "Quản lý người dùng",
            children: [
              {
                key: "users",
                label: "Người dùng",
              },
              {
                key: "user-groups",
                label: "Nhóm tài khoản",
              },
            ],
          },
          {
            key: "course-management",
            icon: <BookOutlined />,
            label: "Quản lý môn học",
          },
          {
            key: "system",
            icon: <SettingOutlined />,
            label: "Hệ thống",
            children: [
              {
                key: "role",
                label: "Quyền Hạn",
              },
            ],
          },
          {
            key: "question",
            icon: <SettingOutlined />,
            label: "Câu hỏi",
            children: [
              {
                key: "list_question",
                label: "Danh sách câu hỏi",
              },
              {
                key: "add_question",
                label: "Thêm câu hỏi",
              },

            ],
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
