import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import ClassListItem from "./ClassListItem.jsx";
import { useLocation } from "react-router-dom";
import hamChung from "../../services/service.hamChung.js";

const classSubjectActions = createActions("lop");

const ClassList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: classList, loading, error } = useSelector(
    (state) => state.lop || { data: [], loading: false, error: null }
  );

  const [filteredData, setFilteredData] = useState([]);

  // Fetch dữ liệu khi mount
  useEffect(() => {
    dispatch(classSubjectActions.creators.fetchAllRequest());
  }, [dispatch]);

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu lớp: ${error}`);
    }
  }, [error]);

  // Lọc dữ liệu và enrich với tên khoa
  useEffect(() => {
    const enrichAndFilterData = async () => {
      if (!classList || classList.length === 0) {
        setFilteredData([]);
        return;
      }

      // Enrich dữ liệu với tên khoa
      const enrichedData = await Promise.all(
        classList.map(async (lop) => {
          let ten_khoa = "";
          try {
            const khoaRes = await hamChung.getOne("khoa", lop.ma_khoa);
            ten_khoa = khoaRes?.ten_khoa || "";
          } catch (err) {
            console.error("Lỗi lấy tên khoa:", err);
          }
          return { ...lop, ten_khoa };
        })
      );

      // Lọc dựa trên tham số tìm kiếm
      const params = new URLSearchParams(location.search);
      const maLop = params.get("ma_lop")?.toLowerCase() || "";
      const tenLop = params.get("ten_lop")?.toLowerCase() || "";
      const tenKhoa = params.get("ten_khoa")?.toLowerCase() || "";

      const filtered = enrichedData.filter(
        (item) =>
          (maLop ? item.ma_lop?.toLowerCase().includes(maLop) : true) &&
          (tenLop ? item.ten_lop?.toLowerCase().includes(tenLop) : true) &&
          (tenKhoa ? item.ten_khoa?.toLowerCase().includes(tenKhoa) : true)
      );

      setFilteredData(filtered);
    };

    enrichAndFilterData();
  }, [classList, location.search]);

  // Hàm xử lý khi dữ liệu thay đổi
  const handleDataChange = () => {
    dispatch(classSubjectActions.creators.fetchAllRequest());
  };

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return <ClassListItem data={filteredData} onDataChange={handleDataChange} />;
};

export default ClassList;