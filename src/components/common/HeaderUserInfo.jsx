import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../../globals/globals.js";
import UserImage from "../common/UserImage.jsx";
import hamChiTiet from "../../services/service.hamChiTiet.js"; // Giả sử hamChung nằm trong thư mục utils
const { Header } = Layout;

const HeaderUserInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = getUserInfo(); // Lấy thông tin từ localStorage
        console.log("User info from localStorage:", userInfo);
        if (userInfo?.id_tai_khoan) {
          const response = await hamChiTiet.getUserInfoByAccountId(
            userInfo.id_tai_khoan
          );
          console.log("Thông tin người dùng:", response);
          setUser(response); // Giả sử API trả về dữ liệu trong trường 'data'
        } else {
          throw new Error("Không tìm thấy id_tai_khoan");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        navigate("/login"); // Chuyển hướng về login nếu lỗi
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Ẩn Header ở các route như /login
  const hiddenRoutes = ["/login"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    console.log("Đăng xuất được nhấn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "profile",
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/profile"),
    },
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
      {/* <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <Avatar style={{ backgroundColor: "#87d068", marginRight: 8 }}>
            {user ? user.ten?.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <span>{user ? `${user.ho} ${user.ten}` : "Người dùng"}</span>
        </div>
      </Dropdown> */}
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          {user?.hinh_anh ? (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                overflow: "hidden",
                marginRight: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <UserImage
                publicId={user.hinh_anh}
                maxWidth={80} // ảnh lớn hơn khung để crop đẹp
                style={{
                  width: "auto",
                  height: "100%", // chiều cao đầy khung
                  display: "block",
                }}
              />
            </div>
          ) : (
            <Avatar style={{ backgroundColor: "#87d068", marginRight: 8 }}>
              {user ? user.ten?.charAt(0).toUpperCase() : "U"}
            </Avatar>
          )}
          <span>{user ? `${user.ho} ${user.ten}` : "Người dùng"}</span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default HeaderUserInfo;
