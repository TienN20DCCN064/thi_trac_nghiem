import React from "react";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import StudentInfoList from "./StudentInfoList.jsx";

const StudentInfoPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Danh mục" },
          { label: "Sinh Viên", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "ho", placeholder: "Họ", type: "input" },
            { key: "ten", placeholder: "Tên", type: "input" },
            {
              key: "phai",
              placeholder: "Chọn giới tính",
              type: "select",
              options: [
                { value: "Nam", label: "Nam" },
                { value: "Nu", label: "Nữ" },
              ],
            },
            { key: "ma_lop", placeholder: "Mã lớp", type: "input" },
          ]}
        />
        <StudentInfoList />
      </div>
    </>
  );
};

export default StudentInfoPage;
