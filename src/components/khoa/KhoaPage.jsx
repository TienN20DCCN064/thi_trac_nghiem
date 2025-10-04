import React from "react";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import KhoaList from "./KhoaList.jsx";

const KhoaPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Danh mục" },
          { label: "Khoa", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "ma_khoa", placeholder: "Mã khoa", type: "input" },
            { key: "ten_khoa", placeholder: "Tên khoa", type: "input" },
          ]}
        />
        <KhoaList />
      </div>
    </>
  );
};

export default KhoaPage;  