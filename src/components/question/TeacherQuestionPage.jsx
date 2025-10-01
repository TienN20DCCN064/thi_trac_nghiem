import React from "react";
import { Layout, Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import TeacherQuestionList from "./TeacherQuestionList.jsx"; // 👈 thay RegisterExamList

import FormAddExam from "../register/FormAddExam.jsx";

const TeacherQuestionPage = () => {

  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Ngân Hàng Câu Hỏi" },
          { label: "Môn học đã soạn", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        {/* Ô tìm kiếm */}
        <SearchList
          fields={[
            { key: "ma_gv", placeholder: "Mã giảng viên" },
            { key: "ma_mh", placeholder: "Mã môn học" },
          ]}
        />
       
        {/* Danh sách môn học giảng viên đã soạn câu hỏi */}
        <TeacherQuestionList />
      </div>
    </>
  );
};

export default TeacherQuestionPage;
