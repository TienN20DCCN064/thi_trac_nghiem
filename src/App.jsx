import React from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/Sidebar.jsx";
import HeaderUserInfo from "./components/common/HeaderUserInfo.jsx";
import RegisterExamPage from "./components/register/RegisterExamPage.jsx";
import TeacherQuestionPage from "./components/question/TeacherQuestionPage.jsx";
import LoadingOverlay from "./components/common/LoadingOverlay.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import PrimaryKeys from "./globals/databaseKey.js"; // 👈 import PrimaryKeys
import "./styles/App.css";

const { Content } = Layout;

function App() {
  // Lấy tất cả state loading từ Redux cho các bảng
  const loadingStates = useSelector((state) => {
    const result = {};
    Object.keys(PrimaryKeys).forEach((table) => {
      result[table] = state[table]?.loading || false;
    });
    return result;
  });

  // Nếu bất kỳ bảng nào loading thì hiển thị overlay
  const loading = Object.values(loadingStates).some((v) => v);

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

              <Route
                path="/users/users-list"
                element={<h2>Welcome /users/users-list 🚀</h2>}
              />
              <Route
                path="/users/user-groups"
                element={<h2>Welcome /users/user-groups 🚀</h2>}
              />
              <Route
                path="/question/list-question"
                element={<TeacherQuestionPage />}
              />
              <Route
                path="/question/add-question"
                element={<h2>Welcome /question/add-question 🚀</h2>}
              />

              <Route
                path="/register/register-exam"
                element={<RegisterExamPage />}
              />
              <Route
                path="/register/register-exam-test"
                element={<h2>Welcome /register/register-exam-test 🚀</h2>}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>

      {/* Overlay loading */}
      <LoadingOverlay loading={loading} />
    </>
  );
}

export default App;
