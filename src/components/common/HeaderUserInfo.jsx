import React from "react";
import { Layout, Dropdown, Avatar } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const HeaderUserInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ẩn Header ở 1 số route (ví dụ /login)
  const hiddenRoutes = ["/login"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    console.log("Logout clicked");
    // Xoá token hoặc dữ liệu user
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển về trang login
    navigate("/login");
  };

  const menuItems = [
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 16px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <Avatar style={{ backgroundColor: "#87d068", marginRight: 8 }}>
            S
          </Avatar>
          <span>superadmin</span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default HeaderUserInfo;
