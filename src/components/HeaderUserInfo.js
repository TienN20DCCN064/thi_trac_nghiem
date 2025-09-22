import React from "react";
import { Layout, Dropdown, Avatar } from "antd";

const { Header } = Layout;

const HeaderUserInfo = () => {
  const menuItems = [
    {
      key: "logout",
      label: "Đăng xuất",
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
        // width: 1024;
      }}
    >
      <Dropdown menu={{ items: menuItems }}>
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Avatar
            style={{ backgroundColor: "#87d068", marginRight: 8 }}
          >
            S
          </Avatar>
          <span>superadmin</span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default HeaderUserInfo;
