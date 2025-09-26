import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import {  } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import RegisterExamListItem from "./RegisterExamListItem.jsx";
import { useLocation } from "react-router-dom";

const dangKyThiActions = createActions("dang_ky_thi");

const RegisterExamList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: dangKyThiList,
    loading,
    error,
  } = useSelector(
    (state) => state.dang_ky_thi || { data: [], loading: false, error: null }
  );

  // Fetch dữ liệu gốc khi mount
  useEffect(() => {
    dispatch(dangKyThiActions.creators.fetchAllRequest());
  }, [dispatch]);

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu đăng ký thi: ${error}`);
    }
  }, [error]);

  // Lọc dữ liệu dựa trên URL search params
  const filteredData = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const ma_lop = params.get("ma_lop")?.toLowerCase() || "";
    const ma_mh = params.get("ma_mh")?.toLowerCase() || "";

    return (dangKyThiList || []).filter((item) => {
      const matchesLop = ma_lop ? item.ma_lop?.toLowerCase().includes(ma_lop) : true;
      const matchesMh = ma_mh ? item.ma_mh?.toLowerCase().includes(ma_mh) : true;
      return matchesLop && matchesMh;
    });
  }, [dangKyThiList, location.search]);

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!dangKyThiList || dangKyThiList.length === 0)
    return <div>Không có dữ liệu</div>;

  return (
    <RegisterExamListItem
      data={filteredData} // 👈 truyền dữ liệu đã lọc
      onDeleteClick={(id) =>
        dispatch(dangKyThiActions.creators.deleteRequest(id))
      }
      onEditClick={(id) => console.log("Sửa đăng ký thi:", id)}
      onViewDetailClick={(id) => console.log("Xem chi tiết:", id)}
    />
  );
};

export default RegisterExamList;
