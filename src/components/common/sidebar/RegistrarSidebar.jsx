// TeacherSidebar.jsx (code bạn đã có)
import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  BookOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const RegistrarSidebar = () => {
  console.log("Rendering RegistrarSidebar");
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
            icon: <TeamOutlined />,
            label: "Quản lý người dùng",
            children: [
              {
                key: "users/list-teachers",
                label: "Giáo viên",
                icon: <UserOutlined />,
              },
              {
                key: "users/list-students",
                label: "Học sinh",
                icon: <IdcardOutlined />,
              },
            ],
          },
          {
            key: "account",
            icon: <IdcardOutlined />,
            label: "Quản lý tài khoản",
            children: [
              {
                key: "account/list-accounts",
                label: "Tài khoản",
                icon: <UserOutlined />,
              },
              {
                key: "account/user-groups",
                label: "Nhóm tài khoản",
                icon: <TeamOutlined />,
              },
            ],
          },
          {
            key: "khoa",
            icon: <BookOutlined />,
            label: "Quản lý khoa",
            children: [
              {
                key: "khoa/list-khoa",
                label: "Danh sách khoa",
                icon: <ApartmentOutlined />,
              },
              {
                key: "khoa/add-khoa",
                label: "Thêm khoa",
                icon: <PlusCircleOutlined />,
              },
            ],
          },
          {
            key: "class",
            icon: <ApartmentOutlined />,
            label: "Quản lý lớp",
            children: [
              {
                key: "class/list-class",
                label: "Danh sách lớp",
                icon: <TeamOutlined />,
              },
              {
                key: "class/add-class",
                label: "Thêm lớp",
                icon: <PlusCircleOutlined />,
              },
            ],
          },
          {
            key: "subject",
            icon: <ApartmentOutlined />,
            label: "Quản lý môn học",
            children: [
              {
                key: "subject/list-subjects",
                label: "Danh sách môn học",
                icon: <TeamOutlined />,
              },
              {
                key: "subject/add-subject",
                label: "Thêm môn học",
                icon: <PlusCircleOutlined />,
              },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default RegistrarSidebar;
