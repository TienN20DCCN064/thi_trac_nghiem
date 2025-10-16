import React, { useEffect, useState } from "react";
import { Spin, message } from "antd";
import StudentExamListItem from "./StudentExamListItem.jsx";
import hamChung from "../../services/service.hamChung.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import { getUserInfo } from "../../globals/globals.js";

const StudentExamList = ({ statusFilter = "chua_lam" }) => {
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Lấy thông tin sinh viên từ tài khoản hiện tại
        const accountId = getUserInfo()?.id_tai_khoan;
        const userInfo = await hamChiTiet.getUserInfoByAccountId(accountId);
        if (!userInfo?.ma_sv) {
          setRegistrations([]);
          setLoading(false);
          return;
        }

        // Lấy danh sách đăng ký thi đã duyệt (hoặc tất cả tuỳ nhu cầu)
        const allDangKy = await hamChung.getAll("dang_ky_thi");
        const eligible = (allDangKy || []).filter(
          (d) =>
            d.trang_thai === "Da_phe_duyet" &&
            d.ma_lop === userInfo.ma_lop // chỉ các kỳ thi liên quan lớp SV
        );

        // Lấy bảng thi (bản ghi thi đã làm) để kiểm tra trạng thái cá nhân
        const allThi = await hamChung.getAll("thi");

        // Map -> thêm trạng thái 'da_lam' / 'chua_lam'
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

        // Apply filter
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

  if (loading) return <Spin style={{ margin: 20 }} />;

  return <StudentExamListItem data={registrations} />;
};

export default StudentExamList;