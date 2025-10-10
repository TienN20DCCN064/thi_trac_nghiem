import React from "react";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import StudentAccoutsList from "./StudentAccoutsList.jsx";

const StudentAccoutPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Danh mục" },
          { label: "Tài Khoản Sinh Viên", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "id_tai_khoan", placeholder: "ID tài khoản", type: "input" },
            { key: "ma_sv", placeholder: "Mã sinh viên", type: "input" },
          ]}
        />
        <StudentAccoutsList />
      </div>
    </>
  );
};

export default StudentAccoutPage;