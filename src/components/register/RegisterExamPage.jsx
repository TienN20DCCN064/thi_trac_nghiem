import React from "react";
import { Layout, Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RegisterExamList from "./RegisterExamList.jsx";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import FormAddExam from "./FormAddExam.jsx"; // Import component FormAddExam
import { getUserInfo } from "../../globals/globals.js";

const RegisterExamPage = () => {
  // State để kiểm soát modal
  const [modalVisible, setModalVisible] = React.useState(false);
  console.log("User Info:", getUserInfo());
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Đăng Ký" },
          { label: "Đăng Ký Thi", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <SearchList
          fields={[
            { key: "name_gv", placeholder: "Tên giảng viên", type: "input" },
            { key: "name_lop", placeholder: "Tên lớp học", type: "input" },
            { key: "name_mh", placeholder: "Tên môn học", type: "input" },
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
            {
              key: "trang_thai",
              placeholder: "Chọn trạng thái",
              type: "select",
              options: [
                { value: "Da_phe_duyet", label: "Đã Duyệt" },
                { value: "Cho_phe_duyet", label: "Chờ Duyệt" },
                { value: "Tu_choi", label: "Từ Chối" },
              ],
            },
          ]}
        />
        {getUserInfo().vai_tro === "GiaoVien" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="btn-add"
            onClick={() => setModalVisible(true)} // Mở modal khi click
          >
            Đăng Ký Thi
          </Button>
        )}
        {getUserInfo().vai_tro === "GiaoVu" && (
          <div style={{ marginTop: 60 }}>
         
          </div>
        )}

        {/* Modal chứa form đăng ký thi */}
        <FormAddExam
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
        />

        {/* Danh sách đăng ký thi */}
        <RegisterExamList />
      </div>
    </>
  );
};

export default RegisterExamPage;
