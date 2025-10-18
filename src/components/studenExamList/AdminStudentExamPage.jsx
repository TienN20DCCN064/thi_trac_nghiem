import React, { useState } from "react";
import { Card } from "antd";
import AdminStudentExamList from "./AdminStudentExamList.jsx";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";

const AdminStudentExamPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Kỳ Thi" },
          { label: "Danh Sách Bài Làm Sinh Viên", isCurrent: true },
        ]}
      />

      <div className="custom-card">
        <SearchList
          fields={[
            { key: "name_mh", placeholder: "Tên môn học", type: "input" },
            { key: "name_lop", placeholder: "Tên lớp", type: "input" },
            { key: "ma_sv", placeholder: "Mã sinh viên", type: "input" },
            { key: "name_sv", placeholder: "Tên sinh viên", type: "input" },
            { key: "name_gv", placeholder: "Tên giảng viên", type: "input" },
        
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

        {/* Danh sách bài thi của sinh viên */}
        <AdminStudentExamList />
      </div>
    </>
  );
};

export default AdminStudentExamPage;
