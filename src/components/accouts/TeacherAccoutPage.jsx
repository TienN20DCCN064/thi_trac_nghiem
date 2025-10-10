import React from "react";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import TeacherAccoutsList from "./TeacherAccoutsList.jsx";

const TeacherAccoutPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Danh mục" },
          { label: "Tài Khoản Giáo Viên", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "id_tai_khoan", placeholder: "ID tài khoản", type: "input" },
            { key: "ma_gv", placeholder: "Mã giáo viên", type: "input" },
          ]}
        />
        <TeacherAccoutsList />
      </div>
    </>
  );
};

export default TeacherAccoutPage;