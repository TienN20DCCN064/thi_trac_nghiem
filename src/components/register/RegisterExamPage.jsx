import React from "react";
import { Layout, Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RegisterExamList from "./RegisterExamList.jsx";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import SearchList from "../common/SearchList.jsx";
import FormAddExam from "./FormAddExam.jsx"; // Import component FormAddExam

const RegisterExamPage = () => {
  // State để kiểm soát modal
  const [modalVisible, setModalVisible] = React.useState(false);

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
            { key: "ma_lop", placeholder: "Mã lớp" },
            { key: "ma_mh", placeholder: "Mã môn học" },
          ]}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="btn-add"
          onClick={() => setModalVisible(true)} // Mở modal khi click
        >
          Đăng Ký Thi
        </Button>

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
