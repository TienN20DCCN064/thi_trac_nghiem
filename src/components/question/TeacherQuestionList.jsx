import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";
import { createActions } from "../../redux/actions/factoryActions.js";
import TeacherQuestionListItem from "./TeacherQuestionListItem.jsx";
import { useLocation } from "react-router-dom";

const teacherSubjectActions = createActions("cau_hoi");

const TeacherQuestionList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: questionList,
    loading,
    error,
  } = useSelector(
    (state) => state.cau_hoi || { data: [], loading: false, error: null }
  );

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

  // Gom nhóm thành "số câu hỏi theo môn học & giáo viên & trình độ"
  const groupedData = useMemo(() => {
    if (!questionList) return [];

    const params = new URLSearchParams(location.search);
    const ma_gv = params.get("ma_gv")?.toLowerCase() || "";
    const ma_mh = params.get("ma_mh")?.toLowerCase() || "";
    const trinh_do = params.get("trinh_do")?.toLowerCase() || "";

    const map = {};
    questionList.forEach((q) => {
      if (
        (ma_gv ? q.ma_gv?.toString().toLowerCase().includes(ma_gv) : true) &&
        (ma_mh ? q.ma_mh?.toString().toLowerCase().includes(ma_mh) : true) &&
        (trinh_do
          ? q.trinh_do?.toString().toLowerCase().includes(trinh_do)
          : true)
      ) {
        const key = `${q.ma_gv}_${q.ma_mh}_${q.trinh_do}`;
        if (!map[key]) {
          map[key] = {
            ma_gv: q.ma_gv,
            ma_mh: q.ma_mh,
            trinh_do: q.trinh_do,
            so_cau_hoi: 0,
          };
        }
        map[key].so_cau_hoi += 1;
      }
    });

    return Object.values(map);
  }, [questionList, location.search]);

  if (loading) return <Spin style={{ margin: 20 }} />;
  if (!questionList || questionList.length === 0)
    return <div>Không có dữ liệu</div>;

  return <TeacherQuestionListItem data={groupedData} />;
};

export default TeacherQuestionList;
