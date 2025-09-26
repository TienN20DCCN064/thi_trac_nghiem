import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import RegisterExamListItem from "./RegisterExamListItem.jsx";

const dangKyThiActions = createActions("dang_ky_thi");

const RegisterExamList = () => {
  const dispatch = useDispatch();

  // Lấy state từ reducer factory
  const {
    data: dangKyThiList, // Sửa từ list thành data
    loading,
    error,
  } = useSelector(
    (state) => state.dang_ky_thi || { data: [], loading: false, error: null }
  );

  // Fetch dữ liệu khi mount component
  useEffect(() => {
    dispatch(dangKyThiActions.creators.fetchAllRequest());
  }, [dispatch]);

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu đăng ký thi: ${error}`);
    }
  }, [error]);
  useEffect(() => {
    console.log("Đăng ký thi list updated:", dangKyThiList);
  }, [dangKyThiList]);

  if (loading) return <Spin style={{ margin: 20 }} />;

  if (!dangKyThiList) return <div>Không có dữ liệu</div>;

  return (
    <RegisterExamListItem
      data={dangKyThiList}
      onDeleteClick={(id) =>
        dispatch(dangKyThiActions.creators.deleteRequest(id))
      }
      onEditClick={(id) => console.log("Sửa đăng ký thi:", id)}
      onViewDetailClick={(id) => console.log("Xem chi tiết:", id)}
    />
  );
};

export default RegisterExamList;
