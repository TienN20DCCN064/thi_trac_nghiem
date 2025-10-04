import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import InfoTeacherListItem from "./TeacherInfoListItem.jsx";
import { useLocation } from "react-router-dom";
import hamChung from "../../services/service.hamChung.js";

const teacherSubjectActions = createActions("giao_vien");

const InfoTeacherList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: teacherList, loading, error } = useSelector(
    (state) => state.giao_vien || { data: [], loading: false, error: null }
  );

  const [filteredData, setFilteredData] = useState([]);

  // Fetch dữ liệu khi mount
  useEffect(() => {
    dispatch(teacherSubjectActions.creators.fetchAllRequest());
  }, [dispatch]);

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu giảng viên: ${error}`);
    }
  }, [error]);

  // Lọc dữ liệu và enrich nếu cần
  useEffect(() => {
    const enrichAndFilterData = async () => {
      if (!teacherList || teacherList.length === 0) {
        setFilteredData([]);
        return;
      }

      // Nếu muốn enrich thêm thông tin bộ môn, ví dụ:
      const enrichedData = await Promise.all(
        teacherList.map(async (gv) => {
          let ten_bo_mon = "";
          try {
            // Nếu có trường ma_bo_mon thì lấy tên bộ môn
            if (gv.ma_bo_mon) {
              const bmRes = await hamChung.getOne("bo_mon", gv.ma_bo_mon);
              ten_bo_mon = bmRes?.ten_bo_mon || "";
            }
          } catch (err) {
            console.error("Lỗi lấy tên bộ môn:", err);
          }
          return { ...gv, ten_bo_mon };
        })
      );

      // Lọc dựa trên tham số tìm kiếm
      const params = new URLSearchParams(location.search);
      const maGV = params.get("ma_gv")?.toLowerCase() || "";
      const ho = params.get("ho")?.toLowerCase() || "";
      const ten = params.get("ten")?.toLowerCase() || "";
      const tenBoMon = params.get("ten_bo_mon")?.toLowerCase() || "";

      const filtered = enrichedData.filter(
        (item) =>
          (maGV ? item.ma_gv?.toLowerCase().includes(maGV) : true) &&
          (ho ? item.ho?.toLowerCase().includes(ho) : true) &&
          (ten ? item.ten?.toLowerCase().includes(ten) : true) &&
          (tenBoMon ? item.ten_bo_mon?.toLowerCase().includes(tenBoMon) : true)
      );

      setFilteredData(filtered);
    };

    enrichAndFilterData();
  }, [teacherList, location.search]);

  // Hàm xử lý khi dữ liệu thay đổi
  const handleDataChange = () => {
    dispatch(teacherSubjectActions.creators.fetchAllRequest());
  };

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return <InfoTeacherListItem data={filteredData} onDataChange={handleDataChange} />;
};

export default InfoTeacherList;