import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, message } from "antd";
import StudentExamListItem from "./StudentExamListItem.jsx";
import { createActions } from "../../redux/actions/factoryActions.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import { getUserInfo } from "../../globals/globals.js";

const dangKyThiActions = createActions("dang_ky_thi");
const thiActions = createActions("thi");

const StudentExamList = ({ statusFilter = "chua_lam" }) => {
  const dispatch = useDispatch();
  const { data: dangKyThiList, loading: loadingDangKy, error } = useSelector(
    (state) => state.dang_ky_thi || { data: [], loading: false, error: null }
  );
  const { data: thiList, loading: loadingThi } = useSelector(
    (state) => state.thi || { data: [], loading: false }
  );

  const [filteredData, setFilteredData] = useState([]);

  // Fetch dữ liệu Redux khi mount
  useEffect(() => {
    dispatch(dangKyThiActions.creators.fetchAllRequest());
    dispatch(thiActions.creators.fetchAllRequest());
  }, [dispatch]);

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (error) message.error(`Lỗi khi tải dữ liệu đăng ký thi: ${error}`);
  }, [error]);

  // Xử lý enrich + lọc trạng thái sinh viên
  useEffect(() => {
    const buildData = async () => {
      try {
        const accountId = getUserInfo()?.id_tai_khoan;
        if (!accountId) return;

        const userInfo = await hamChiTiet.getUserInfoByAccountId(accountId);
        if (!userInfo?.ma_sv) {
          setFilteredData([]);
          return;
        }

        // Lọc đăng ký thi liên quan lớp sinh viên và đã duyệt
        const eligible = (dangKyThiList || []).filter(
          (d) => d.trang_thai === "Da_phe_duyet" && d.ma_lop === userInfo.ma_lop
        );

        // Map -> thêm trạng thái 'da_lam' / 'chua_lam'
        const merged = eligible.map((d) => {
          const thiForThis = (thiList || []).find(
            (t) =>
              String(t.id_dang_ky_thi) === String(d.id_dang_ky_thi) &&
              t.ma_sv === userInfo.ma_sv
          );
          return {
            ...d,
            status_student: thiForThis ? "da_lam" : "chua_lam",
            thi_record: thiForThis || null,
          };
        });

        // Apply filter theo props
        const filtered =
          statusFilter === "tat_ca"
            ? merged
            : merged.filter((m) => m.status_student === statusFilter);

        setFilteredData(filtered);
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi xử lý dữ liệu đăng ký thi");
      }
    };

    buildData();
  }, [dangKyThiList, thiList, statusFilter]);

  if (loadingDangKy || loadingThi) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0) return <div>Không có dữ liệu</div>;

  return <StudentExamListItem data={filteredData} />;
};

export default StudentExamList;
