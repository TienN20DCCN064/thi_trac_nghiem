import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import StudentAccoutsListItem from "./StudentAccoutsListItem.jsx";
import { useLocation } from "react-router-dom";

const studentAccoutActions = createActions("tai_khoan_sinh_vien");

const StudentAccoutsList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: accoutList, loading, error } = useSelector(
    (state) => state.tai_khoan_sinh_vien || { data: [], loading: false, error: null }
  );

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(studentAccoutActions.creators.fetchAllRequest());
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
    const maSv = params.get("ma_sv")?.toLowerCase() || "";

    const filtered = accoutList.filter(
      (item) =>
        (idTaiKhoan
          ? String(item.id_tai_khoan).toLowerCase().includes(idTaiKhoan)
          : true) &&
        (maSv ? item.ma_sv?.toLowerCase().includes(maSv) : true)
    );
    setFilteredData(filtered);
  }, [accoutList, location.search]);

  const handleDataChange = () => {
    dispatch(studentAccoutActions.creators.fetchAllRequest());
  };

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return (
    <StudentAccoutsListItem data={filteredData} onDataChange={handleDataChange} />
  );
};

export default StudentAccoutsList;