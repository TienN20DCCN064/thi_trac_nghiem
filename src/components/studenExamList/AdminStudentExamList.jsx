import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, message } from "antd";
import { useLocation } from "react-router-dom";
import AdminStudentExamListItem from "./AdminStudentExamListItem.jsx";
import { createActions } from "../../redux/actions/factoryActions.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import hamChung from "../../services/service.hamChung.js";
import { getUserInfo } from "../../globals/globals.js";

const dangKyThiActions = createActions("dang_ky_thi");
const thiActions = createActions("thi");

const AdminStudentExamList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

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

  // Add details to exam registrations
  const addDetailsToExams = async (examList) => {
    if (!examList || examList.length === 0) return [];

    const enrichedData = await Promise.all(
      examList.map(async (exam) => {
        let ten_mh = "";
        let ten_gv = "";
        let ten_sv = "";
        let ten_lop = "";

        try {
          const mhRes = await hamChung.getOne("mon_hoc", exam.ma_mh);
          ten_mh = mhRes?.ten_mh || "";

          const gvRes = await hamChung.getOne("giao_vien", exam.ma_gv);
          if (gvRes) {
            ten_gv = `${gvRes.ho || ""} ${gvRes.ten || ""}`.trim();
          }

          if (exam.sinh_vien) {
            const svRes = await hamChung.getOne("sinh_vien", exam.sinh_vien);
            if (svRes) {
              ten_sv = `${svRes.ho || ""} ${svRes.ten || ""}`.trim();
            }

            const lopRes = await hamChung.getOne("lop", svRes?.ma_lop);
            ten_lop = lopRes?.ten_lop || "";
          }
        } catch (err) {
          console.error("Lỗi lấy thông tin chi tiết:", err);
        }

        return {
          ...exam,
          ten_mh,
          ten_gv,
          ten_sv,
          ten_lop,
        };
      })
    );

    return enrichedData;
  };

  // Filter exams based on search params
  const filterExams = async (examList, locationSearch) => {
    if (!examList) return [];

    // Enrich data first
    let dataArr = await addDetailsToExams(examList);

    const params = new URLSearchParams(locationSearch);
    const name_mh = params.get("name_mh")?.toLowerCase() || "";
    const name_lop = params.get("name_lop")?.toLowerCase() || "";
    const ma_sv = params.get("ma_sv")?.toLowerCase() || "";
    const name_sv = params.get("name_sv")?.toLowerCase() || "";
    const name_gv = params.get("name_gv")?.toLowerCase() || "";
    const trinh_do = params.get("trinh_do")?.toLowerCase() || "";

    return dataArr.filter(
      (exam) =>
        (name_mh ? exam.ten_mh?.toLowerCase().includes(name_mh) : true) &&
        (name_lop ? exam.ten_lop?.toLowerCase().includes(name_lop) : true) &&
        (ma_sv ? exam.sinh_vien?.toLowerCase().includes(ma_sv) : true) &&
        (name_sv ? exam.ten_sv?.toLowerCase().includes(name_sv) : true) &&
        (name_gv ? exam.ten_gv?.toLowerCase().includes(name_gv) : true) &&
        (trinh_do ? exam.trinh_do?.toLowerCase().includes(trinh_do) : true)
    );
  };

  useEffect(() => {
    const buildData = async () => {
      try {
        const account = getUserInfo();
        if (!account) return;

        let eligible = [];

        // 1. Lấy thông tin chi tiết nếu là giáo viên
        let userInfo = null;
        if (account.vai_tro === "GiaoVien") {
          userInfo = await hamChiTiet.getUserInfoByAccountId(account.id_tai_khoan);
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

        // 4. Apply search filters
        const filteredResults = await filterExams(merged, location.search);
        setFilteredData(filteredResults);
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi xử lý dữ liệu đăng ký thi");
      }
    };

    buildData();
  }, [dangKyThiList, thiList, location.search]);

  if (loadingDangKy || loadingThi) return <Spin style={{ margin: 20 }} />;
  if (!filteredData || filteredData.length === 0) return <div>Không có dữ liệu</div>;

  return <AdminStudentExamListItem data={filteredData} />;
};

export default AdminStudentExamList;
