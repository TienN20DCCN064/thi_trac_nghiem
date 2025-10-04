import { usizeEffect, useState } from "react";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import InfoTeacherList from "./TeacherInfoList.jsx";

const InfoTeacherPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Danh mục" },
          { label: "Giảng Viên", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "ma_gv", placeholder: "Mã giảng viên", type: "input" },
            { key: "ho", placeholder: "Họ", type: "input" },
            { key: "ten", placeholder: "Tên", type: "input" },
          ]}
        />
        <InfoTeacherList />
      </div>
    </>
  );
};

export default InfoTeacherPage;
