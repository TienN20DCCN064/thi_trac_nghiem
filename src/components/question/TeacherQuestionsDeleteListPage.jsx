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
          { label: "Câu hỏi đã soạn" },
          { label: "Câu hỏi đã xóa", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        {/* Ô tìm kiếm */}
        <SearchList
          fields={[
            { key: "name_gv", placeholder: "Tên giảng viên", type: "input" },
            { key: "name_mh", placeholder: "Tên môn học", type: "input" },
            {
              key: "trinh_do",
              placeholder: "Chọn trình độ",
              type: "select",
              options: [
                { value: "ĐH", label: "Đại học" },
                { value: "CĐ", label: "Cao đẳng" },
                { value: "VB2", label: "Văn Bằng 2" },
              ],
            },
          ]}
        />

        {/* Danh sách môn học giảng viên đã soạn câu hỏi */}
        <TeacherQuestionList status_question="da_xoa" />
      </div>
    </>
  );
};

export default TeacherQuestionPage;
