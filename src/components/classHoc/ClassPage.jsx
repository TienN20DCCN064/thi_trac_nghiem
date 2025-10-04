import React from "react";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import ClassList from "./ClassList.jsx";

const ClassPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Danh mục" },
          { label: "Lớp Học", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "ma_lop", placeholder: "Mã lớp", type: "input" },
            { key: "ten_lop", placeholder: "Tên lớp", type: "input" },
            { key: "ten_khoa", placeholder: "Tên khoa", type: "input" },
          ]}
        />
        <ClassList />
      </div>
    </>
  );
};

export default ClassPage;
