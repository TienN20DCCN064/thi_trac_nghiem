import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import TeacherQuestionListItem from "./TeacherQuestionListItem.jsx";
import { useLocation } from "react-router-dom";

import { getUserInfo, getRole } from "../../globals/globals.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import hamChung from "../../services/service.hamChung.js";

const teacherSubjectActions = createActions("cau_hoi");

const TeacherQuestionList = ({ status_question }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: questionList,
    loading,
    error,
  } = useSelector(
    (state) => state.cau_hoi || { data: [], loading: false, error: null }
  );

  const [groupedData, setGroupedData] = useState([]);

  // Fetch dữ liệu khi mount
  useEffect(() => {
    dispatch(teacherSubjectActions.creators.fetchAllRequest());
  }, [dispatch]);

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (error) {
      message.error(`Lỗi khi tải dữ liệu câu hỏi: ${error}`);
    }
  }, [error]);

  // Gom nhóm & lọc dữ liệu -> dùng hàm riêng
  useEffect(() => {
    const buildData = async () => {
      console.log(questionList);

      const data = await filterQuestions(questionList, location.search, status_question);
      setGroupedData(data);
    };
    buildData();
  }, [questionList, location.search, status_question]);

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!questionList || questionList.length === 0)
    return <div>Không có dữ liệu</div>;

  return <TeacherQuestionListItem data={groupedData} status_question={status_question} />;
};

// Hàm thêm thuộc tính chi tiết vào questionList
const addDetailsToQuestions = async (questionList) => {
  if (!questionList || questionList.length === 0) return [];

  const enrichedData = await Promise.all(
    questionList.map(async (q) => {
      let ten_mh = "";
      let ten_gv = "";
      console.log("Xử lý câu hỏi:", q.ma_gv);
      try {
        const mhRes = await hamChung.getOne("mon_hoc", q.ma_mh);
        ten_mh = mhRes?.ten_mh || "";
      } catch (err) {
        console.error("Lỗi lấy môn học:", err);
      }

      try {
        const gvRes = await hamChung.getOne("giao_vien", q.ma_gv);
        if (gvRes) {
          // ghép họ + tên
          ten_gv = `${gvRes.ho || ""} ${gvRes.ten || ""}`.trim();
        }
      } catch (err) {
        console.error("Lỗi lấy giáo viên:", err);
      }

      return {
        ...q,
        ten_mh,
        ten_gv,
      };
    })
  );

  return enrichedData;
};
// 👉 Hàm riêng xử lý lọc dữ liệu + enrich
// Thêm đối số mới `trangThaiXoaFilter` (có thể null hoặc chuỗi)
const filterQuestions = async (
  questionList,
  locationSearch,
  trangThaiXoaFilter = null
) => {
  if (!questionList) return [];

  // enrich trước
  let dataArr = await addDetailsToQuestions(questionList);

  const params = new URLSearchParams(locationSearch);
  const name_gv = params.get("name_gv")?.toLowerCase() || "";
  const name_mh = params.get("name_mh")?.toLowerCase() || "";
  const trinh_do = params.get("trinh_do")?.toLowerCase() || "";

  // Ưu tiên đầu vào trực tiếp hơn URL param
  const trang_thai_xoa =
    (trangThaiXoaFilter ?? params.get("trang_thai_xoa"))?.toLowerCase() || "";

  const map = {};
  dataArr.forEach((q) => {
    if (
      (name_gv ? q.ten_gv?.toLowerCase().includes(name_gv) : true) &&
      (name_mh ? q.ten_mh?.toLowerCase().includes(name_mh) : true) &&
      (trinh_do ? q.trinh_do?.toLowerCase().includes(trinh_do) : true) &&
      (trang_thai_xoa
        ? q.trang_thai_xoa?.toLowerCase() === trang_thai_xoa
        : true)
    ) {
      const key = `${q.ma_gv}_${q.ma_mh}_${q.trinh_do}`;
      if (!map[key]) {
        map[key] = {
          ma_gv: q.ma_gv,
          ma_mh: q.ma_mh,
          trinh_do: q.trinh_do,
          ten_gv: q.ten_gv,
          ten_mh: q.ten_mh,
          so_cau_hoi: 0,
        };
      }
      map[key].so_cau_hoi += 1;
    }
  });

  let groupedArr = Object.values(map);

  // Nếu là giáo viên thì lọc theo chính giáo viên đó
  if (getRole() === "GiaoVien") {
    const userInfo = await hamChiTiet.getUserInfoByAccountId(
      getUserInfo().id_tai_khoan
    );
    groupedArr = groupedArr.filter((item) => item.ma_gv === userInfo.ma_gv);
  }

  console.log("Filtered & Enriched Data:", groupedArr);
  return groupedArr;
};

export default TeacherQuestionList;
