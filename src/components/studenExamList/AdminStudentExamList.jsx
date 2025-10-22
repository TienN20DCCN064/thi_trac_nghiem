import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, message } from "antd";
import AdminStudentExamListItem from "./AdminStudentExamListItem.jsx";
import { createActions } from "../../redux/actions/factoryActions.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import { getUserInfo } from "../../globals/globals.js";

const dangKyThiActions = createActions("dang_ky_thi");
const thiActions = createActions("thi");

const AdminStudentExamList = () => {
  const dispatch = useDispatch();
  const {
    data: dangKyThiList,
    loading: loadingDangKy,
    error,
  } = useSelector(
    (state) => state.dang_ky_thi || { data: [], loading: false, error: null }
  );
  const { data: thiList, loading: loadingThi } = useSelector(
    (state) => state.thi || { data: [], loading: false }
  );

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(dangKyThiActions.creators.fetchAllRequest());
    dispatch(thiActions.creators.fetchAllRequest());
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error(`Lỗi khi tải dữ liệu đăng ký thi: ${error}`);
  }, [error]);

  useEffect(() => {
    const buildData = async () => {
      try {
        const account = getUserInfo();
        if (!account) return;

        let eligible = [];

        // 1. Lấy thông tin chi tiết nếu là giáo viên
        let userInfo = null;
        if (account.vai_tro === "GiaoVien") {
          userInfo = await hamChiTiet.getUserInfoByAccountId(
            account.id_tai_khoan
          );
        }

        // 2. Lọc dữ liệu theo vai trò
        if (account.vai_tro === "GiaoVu") {
          eligible = (dangKyThiList || []).filter(
            (d) => d.trang_thai === "Da_phe_duyet"
          );
        } else if (account.vai_tro === "GiaoVien" && userInfo?.ma_gv) {
          eligible = (dangKyThiList || []).filter(
            (d) => d.trang_thai === "Da_phe_duyet" && d.ma_gv === userInfo.ma_gv
          );
        }

        // 3. Gộp danh sách đăng ký thi và danh sách thi
        const merged = eligible
          .map((d) => {
            const thiForThis = (thiList || []).filter(
              (t) => String(t.id_dang_ky_thi) === String(d.id_dang_ky_thi)
            );
            return thiForThis.map((t) => ({
              ...d,
              status_student: t ? "da_lam" : "chua_lam",
              thi_record: t || null,
              sinh_vien: t?.ma_sv || null,
            }));
          })
          .flat();
        console.log("Eligible Data: ", eligible);
        console.log("Merged Data: ", merged);

        setFilteredData(merged);
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi xử lý dữ liệu đăng ký thi");
      }
    };

    buildData();
  }, [dangKyThiList, thiList]);

  if (loadingDangKy || loadingThi) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0)
    return <div>Không có dữ liệu</div>;

  return <AdminStudentExamListItem data={filteredData} />;
};

export default AdminStudentExamList;
