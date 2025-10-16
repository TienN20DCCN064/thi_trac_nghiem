// StudentSidebar.jsx
import React from "react";
import { Layout, Menu } from "antd";
import { BookOutlined, SettingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const StudentSidebar = () => {
  console.log("Rendering StudentSidebar");
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
            key: "my-course",
            icon: <BookOutlined />,
            label: "Khoá học của tôi",
          },
          {
            key: "exam",
            icon: <SettingOutlined />,
            label: "Kỳ thi",
            children: [
              { key: "exam", label: "Kỳ thi hôm nay" },
              { key: "exam-list", label: "Danh sách kỳ thi" },
              { key: "exam-history", label: "Lịch sử thi" },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default StudentSidebar;
