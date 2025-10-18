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
  SettingOutlined,
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
            key: "hocVu",
            icon: <BookOutlined />,
            label: "Quản lý học vụ",
            children: [
              {
                key: "khoa/list-khoa",
                label: "Danh sách khoa",
                icon: <ApartmentOutlined />,
              },
              {
                key: "class/list-class",
                label: "Danh sách lớp",
                icon: <TeamOutlined />,
              },
              {
                key: "subject/list-subjects",
                label: "Danh sách môn học",
                icon: <TeamOutlined />,
              },
            ],
          },
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
                key: "account/list",
                label: "Tất cả",
                icon: <UserOutlined />,
              },
              {
                key: "account/list-teachers",
                label: "Giáo viên",
                icon: <UserOutlined />,
              },
              {
                key: "account/list-students",
                label: "Học sinh",
                icon: <IdcardOutlined />,
              },
            ],
          },
          {
            key: "register",
            icon: <SettingOutlined />,
            label: "Kỳ thi và câu hỏi",
            children: [
              { key: "register/register-exam", label: "Danh sách đăng Ký Thi" },
              { key: "watch-exam/list-exam", label: "Danh sách bài thi SV" },
              { key: "question/list-question", label: "Danh sách câu hỏi" },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default RegistrarSidebar;
