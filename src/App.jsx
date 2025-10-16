import React from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/Sidebar.jsx";

import HomePage from "./components/common/HomePage.jsx";

import KhoaPage from "./components/khoa/KhoaPage.jsx";
import ClassPage from "./components/classHoc/ClassPage.jsx";
import SubjectPage from "./components/subject/SubjectPage.jsx";

import StudentInfoPage from "./components/user/StudentInfoPage.jsx";
import TeacherInfoPage from "./components/user/TeacherInfoPage.jsx";
import AccoutPage from "./components/accouts/AccoutPage.jsx";
import StudentAccoutPage from "./components/accouts/StudentAccoutPage.jsx";
import TeacherAccountPage from "./components/accouts/TeacherAccoutPage.jsx";

import StudentExamPage from "./components/studenExam/StudentExamPage.jsx";

import HeaderUserInfo from "./components/common/HeaderUserInfo.jsx";
import RegisterExamPage from "./components/register/RegisterExamPage.jsx";
import TeacherQuestionPage from "./components/question/TeacherQuestionPage.jsx";
import TeacherListQuestionsDelete from "./components/question/TeacherQuestionsDeleteListPage.jsx";
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
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* dành cho giáo vụ */}
              <Route
                path="/users/list-teachers"
                element={<TeacherInfoPage />}
              />
              <Route
                path="/users/list-students"
                element={<StudentInfoPage />}
              />
              <Route path="/account/list" element={<AccoutPage />} />
              <Route
                path="/account/list-teachers"
                element={<TeacherAccountPage />}
              />
              <Route
                path="/account/list-students"
                element={<StudentAccoutPage />}
              />

              <Route path="/khoa/list-khoa" element={<KhoaPage />} />
              <Route path="/class/list-class" element={<ClassPage />} />
              <Route path="/subject/list-subjects" element={<SubjectPage />} />

              <Route
                path="/question/list-question"
                element={<TeacherQuestionPage />}
              />
              <Route
                path="/question/list-question-deleted"
                element={<TeacherListQuestionsDelete />}
              />

              {/* dành cho giáo viên */}

              <Route
                path="/register/register-exam"
                element={<RegisterExamPage />}
              />
              <Route
                path="/register/register-exam-test"
                element={<h2>Welcome /register/register-exam-test 🚀</h2>}
              />

                {/* dành cho sinh viên */}
              <Route
                path="/exam"
                element={<StudentExamPage />}
              />
              <Route
                path="/exam-list"
                element={<StudentExamPage />}
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
