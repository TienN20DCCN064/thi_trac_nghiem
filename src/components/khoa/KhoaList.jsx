import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import KhoaListItem from "./KhoaListItem.jsx";
import { useLocation } from "react-router-dom";

const khoaSubjectActions = createActions("khoa");

const KhoaList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: khoaList, loading, error } = useSelector(
    (state) => state.khoa || { data: [], loading: false, error: null }
  );

  const [filteredData, setFilteredData] = useState([]);

  // Fetch dữ liệu khi mount
  useEffect(() => {
    dispatch(khoaSubjectActions.creators.fetchAllRequest());
  }, [dispatch]);

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu khoa: ${error}`);
    }
  }, [error]);

  // Lọc dữ liệu dựa trên tham số tìm kiếm từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const maKhoa = params.get("ma_khoa")?.toLowerCase() || "";
    const tenKhoa = params.get("ten_khoa")?.toLowerCase() || "";

    const filtered = khoaList.filter(
      (item) =>
        (maKhoa ? item.ma_khoa?.toLowerCase().includes(maKhoa) : true) &&
        (tenKhoa ? item.ten_khoa?.toLowerCase().includes(tenKhoa) : true)
    );

    setFilteredData(filtered);
  }, [khoaList, location.search]);

  // Hàm xử lý khi dữ liệu thay đổi (thêm/sửa/xóa)
  const handleDataChange = () => {
    dispatch(khoaSubjectActions.creators.fetchAllRequest());
  };

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return <KhoaListItem data={filteredData} onDataChange={handleDataChange} />;
};

export default KhoaList;