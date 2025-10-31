import React, { useState } from "react";
import { Card, Button, Modal } from "antd";
import AdminStudentExamList from "./AdminStudentExamList.jsx";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import { FilterOutlined } from "@ant-design/icons";
import FilterExamForm from "./FilterExamForm.jsx";
import { getUserInfo } from "../../globals/globals.js";

const AdminStudentExamPage = () => {
  const [filterVisible, setFilterVisible] = useState(false);

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

        {/* Nút mở FilterExamForm */}
        <Button
          type="primary"
          icon={<FilterOutlined />}
          className="btn-add"
          onClick={() => setFilterVisible(true)}
          style={{ marginBottom: 12 }}
        >
          Lọc Điểm Thi Sinh Viên
        </Button>

        {/* Hiển thị FilterExamForm trong một Modal nổi */}
        <Modal
          title="Xem danh sách điểm thi"
          open={filterVisible}
          onCancel={() => setFilterVisible(false)}
          footer={null}
          centered
          width={800}
        >
          <FilterExamForm
            onDataChange={(data) => {
              // xử lý dữ liệu trả về nếu cần
              console.log("Filter data:", data);
              // đóng modal sau khi nhận dữ liệu (tuỳ nhu cầu)
              setFilterVisible(false);
            }}
          />
        </Modal>

        {/* Danh sách bài thi của sinh viên */}
        <AdminStudentExamList />
      </div>
    </>
  );
};

export default AdminStudentExamPage;
