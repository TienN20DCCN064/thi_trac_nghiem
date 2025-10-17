import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, Table, message } from "antd";
import hamChung from "../../../services/service.hamChung.js";

/**
 * Hiển thị chi tiết đăng ký thi (join các bảng liên quan)
 * Props:
 * - visible, record (có id_dang_ky_thi), onCancel
 */
const StudentExamDetailModal = ({ visible, record, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    if (visible && record) {
      fetchDetail(record.id_dang_ky_thi);
    } else {
      setDetail(null);
      setChapters([]);
    }
  }, [visible, record]);

  const fetchDetail = async (id) => {
    setLoading(true);
    try {
      // try single-get first
      let dk =
        (hamChung.get && (await hamChung.get("dang_ky_thi", id))) ||
        null;
      // fallback: read all and find
      if (!dk && hamChung.getAll) {
        const all = await hamChung.getAll("dang_ky_thi");
        dk = (all || []).find((x) => String(x.id_dang_ky_thi) === String(id));
      }
      if (!dk) throw new Error("Không tìm thấy đăng ký thi");

      // fetch related records (robust: dùng get nếu có, else getAll+find)
      const fetchOne = async (table, key) => {
        if (!table) return null;
        if (hamChung.get) {
          try {
            return await hamChung.get(table, key);
          } catch (_) {}
        }
        if (hamChung.getAll) {
          const all = await hamChung.getAll(table);
          return (all || []).find((r) => {
            // tìm theo 2 kiểu: khóa chính = key hoặc ma_x = key
            return (
              String(r[Object.keys(r)[0]]) === String(key) ||
              Object.values(r).some((v) => String(v) === String(key))
            );
          });
        }
        return null;
      };

      const monHoc = await fetchOne("mon_hoc", dk.ma_mh);
      const lop = await fetchOne("lop", dk.ma_lop);
      const gv = await fetchOne("giao_vien", dk.ma_gv);

      // lấy chi tiết chương/so_cau
      let chiTietList = [];
      if (hamChung.getAll) {
        const allCT = await hamChung.getAll("chi_tiet_dang_ky_thi");
        chiTietList = (allCT || []).filter(
          (c) => String(c.id_dang_ky_thi) === String(dk.id_dang_ky_thi)
        );
      } else if (hamChung.get && hamChung.getMany) {
        // placeholder nếu service hỗ trợ
        chiTietList = await hamChung.getMany("chi_tiet_dang_ky_thi", {
          id_dang_ky_thi: dk.id_dang_ky_thi,
        });
      }

      setDetail({
        ...dk,
        monHoc,
        lop,
        giaoVien: gv,
      });
      setChapters(chiTietList || []);
    } catch (e) {
      console.error(e);
      message.error("Không thể tải chi tiết đăng ký thi");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Chương số", dataIndex: "chuong_so", key: "chuong_so" },
    { title: "Số câu", dataIndex: "so_cau", key: "so_cau" },
  ];

  return (
    <Modal
      title="Chi tiết đăng ký thi"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {loading || !detail ? (
        <Spin style={{ width: "100%", padding: 30 }} />
      ) : (
        <>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã đăng ký">
              {detail.id_dang_ky_thi}
            </Descriptions.Item>
            <Descriptions.Item label="Môn học">
              {detail.monHoc?.ten_mh || detail.ma_mh}
            </Descriptions.Item>
            <Descriptions.Item label="Lớp">
              {detail.lop?.ten_lop || detail.ma_lop}
            </Descriptions.Item>
            <Descriptions.Item label="Giảng viên">
              {detail.giaoVien ? `${detail.giaoVien.ho} ${detail.giaoVien.ten}` : detail.ma_gv}
            </Descriptions.Item>
            <Descriptions.Item label="Trình độ / Thời gian / Ngày thi">
              {detail.trinh_do} / {detail.thoi_gian} phút / {detail.ngay_thi}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {detail.trang_thai}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo / Cập nhật">
              {detail.created_at} / {detail.updated_at}
            </Descriptions.Item>
          </Descriptions>

          <h4 style={{ marginTop: 12 }}>Chi tiết đề (chương / số câu)</h4>
          <Table
            rowKey={(r) => `${r.id_dang_ky_thi}-${r.chuong_so}`}
            dataSource={chapters}
            columns={columns}
            pagination={false}
            size="small"
          />
        </>
      )}
    </Modal>
  );
};

export default StudentExamDetailModal;