import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchDangKyThiRequest } from "../../redux/actions/dangKyThiActions.js"; // Đường dẫn tùy dự án

import RegisterExamListItem from "./RegisterExamListItem.jsx";
import { Spin, message } from "antd";

const RegisterExamList = () => {
  const dispatch = useDispatch();
  const {
    data: dangKyThiList,
    loading,
    error,
  } = useSelector((state) => state.dangKyThi);

  useEffect(() => {
    dispatch(fetchDangKyThiRequest());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error("Lỗi khi tải dữ liệu đăng ký thi!");
    }
  }, [error]);

  if (loading) return <Spin />;

  return (
    <RegisterExamListItem
      data={dangKyThiList || []}
      onDeleteClick={(id) => console.log("Xóa đăng ký thi:", id)}
      onEditClick={(id) => console.log("Sửa đăng ký thi:", id)}
      onViewDetailClick={(id) => console.log("Xem chi tiết:", id)}
    />
  );
};

export default RegisterExamList;
