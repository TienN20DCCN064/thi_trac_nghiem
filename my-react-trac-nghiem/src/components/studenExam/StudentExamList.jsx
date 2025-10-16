import React, { useEffect, useState } from "react";
import { Spin, message, Button } from "antd";
import StudentExamListItem from "./StudentExamListItem.jsx";
import hamChung from "../../services/service.hamChung.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import { getUserInfo } from "../../globals/globals.js";
import StudentExamDetail from "./StudentExamDetail.jsx";

const StudentExamList = ({ statusFilter = "chua_lam" }) => {
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const accountId = getUserInfo()?.id_tai_khoan;
        const userInfo = await hamChiTiet.getUserInfoByAccountId(accountId);
        if (!userInfo?.ma_sv) {
          setRegistrations([]);
          setLoading(false);
          return;
        }

        const allDangKy = await hamChung.getAll("dang_ky_thi");
        const eligible = (allDangKy || []).filter(
          (d) =>
            d.trang_thai === "Da_phe_duyet" &&
            d.ma_lop === userInfo.ma_lop
        );

        const allThi = await hamChung.getAll("thi");

        const merged = eligible.map((d) => {
          const thiForThis = (allThi || []).find(
            (t) => String(t.id_dang_ky_thi) === String(d.id_dang_ky_thi) && t.ma_sv === userInfo.ma_sv
          );
          return {
            ...d,
            status_student: thiForThis ? "da_lam" : "chua_lam",
            thi_record: thiForThis || null,
          };
        });

        const filtered =
          statusFilter === "tat_ca"
            ? merged
            : merged.filter((m) => m.status_student === statusFilter);

        setRegistrations(filtered);
      } catch (e) {
        console.error(e);
        message.error("Lỗi khi tải danh sách đăng ký thi");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [statusFilter]);

  const handleViewDetail = (record) => {
    setSelectedExam(record);
    setDetailVisible(true);
  };

  if (loading) return <Spin style={{ margin: 20 }} />;

  return (
    <>
      <StudentExamListItem 
        data={registrations} 
        onViewDetail={handleViewDetail} 
      />
      {detailVisible && (
        <StudentExamDetail 
          visible={detailVisible} 
          record={selectedExam} 
          onClose={() => setDetailVisible(false)} 
        />
      )}
    </>
  );
};

export default StudentExamList;