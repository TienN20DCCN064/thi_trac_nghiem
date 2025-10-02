import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import RegisterExamListItem from "./RegisterExamListItem.jsx";
import { useLocation } from "react-router-dom";

import hamChung from "../../services/service.hamChung.js";

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

  const [filteredData, setFilteredData] = useState([]);

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

  // Xử lý enrich + lọc
  useEffect(() => {
    const buildData = async () => {
      const data = await filterRegisterExams(dangKyThiList, location.search);
      setFilteredData(data);
    };
    buildData();
  }, [dangKyThiList, location.search]);

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!dangKyThiList || dangKyThiList.length === 0)
    return <div>Không có dữ liệu</div>;

  return (
    <RegisterExamListItem
      data={filteredData} // 👈 dữ liệu đã enrich + lọc
      onDeleteClick={(id) =>
        dispatch(dangKyThiActions.creators.deleteRequest(id))
      }
      onEditClick={(id) => console.log("Sửa đăng ký thi:", id)}
      onViewDetailClick={(id) => console.log("Xem chi tiết:", id)}
    />
  );
};

export default RegisterExamList;

// ---------------------------
// Hàm enrich dữ liệu
// ---------------------------
const addDetailsToRegisterExam = async (list) => {
  if (!list || list.length === 0) return [];

  const enrichedData = await Promise.all(
    list.map(async (item) => {
      let ten_mh = "";
      let ten_lop = "";
      let ten_gv = "";

      try {
        const mhRes = await hamChung.getOne("mon_hoc", item.ma_mh);
        ten_mh = mhRes?.ten_mh || "";
      } catch (err) {
        console.error("Lỗi lấy môn học:", err);
      }

      try {
        const lopRes = await hamChung.getOne("lop", item.ma_lop);
        ten_lop = lopRes?.ten_lop || "";
      } catch (err) {
        console.error("Lỗi lấy lớp:", err);
      }

      try {
        const gvRes = await hamChung.getOne("giao_vien", item.ma_gv);
        if (gvRes) {
          ten_gv = `${gvRes.ho || ""} ${gvRes.ten || ""}`.trim();
        }
      } catch (err) {
        console.error("Lỗi lấy giáo viên:", err);
      }

      return {
        ...item,
        ten_mh,
        ten_lop,
        ten_gv,
      };
    })
  );

  return enrichedData;
};

// ---------------------------
// Hàm filter theo params
// ---------------------------
const filterRegisterExams = async (list, locationSearch) => {
  if (!list) return [];

  let dataArr = await addDetailsToRegisterExam(list);

  const params = new URLSearchParams(locationSearch);
  const name_gv = params.get("name_gv")?.toLowerCase() || "";
  const name_lop = params.get("name_lop")?.toLowerCase() || "";
  const name_mh = params.get("name_mh")?.toLowerCase() || "";
  const trinh_do = params.get("trinh_do")?.toLowerCase() || "";
  const trang_thai = params.get("trang_thai")?.toLowerCase() || "";

  // filter theo nhiều điều kiện
  dataArr = dataArr.filter((item) => {
    return (
      (name_gv ? item.ten_gv?.toLowerCase().includes(name_gv) : true) &&
      (name_lop ? item.ten_lop?.toLowerCase().includes(name_lop) : true) &&
      (name_mh ? item.ten_mh?.toLowerCase().includes(name_mh) : true) &&
      (trinh_do ? item.trinh_do?.toLowerCase().includes(trinh_do) : true) &&
      (trang_thai ? item.trang_thai?.toLowerCase().includes(trang_thai) : true)
    );
  });

  console.log("Filtered Register Exam Data:", dataArr);
  return dataArr;
};
