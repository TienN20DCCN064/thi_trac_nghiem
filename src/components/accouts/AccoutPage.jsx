import React from "react";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import AccoutList from "./AccoutList.jsx";

const AccoutPage = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Danh mục" },
          { label: "Tài Khoản", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "id_tai_khoan", placeholder: "ID tài khoản", type: "input" },
            { key: "ten_dang_nhap", placeholder: "Tên đăng nhập", type: "input" },
             {
              key: "vai_tro",
              placeholder: "Chọn vai trò",
              type: "select",
              options: [
                { value: "GiaoVu", label: "Giáo Vụ" },
                { value: "GiaoVien", label: "Giáo Viên" },
                { value: "SinhVien", label: "Sinh Viên" },
              ],
            },
          ]}
        />
        <AccoutList />
      </div>
    </>
  );
};

export default AccoutPage;