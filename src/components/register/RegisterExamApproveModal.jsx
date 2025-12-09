import React, { useState, useEffect } from "react";
import { Modal, Table, Spin, message, Descriptions, Tag, Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import hamChung from "../../services/service.hamChung.js";
import { useDispatch } from "react-redux";
import { createActions } from "../../redux/actions/factoryActions.js";
import CellDisplay from "../../components/common/CellDisplay.jsx";
import moment from "moment";
import { getUserInfo } from "../../globals/globals.js";
const dangKyThiActions = createActions("dang_ky_thi");

// component phê duyệt đăng ký thi
const RegisterExamApproveModal = ({
  visible,
  id_dang_ky_thi,
  onCancel,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [examDetails, setExamDetails] = useState(null);
  const [chapterDetails, setChapterDetails] = useState([]);

  useEffect(() => {
    if (!visible || !id_dang_ky_thi) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const exam = await hamChung.getOne("dang_ky_thi", id_dang_ky_thi);
        const allGV = await hamChung.getAll("giao_vien");
        const chiTiet = await hamChung.getAll("chi_tiet_dang_ky_thi");

        const teacher = allGV.find((gv) => gv.ma_gv === exam.ma_gv);
        exam.ho_ten_gv = teacher ? `${teacher.ho} ${teacher.ten}` : "";

        const filtered = chiTiet.filter(
          (c) => c.id_dang_ky_thi === id_dang_ky_thi
        );
        const soCauThi = filtered.reduce((sum, c) => sum + (c.so_cau || 0), 0);

        setExamDetails({ ...exam, so_cau_thi: soCauThi });
        setChapterDetails(filtered);
      } catch (error) {
        message.error("Lỗi tải dữ liệu đăng ký thi!");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [visible, id_dang_ky_thi]);

  const handleChangeStatus = async (newStatus, id_dang_ky_thi) => {
    if (!examDetails) return;

    let payLoad = await hamChung.getOne("dang_ky_thi", id_dang_ky_thi);
    // const dataOneAccoutGv = await hamChung.getOne(
    //   "tai_khoan_giao_vien",
    //   getUserInfo().id_tai_khoan
    // );
    const dataAllGiaoVien = await hamChung.getAll("giao_vien");
    const dataOneAccoutGv = dataAllGiaoVien.find(
      (gv) => gv.id_tai_khoan === getUserInfo().id_tai_khoan
    );

    payLoad.trang_thai = newStatus;
    payLoad.nguoi_phe_duyet = dataOneAccoutGv.ma_gv;
    payLoad.updated_at = new Date().toISOString();
    console.log("payLoad", payLoad);
    setLoading(true);
    const res = await hamChung.update("dang_ky_thi", id_dang_ky_thi, payLoad);
    if (res.success) {
      dispatch(dangKyThiActions.creators.fetchAllRequest());
      message.success("Cập nhật trạng thái đăng ký thi thành công!");
    } else {
      message.error(res.message || "Cập nhật trạng thái đăng ký thi thất bại!");
    }
  };

  const renderValue = (label, value) => (
    <Descriptions.Item label={label}>{value || "-"}</Descriptions.Item>
  );

  const columns = [
    {
      title: "Chương",
      dataIndex: "chuong_so",
      render: (v) => `Chương ${v}`,
      width: 120,
    },
    {
      title: "Số Câu",
      dataIndex: "so_cau",
      width: 120,
    },
  ];

  const canChangeStatus =
    examDetails?.trang_thai === "Cho_phe_duyet" &&
    getUserInfo().vai_tro === "GiaoVu";

  return (
    <Modal
      title={`Phê Duyệt Đăng Ký Thi (ID: ${id_dang_ky_thi})`}
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        canChangeStatus && (
          <Button
            key="approve"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleChangeStatus("Da_phe_duyet", id_dang_ky_thi)}
            loading={loading}
          >
            Phê Duyệt
          </Button>
        ),
        canChangeStatus && (
          <Button
            key="reject"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleChangeStatus("Tu_choi", id_dang_ky_thi)}
            loading={loading}
          >
            Từ Chối
          </Button>
        ),
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      {loading || !examDetails ? (
        <Spin
          tip="Đang tải..."
          style={{ display: "block", margin: "20px auto" }}
        />
      ) : (
        <>
          <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
            {renderValue("Mã GV", examDetails.ma_gv)}
            {renderValue("Họ Tên G1V", examDetails.ho_ten_gv)}
            {renderValue(
              "Lớp",
              <CellDisplay
                table="lop"
                id={examDetails.ma_lop}
                fieldName="ten_lop"
              />
            )}
            {renderValue(
              "Môn Học",
              <CellDisplay
                table="mon_hoc"
                id={examDetails.ma_mh}
                fieldName="ten_mh"
              />
            )}
            {renderValue(
              "Trình Độ",
              examDetails.trinh_do === "ĐH"
                ? "Đại Học"
                : examDetails.trinh_do === "CĐ"
                ? "Cao Đẳng"
                : examDetails.trinh_do === "VB2"
                ? "Văn Bằng 2"
                : examDetails.trinh_do
            )}
            {renderValue(
              "Ngày Thi",
              examDetails.ngay_thi
                ? new Date(examDetails.ngay_thi).toLocaleDateString("vi-VN")
                : "-"
            )}
            {renderValue("Thời Gian Thi", `${examDetails.thoi_gian} phút`)}
            {renderValue("Số Câu Thi (tổng)", examDetails.so_cau_thi)}
            <Descriptions.Item label="Trạng Thái">
              <Tag
                color={
                  examDetails.trang_thai === "Cho_phe_duyet"
                    ? "orange"
                    : examDetails.trang_thai === "Da_phe_duyet"
                    ? "green"
                    : examDetails.trang_thai === "Tu_choi"
                    ? "red"
                    : "gray"
                }
              >
                {examDetails.trang_thai === "Cho_phe_duyet"
                  ? "Chờ Duyệt"
                  : examDetails.trang_thai === "Da_phe_duyet"
                  ? "Đã Duyệt"
                  : examDetails.trang_thai === "Tu_choi"
                  ? "Từ Chối"
                  : examDetails.trang_thai}
              </Tag>
            </Descriptions.Item>

            {renderValue(
              "Người Phê Duyệt",
              <CellDisplay table="giao_vien" id={examDetails.nguoi_phe_duyet} />
            )}
            {renderValue(
              "Ngày Tạo",
              examDetails.created_at
                ? moment(examDetails.created_at)
                    .subtract(17, "hours")
                    .format("DD-MM-YYYY HH:mm:ss")
                : "-"
            )}
            {renderValue(
              "Ngày Cập Nhật",
              examDetails.updated_at
                ? moment(examDetails.updated_at)
                    .subtract(17, "hours")
                    .format("DD-MM-YYYY HH:mm:ss")
                : "-"
            )}
          </Descriptions>

          <h3>Danh Sách Chương</h3>
          <Table
            rowKey={(r, i) => `${r.id_dang_ky_thi}_${r.chuong_so}_${i}`}
            columns={columns}
            dataSource={chapterDetails}
            pagination={false}
            locale={{ emptyText: "Không có dữ liệu" }}
          />
        </>
      )}
    </Modal>
  );
};

export default RegisterExamApproveModal;
