import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import StudentInfoListItem from "./StudentInfoListItem.jsx";
import { useLocation } from "react-router-dom";
import hamChung from "../../services/service.hamChung.js";

const studentSubjectActions = createActions("sinh_vien");

const StudentInfoList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: studentList, loading, error } = useSelector(
    (state) => state.sinh_vien || { data: [], loading: false, error: null }
  );

  const [filteredData, setFilteredData] = useState([]);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(studentSubjectActions.creators.fetchAllRequest());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu sinh viên: ${error}`);
    }
  }, [error]);

  // Filter data based on search parameters
  useEffect(() => {
    const enrichAndFilterData = async () => {
      if (!studentList || studentList.length === 0) {
        setFilteredData([]);
        return;
      }

      // Enrich data with class information
      const enrichedData = await Promise.all(
        studentList.map(async (sv) => {
          let ten_lop = "";
          try {
            if (sv.ma_lop) {
              const lopRes = await hamChung.getOne("lop", sv.ma_lop);
              ten_lop = lopRes?.ten_lop || "";
            }
          } catch (err) {
            console.error("Lỗi lấy tên lớp:", err);
          }
          return { ...sv, ten_lop };
        })
      );

      // Get search parameters
      const params = new URLSearchParams(location.search);
      const ho = params.get("ho")?.toLowerCase() || "";
      const ten = params.get("ten")?.toLowerCase() || "";
      const phai = params.get("phai") || "";
      const maLop = params.get("ma_lop")?.toLowerCase() || "";

      // Filter data based on search parameters
      const filtered = enrichedData.filter(
        (item) =>
          (ho ? item.ho?.toLowerCase().includes(ho) : true) &&
          (ten ? item.ten?.toLowerCase().includes(ten) : true) &&
          (phai ? item.phai === phai : true) &&
          (maLop ? item.ma_lop?.toLowerCase().includes(maLop) : true)
      );

      setFilteredData(filtered);
    };

    enrichAndFilterData();
  }, [studentList, location.search]);

  // Handle data changes
  const handleDataChange = () => {
    dispatch(studentSubjectActions.creators.fetchAllRequest());
  };

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return <StudentInfoListItem data={filteredData} onDataChange={handleDataChange} />;
};

export default StudentInfoList;
