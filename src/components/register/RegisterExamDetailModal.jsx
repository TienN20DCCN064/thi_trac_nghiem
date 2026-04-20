import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Table,
  Spin,
  message,
  Descriptions,
  Tag,
  Input,
  DatePicker,
  Button,
  Select,
} from "antd";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import hamChung from "../../services/service.hamChung.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import moment from "moment";
import { useDispatch } from "react-redux";
import { createActions } from "../../redux/actions/factoryActions.js";
import CellDisplay from "../../components/common/CellDisplay.jsx";
import { getUserInfo } from "../../globals/globals.js"; // <-- thêm import

const dangKyThiActions = createActions("dang_ky_thi");

const { Option } = Select;

const RegisterExamDetailModal = ({
  visible,
  id_dang_ky_thi,
  mode = "view",
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [examDetails, setExamDetails] = useState(null);
  const [chapterDetails, setChapterDetails] = useState([]);
  const [editExamDetails, setEditExamDetails] = useState(null);
  const [editChapterDetails, setEditChapterDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionCounts, setQuestionCounts] = useState({});
  const [lopOptions, setLopOptions] = useState([]);
  const [monHocOptions, setMonHocOptions] = useState([]);
  const [validationError, setValidationError] = useState("");

  // Gọi API danh sách lớp, môn
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const lops = await hamChung.getAll("lop");
        const monhocs = await hamChung.getAll("mon_hoc");
        setLopOptions(lops);
        setMonHocOptions(monhocs);
      } catch {
        message.error("Lỗi tải danh sách lớp / môn học", { duration: 3 }); // 👈 Set duration
      }
    };
    if (visible) fetchOptions();
  }, [visible]);

  // Gọi API chi tiết đăng ký thi
  useEffect(() => {
    if (!visible || !id_dang_ky_thi) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const exam = await hamChung.getOne("dang_ky_thi", id_dang_ky_thi);
        const details = (await hamChung.getAll("chi_tiet_dang_ky_thi")).filter(
          (d) => d.id_dang_ky_thi === id_dang_ky_thi
        );
        const getOne_gv = await hamChung.getOne("giao_vien", exam.ma_gv);
        exam.ho_ten_gv = getOne_gv ? `${getOne_gv.ho} ${getOne_gv.ten}` : "";
        const soCauThi = details.reduce((sum, d) => sum + (d.so_cau || 0), 0);
        exam.so_cau_thi = soCauThi;
        setExamDetails(exam);
        setEditExamDetails({ ...exam, so_cau_thi: soCauThi });
        setChapterDetails(details);
        setEditChapterDetails(details);
        if (mode === "edit" && exam.ma_mh && exam.trinh_do) {
          fetchQuestionCounts(exam.ma_mh, exam.trinh_do);
        }
      } catch (error) {
        message.error(`Lỗi tải dữ liệu: ${error.message}`, { duration: 3 }); // 👈 Set duration
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [visible, id_dang_ky_thi, mode]);

  // Fetch questionCounts khi ma_mh hoặc trinh_do thay đổi
  useEffect(() => {
    if (
      mode === "edit" &&
      editExamDetails?.ma_mh &&
      editExamDetails?.trinh_do
    ) {
      fetchQuestionCounts(editExamDetails.ma_mh, editExamDetails.trinh_do);
    } else {
      setQuestionCounts({});
    }
  }, [mode, editExamDetails?.ma_mh, editExamDetails?.trinh_do]);

  // Tính tổng so_cau_thi động
  useEffect(() => {
    if (mode === "edit") {
      const total = editChapterDetails.reduce(
        (sum, c) => sum + (Number(c.so_cau) || 0),
        0
      );
      setEditExamDetails((prev) => ({ ...prev, so_cau_thi: total }));
    }
  }, [editChapterDetails, mode]);

  const fetchQuestionCounts = async (ma_mh, trinh_do) => {
    try {
      const data = await hamChiTiet.getQuestionCountByChapter(ma_mh, trinh_do);
      setQuestionCounts(data);
    } catch (error) {
      console.error("Lỗi tải số câu hỏi:", error);
      setQuestionCounts({});
      message.error("Lỗi tải số câu hỏi theo chương", { duration: 3 }); // 👈 Set duration
    }
  };

  const renderQuestionCountText = () => {
    if (!editExamDetails?.ma_mh || !editExamDetails?.trinh_do) {
      return "Vui lòng chọn môn học và trình độ để xem số câu hỏi đã soạn.";
    }
    if (Object.keys(questionCounts).length === 0) {
      return "Chưa có câu hỏi nào được soạn cho môn học và trình độ này.";
    }
    const text = Object.entries(questionCounts)
      .map(([chapter, count]) => `Chương ${chapter}: ${count} câu hỏi`)
      .join(", ");
    return `Số câu hỏi đã soạn: ${text}`;
  };

  const handleInputChange = useCallback(
    (field, value) =>
      setEditExamDetails((prev) => ({ ...prev, [field]: value })),
    []
  );

  const handleChapterChange = (i, field, value) =>
    setEditChapterDetails((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c))
    );

  const handleAddChapter = () =>
    setEditChapterDetails((prev) => [
      ...prev,
      { id_dang_ky_thi, chuong_so: "", so_cau: 1, id: `temp_${Date.now()}` },
    ]);

  const handleDeleteChapter = (i) => {
    if (editChapterDetails.length <= 1) {
      message.warning("Phải có ít nhất 1 chương!", { duration: 3 }); // 👈 Set duration
      return;
    }
    setEditChapterDetails((prev) => prev.filter((_, idx) => idx !== i));
  };

  const validateChapters = () => {
    console.log("🚀 Validating chapters:", editChapterDetails);
    let errMsg = "";
    for (const c of editChapterDetails) {
      if (!c.chuong_so || c.chuong_so <= 0) {
        errMsg += `Chương ${c.chuong_so || "không xác định"} không hợp lệ. `;
        continue;
      }
      const available = questionCounts[c.chuong_so] || 0;
      if (c.so_cau > available) {
        errMsg += `Chương ${c.chuong_so} thiếu ${
          c.so_cau - available
        } câu (chỉ có ${available}). `;
      }
    }
    console.log("🚀 Validation error message:", errMsg);

    setValidationError(errMsg); // 🔹 Set state
    return !errMsg; // trả về true nếu không có lỗi
  };

  // Thêm hàm từ chối (dùng khi GiaoVu muốn set Tu_choi)
  const handleReject = async () => {
    if (!id_dang_ky_thi) return;
    setLoading(true);
    try {
      let payLoad = await hamChung.getOne("dang_ky_thi", id_dang_ky_thi);
      // const dataOneAccoutGv = await hamChung.getOne(
      //   "tai_khoan_giao_vien",
      //   getUserInfo().id_tai_khoan
      // );
       const dataAllGiaoVien = await hamChung.getAll("giao_vien");
      const dataOneAccoutGv = dataAllGiaoVien.find(
        (gv) => gv.id_tai_khoan === getUserInfo().id_tai_khoan
      );
      payLoad.trang_thai = "Tu_choi";
      payLoad.nguoi_phe_duyet = dataOneAccoutGv?.ma_gv || null;
      payLoad.updated_at = new Date().toISOString();
      const res = await hamChung.update("dang_ky_thi", id_dang_ky_thi, payLoad);
      if (res?.success) {
        dispatch(dangKyThiActions.creators.fetchAllRequest());
        message.success("Cập nhật trạng thái: Từ Chối");
        onCancel();
      } else {
        message.error(res?.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateChapters()) return;
    setLoading(true);
    console.log("🚀 Edit Exam Details:", editExamDetails);
    try {
      // Xây dựng payload giống FormAddExam
      const payload = {
        ma_gv: editExamDetails.ma_gv,
        ma_lop: editExamDetails.ma_lop,
        ma_mh: editExamDetails.ma_mh,
        trinh_do: editExamDetails.trinh_do,
        ngay_thi: editExamDetails.ngay_thi
          ? moment(editExamDetails.ngay_thi).format("YYYY-MM-DD HH:mm:ss")
          : null,
        thoi_gian: Number(editExamDetails.thoi_gian) || 0,
        chi_tiet_dang_ky_thi: editChapterDetails.map((c) => ({
          chuong_so: Number(c.chuong_so),
          so_cau: Number(c.so_cau),
        })),
      };
      // Nếu là trạng thái "Từ chối", khi gửi lại thì đổi thành "Chờ phê duyệt"
      console.log("🚀 Payload cập nhật đăng ký thi:", payload);
      await hamChung.updateExam(id_dang_ky_thi, payload);

      // Nếu bản ghi đang là "Tu_choi" -> gửi lại "Cho_phe_duyet" (đã có)
      if (editExamDetails.trang_thai === "Tu_choi") {
        const { chi_tiet_dang_ky_thi, ...rest } = payload;
        const update_payload = rest;
        update_payload.id_dang_ky_thi = id_dang_ky_thi;
        update_payload.trang_thai = "Cho_phe_duyet";
        update_payload.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        update_payload.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
        update_payload.nguoi_phe_duyet = null;
        console.log(
          "🚀 Payload cập nhật trạng thái đăng ký thi:",
          update_payload
        );
        const result = await hamChung.update(
          "dang_ky_thi",
          id_dang_ky_thi,
          update_payload
        );
        console.log("🚀 Kết quả cập nhật trạng thái đăng ký thi:", result);
      }

      // MỚI: Nếu bản ghi đang là "Da_phe_duyet" và người thao tác là GiaoVu,
      // khi lưu sẽ chuyển về "Cho_phe_duyet" (gửi lại để duyệt)
      if (
        editExamDetails.trang_thai === "Da_phe_duyet" &&
        getUserInfo().vai_tro === "GiaoVu"
      ) {
        const { chi_tiet_dang_ky_thi, ...rest } = payload;
        const update_payload = rest;
        update_payload.id_dang_ky_thi = id_dang_ky_thi;
        update_payload.trang_thai = "Cho_phe_duyet";
        update_payload.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        update_payload.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
        update_payload.nguoi_phe_duyet = null;
        console.log(
          "🚀 Payload chuyển Da_phe_duyet -> Cho_phe_duyet:",
          update_payload
        );
        const result = await hamChung.update(
          "dang_ky_thi",
          id_dang_ky_thi,
          update_payload
        );
        console.log("🚀 Kết quả cập nhật trạng thái đăng ký thi:", result);
      }

      message.success("Cập nhật thành công!");
      setExamDetails(editExamDetails);
      setChapterDetails(editChapterDetails);
      const soCauThi = editChapterDetails.reduce(
        (sum, c) => sum + (Number(c.so_cau) || 0),
        0
      );
      setExamDetails((prev) => ({ ...prev, so_cau_thi: soCauThi }));
      // Dispatch action Redux để làm mới danh sách
      dispatch(dangKyThiActions.creators.fetchAllRequest());

      onCancel();
    } catch (e) {
      message.error(`Lỗi lưu dữ liệu: ${e.message}`, { duration: 3 });
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (label, value) => (
    <Descriptions.Item label={label}>{value || "-"}</Descriptions.Item>
  );

  const columns = [
    {
      title: "Số Chương",
      render: (_, r, i) =>
        mode === "edit" ? (
          <Input
            type="number"
            min={1}
            value={editChapterDetails[i]?.chuong_so}
            onChange={(e) =>
              handleChapterChange(i, "chuong_so", Number(e.target.value) || "")
            }
          />
        ) : (
          `Chương ${r.chuong_so || "-"}`
        ),
    },
    {
      title: "Số Câu Hỏi",
      render: (_, r, i) =>
        mode === "edit" ? (
          <Input
            type="number"
            min={1}
            value={editChapterDetails[i]?.so_cau}
            onChange={(e) =>
              handleChapterChange(i, "so_cau", Number(e.target.value) || 0)
            }
          />
        ) : (
          r.so_cau || "-"
        ),
    },
    ...(mode === "edit"
      ? [
          {
            title: "Số câu có sẵn",
            render: (_, r, i) => {
              const currentChapter = editChapterDetails[i];
              const available = questionCounts[currentChapter?.chuong_so] || 0;
              const required = currentChapter?.so_cau || 0;
              const color = required > available ? "red" : "green";
              return <Tag color={color}>{available}</Tag>;
            },
            width: 120,
          },
        ]
      : []),
    {
      title: "Hành động",
      render: (_, __, i) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteChapter(i)}
          disabled={mode !== "edit"}
          size="small"
        />
      ),
      width: 95,
      align: "center",
    },
  ];

  const handleCancel = () => {
    setQuestionCounts({});
    onCancel();
  };

  return (
    <Modal
      title={`Chi Tiết Đăng Ký Thi (ID: ${id_dang_ky_thi}) ${
        mode === "edit" ? "(Chỉnh sửa)" : ""
      }`}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,

        // Nếu đang chỉnh sửa và là GiaoVu trên bản ghi Da_phe_duyet -> hiển thị nút Từ Chối
        mode === "edit" &&
          editExamDetails?.trang_thai === "Da_phe_duyet" &&
          getUserInfo().vai_tro === "GiaoVu" && (
            <Button
              key="reject"
              danger
              onClick={() =>
                Modal.confirm({
                  title: "Xác nhận từ chối",
                  content:
                    "Bạn có chắc chắn muốn chuyển trạng thái thành Từ Chối cho đăng ký thi này không?",
                  okText: "Từ Chối",
                  okType: "danger",
                  cancelText: "Hủy",
                  onOk: () => handleReject(),
                })
              }
              loading={loading}
            >
              Từ Chối
            </Button>
          ),

        mode === "edit" &&
          (editExamDetails?.trang_thai === "Tu_choi" ? (
            <Button
              key="resubmit"
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: "Xác nhận gửi lại yêu cầu",
                  content:
                    "Bạn có chắc muốn gửi lại yêu cầu phê duyệt đăng ký thi này không?",
                  okText: "Gửi lại",
                  cancelText: "Hủy",
                  onOk: () => handleSave(),
                });
              }}
              loading={loading}
            >
              Gửi lại yêu cầu
            </Button>
          ) : (
            <Button
              key="save"
              type="primary"
              onClick={handleSave}
              loading={loading}
            >
              Lưu
            </Button>
          )),
      ]}
      width={900}
    >
      {loading ? (
        <Spin
          tip="Đang tải..."
          style={{ display: "block", margin: "20px auto" }}
        />
      ) : editExamDetails ? (
        <>
          {mode === "edit" ? (
            <Descriptions
              bordered
              column={2}
              style={{ marginBottom: 20 }}
              styles={{
                label: { width: 120 },
                content: { width: "calc(100% - 120px)" },
              }}
            >
              <Descriptions.Item label="Mã GV" span={1}>
                <Input
                  value={editExamDetails?.ma_gv}
                  disabled
                  style={{ width: "100%" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Họ Tên GV" span={1}>
                <Input
                  value={editExamDetails?.ho_ten_gv}
                  disabled
                  style={{ width: "100%" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Lớp Học" span={1}>
                <Select
                  value={editExamDetails?.ma_lop}
                  onChange={(val) => handleInputChange("ma_lop", val)}
                  style={{ width: "100%" }}
                  placeholder="Chọn lớp"
                >
                  {lopOptions.map((opt) => (
                    <Option key={opt.ma_lop} value={opt.ma_lop}>
                      {opt.ten_lop}
                    </Option>
                  ))}
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label="Môn Học" span={1}>
                <Select
                  value={editExamDetails?.ma_mh}
                  onChange={(val) => handleInputChange("ma_mh", val)}
                  style={{ width: "100%" }}
                  placeholder="Chọn môn học"
                >
                  {monHocOptions.map((opt) => (
                    <Option key={opt.ma_mh} value={opt.ma_mh}>
                      {opt.ten_mh}
                    </Option>
                  ))}
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label="Trình Độ" span={1}>
                <Select
                  value={editExamDetails?.trinh_do}
                  onChange={(val) => handleInputChange("trinh_do", val)}
                  style={{ width: "100%" }}
                >
                  <Option value="ĐH">Đại Học</Option>
                  <Option value="CĐ">Cao Đẳng</Option>
                  <Option value="VB2">Văn Bằng 2</Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày Thi" span={1}>
                <DatePicker
                  value={
                    editExamDetails.ngay_thi
                      ? moment(editExamDetails.ngay_thi, "YYYY-MM-DD")
                      : null
                  }
                  onChange={(d) =>
                    handleInputChange(
                      "ngay_thi",
                      d ? d.format("YYYY-MM-DD") : editExamDetails.ngay_thi
                    )
                  }
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày thi" // giống Form Add
                  style={{ width: "100%" }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Thời Gian Thi (phút)" span={1}>
                <Input
                  type="number"
                  min={1}
                  value={editExamDetails?.thoi_gian}
                  onChange={(e) =>
                    handleInputChange("thoi_gian", Number(e.target.value) || 0)
                  }
                  style={{ width: "100%" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Số Câu Thi (tổng)" span={1}>
                <Input
                  type="number"
                  value={editExamDetails?.so_cau_thi || 0}
                  disabled
                  style={{ width: "100%" }}
                />
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
              {renderValue("Mã GV", examDetails.ma_gv)}
              {renderValue("Họ Tên GV", examDetails.ho_ten_gv)}
              {/* {renderValue("Mã Lớp", examDetails.ma_lop)} */}
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
                {examDetails.trang_thai ? (
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
                ) : (
                  "-"
                )}
              </Descriptions.Item>
              {renderValue(
                "Người Phê Duyệt",
                <CellDisplay
                  table="giao_vien"
                  id={examDetails.nguoi_phe_duyet}
                />
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
          )}
          <h3>Cấu trúc đề thi (theo chương)</h3>
          {mode === "edit" && (
            <div style={{ marginBottom: 16, color: "#1890ff", fontSize: 14 }}>
              {renderQuestionCountText()}
            </div>
          )}
          <Table
            rowKey={(r, i) => `${r.id_dang_ky_thi}_${r.chuong_so}_${i}`}
            columns={columns}
            dataSource={mode === "edit" ? editChapterDetails : chapterDetails}
            locale={{ emptyText: "Không có dữ liệu" }}
            pagination={false}
          />
          {mode === "edit" && (
            <>
              <Button
                type="dashed"
                onClick={handleAddChapter}
                icon={<PlusOutlined />}
                style={{ width: "100%", marginTop: 8 }}
              >
                Thêm chương
              </Button>

              {validationError && (
                <div style={{ color: "red", marginTop: 8 }}>
                  {validationError}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p>Không có thông tin đăng ký thi.</p>
      )}
    </Modal>
  );
};

export default RegisterExamDetailModal;
