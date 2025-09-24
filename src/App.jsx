import React from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/Sidebar.jsx";
import HeaderUserInfo from "./components/common/HeaderUserInfo.jsx";
import RegisterExamPage from "./components/register/RegisterExamPage.jsx";
import LoadingOverlay from "./components/common/LoadingOverlay.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import "./styles/App.css";

const { Content } = Layout;


function App() {
   // Lấy tất cả state loading từ Redux
  const dangKyThiLoading = useSelector((state) => state.dangKyThi.loading);
  // const usersLoading = useSelector((state) => state.users.loading); // nếu có
  // const rolesLoading = useSelector((state) => state.roles.loading); // nếu có

  const loading = dangKyThiLoading; // || usersLoading || rolesLoading ...
  
  return (
    <>

      <Layout className="app-layout">
        <Sidebar />
        <Layout className="app-container">
          <HeaderUserInfo />
          <Content className="app-content">
            <Routes>
              <Route path="/" element={<h2>Welcome 🚀</h2>} />
              <Route path="/login" element={<LoginPage />} />

              
              <Route path="/users/users-list" element={<h2>Welcome /users/user-groups 🚀</h2>} />
              <Route path="/users/user-groups" element={<h2>Welcome /users/user-groups 🚀</h2>} />


              <Route path="/register/register-exam" element={<RegisterExamPage />} />
              <Route path="/register/register-exam-test" element={<h2>Welcome /register/register-exam-test 🚀</h2>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
      {/* 👇 thêm cái overlay loading ở đây */}
      <LoadingOverlay loading={loading} />
    </>
  );
}

export default App;
