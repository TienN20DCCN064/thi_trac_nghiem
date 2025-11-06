import React, { useEffect, useState } from "react";
import { Card, Typography, Avatar, Space, Divider, Spin } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  TeamOutlined,
  HomeOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { getUserInfo } from "../../globals/globals.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import UserImage from "../common/UserImage.jsx";

const { Title, Text } = Typography;

// ...giữ nguyên import, useState, useEffect

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      const currentUser = getUserInfo();
      setUser(currentUser);

      if (currentUser?.id_tai_khoan) {
        const detail = await hamChiTiet.getUserInfoByAccountId(
          currentUser.id_tai_khoan
        );
        setUserDetail(detail);
      }
      setLoading(false);
    };
    fetchUserDetail();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
        }}
      >
        <Spin tip="Đang tải thông tin người dùng..." size="large" />
      </div>
    );
  }

  // Render cột trái theo vai trò
  const renderLeftColumn = () => {
    if (!userDetail) return null;

    if (user.vai_tro === "SinhVien") {
      return (
        <Space direction="vertical" size="middle" style={{ flex: 1 }}>
          <Text>
            <IdcardOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            <strong>Mã sinh viên:</strong> {userDetail.ma_sv}
          </Text>
          <Text>
            <UserOutlined style={{ color: "#722ed1", marginRight: 8 }} />
            <strong>Họ tên:</strong> {userDetail.ho} {userDetail.ten}
          </Text>
          <Text>
            {userDetail.phai === "Nam" ? (
              <ManOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            ) : (
              <WomanOutlined style={{ color: "#eb2f96", marginRight: 8 }} />
            )}
            <strong>Giới tính:</strong> {userDetail.phai}
          </Text>
          <Text>
            <CalendarOutlined style={{ color: "#fa8c16", marginRight: 8 }} />
            <strong>Ngày sinh:</strong>{" "}
            {userDetail.ngay_sinh
              ? new Date(userDetail.ngay_sinh).toLocaleDateString("vi-VN")
              : "Chưa có"}
          </Text>
          <Text>
            <HomeOutlined style={{ color: "#13c2c2", marginRight: 8 }} />
            <strong>Địa chỉ:</strong> {userDetail.dia_chi || "Chưa cập nhật"}
          </Text>
          <Text>
            <TeamOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <strong>Lớp:</strong> {userDetail.ma_lop}
          </Text>
          {/* {userDetail.hinh_anh && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <img
                src={userDetail.hinh_anh}
                alt="Ảnh sinh viên"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
          )} */}
        </Space>
      );
    } else {
      // Giáo viên / Giáo vụ
      return (
        <Space direction="vertical" size="middle" style={{ flex: 1 }}>
          <Text>
            <IdcardOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            <strong>Mã GV:</strong> {userDetail.ma_gv}
          </Text>
          <Text>
            <UserOutlined style={{ color: "#722ed1", marginRight: 8 }} />
            <strong>Họ tên:</strong> {userDetail.ho} {userDetail.ten}
          </Text>
          <Text>
            🎓 <strong>Học vị:</strong> {userDetail.hoc_vi}
          </Text>
          <Text>
            🏫 <strong>Khoa:</strong> {userDetail.ma_khoa}
          </Text>
        </Space>
      );
    }
  };

  // Cột phải: thông tin chung tài khoản
  const renderRightColumn = () => (
    <Space
      direction="vertical"
      size="middle"
      style={{
        flex: 1.2, // tăng tỉ lệ rộng của cột phải
        minWidth: 250, // đảm bảo cột không quá hẹp
      }}
    >
      <Text>
        <IdcardOutlined style={{ color: "#1890ff", marginRight: 8 }} />
        <strong>Tên đăng nhập:</strong> {user.ten_dang_nhap}
      </Text>
      <Text>
        <UserOutlined style={{ color: "#52c41a", marginRight: 8 }} />
        <strong>Vai trò:</strong> {user.vai_tro}
      </Text>
      <Text>
        <MailOutlined style={{ color: "#faad14", marginRight: 8 }} />
        <strong>Email:</strong> {userDetail?.email || "Chưa có"}
      </Text>
    </Space>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
      }}
    >
      <Card
        style={{
          width: 700,
          padding: 24,
          textAlign: "center",
          borderRadius: 16,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          background: "white",
        }}
      >
        <Space
          direction="vertical"
          align="center"
          size="large"
          style={{ width: "100%" }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              overflow: "hidden", // quan trọng để crop tròn
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {userDetail?.hinh_anh ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center", // crop chính giữa
                  alignItems: "center",
                }}
              >
                <UserImage
                  publicId={userDetail.hinh_anh}
                  maxWidth={180} // ảnh lớn hơn khung để crop đẹp
                  style={{
                    display: "block",
                    width: "auto", // để width auto, cao full
                    height: "100%", // chiều cao bằng khung
                  }}
                />
              </div>
            ) : (
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
            )}
          </div>

          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Thông tin người dùng
            </Title>
            <Text type="secondary">Chi tiết tài khoản của bạn</Text>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          {user && userDetail ? (
            <div style={{ display: "flex", gap: 40, textAlign: "left" }}>
              {renderLeftColumn()}
              {renderRightColumn()}
            </div>
          ) : (
            <Text type="secondary">Không có thông tin người dùng.</Text>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default UserInfo;
