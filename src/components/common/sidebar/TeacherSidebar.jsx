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
            key: "question",
            icon: <SettingOutlined />,
            label: "Câu hỏi",
            children: [
              { key: "question/list-question", label: "Danh sách câu hỏi" },
              {
                key: "question/list-question-deleted",
                label: "Danh sách câu hỏi đã xóa",
              },
            ],
          },
          {
            key: "register",
            icon: <SettingOutlined />,
            label: "Kỳ thi sinh viên",
            children: [
              { key: "register/register-exam", label: "Danh sách đăng ký" },
              { key: "watch-exam/list-exam", label: "Danh sách bài thi SV" },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default TeacherSidebar;
