import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import AccoutListItem from "./AccoutListItem.jsx";
import { useLocation } from "react-router-dom";

const accoutActions = createActions("tai_khoan");

const AccoutList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: accoutList, loading, error } = useSelector(
    (state) => state.tai_khoan || { data: [], loading: false, error: null }
  );

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(accoutActions.creators.fetchAllRequest());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu tài khoản: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (!accoutList || accoutList.length === 0) {
      setFilteredData([]);
      return;
    }
    const params = new URLSearchParams(location.search);
    const idTaiKhoan = params.get("id_tai_khoan")?.toLowerCase() || "";
    const tenDangNhap = params.get("ten_dang_nhap")?.toLowerCase() || "";
    const vaiTro = params.get("vai_tro")?.toLowerCase() || "";

    const filtered = accoutList.filter(
      (item) =>
        (idTaiKhoan
          ? String(item.id_tai_khoan).toLowerCase().includes(idTaiKhoan)
          : true) &&
        (tenDangNhap
          ? item.ten_dang_nhap?.toLowerCase().includes(tenDangNhap)
          : true) &&
        (vaiTro
          ? item.vai_tro?.toLowerCase().includes(vaiTro)
          : true)
    );
    setFilteredData(filtered);
  }, [accoutList, location.search]);

  const handleDataChange = () => {
    dispatch(accoutActions.creators.fetchAllRequest());
  };

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return (
    <AccoutListItem data={filteredData} onDataChange={handleDataChange} />
  );
};

export default AccoutList;