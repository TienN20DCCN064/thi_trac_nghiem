import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import TeacherAccoutsListItem from "./TeacherAccoutsListItem.jsx";
import { useLocation } from "react-router-dom";

const teacherAccoutActions = createActions("tai_khoan_giao_vien");

const TeacherAccoutsList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: accoutList, loading, error } = useSelector(
    (state) => state.tai_khoan_giao_vien || { data: [], loading: false, error: null }
  );

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(teacherAccoutActions.creators.fetchAllRequest());
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
    const maGv = params.get("ma_gv")?.toLowerCase() || "";

    const filtered = accoutList.filter(
      (item) =>
        (idTaiKhoan
          ? String(item.id_tai_khoan).toLowerCase().includes(idTaiKhoan)
          : true) &&
        (maGv ? item.ma_gv?.toLowerCase().includes(maGv) : true)
    );
    setFilteredData(filtered);
  }, [accoutList, location.search]);

  const handleDataChange = () => {
    dispatch(teacherAccoutActions.creators.fetchAllRequest());
  };

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return (
    <TeacherAccoutsListItem data={filteredData} onDataChange={handleDataChange} />
  );
};

export default TeacherAccoutsList;