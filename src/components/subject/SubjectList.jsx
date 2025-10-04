import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import SubjectListItem from "./SubjectListItem.jsx";
import { useLocation } from "react-router-dom";

const subjectActions = createActions("mon_hoc");

const SubjectList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: subjectList, loading, error } = useSelector(
    (state) => state.mon_hoc || { data: [], loading: false, error: null }
  );

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(subjectActions.creators.fetchAllRequest());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu môn học: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ma_mh = params.get("ma_mh")?.toLowerCase() || "";
    const ten_mh = params.get("ten_mh")?.toLowerCase() || "";

    const filtered = (subjectList || []).filter(
      (item) =>
        (ma_mh ? item.ma_mh?.toLowerCase().includes(ma_mh) : true) &&
        (ten_mh ? item.ten_mh?.toLowerCase().includes(ten_mh) : true)
    );

    setFilteredData(filtered);
  }, [subjectList, location.search]);

  const handleDataChange = () => {
    dispatch(subjectActions.creators.fetchAllRequest());
  };

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return (
    <SubjectListItem data={filteredData} onDataChange={handleDataChange} />
  );
};

export default SubjectList;