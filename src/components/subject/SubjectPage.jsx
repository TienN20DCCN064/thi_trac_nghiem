import React from "react";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import SubjectList from "./SubjectList.jsx";

const SubjectPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Danh mục" },
          { label: "Môn học", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "ma_mh", placeholder: "Mã môn học", type: "input" },
            { key: "ten_mh", placeholder: "Tên môn học", type: "input" },
          ]}
        />
        <SubjectList />
      </div>
    </>
  );
};

export default SubjectPage;