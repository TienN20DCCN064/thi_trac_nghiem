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
import moment from "moment";

const { Option } = Select;

const RegisterExamDetailModal = ({
  visible,
  id_dang_ky_thi,
  mode = "view",
  onCancel,
}) => {
  const [examDetails, setExamDetails] = useState(null);
  const [chapterDetails, setChapterDetails] = useState([]);
  const [editExamDetails, setEditExamDetails] = useState(null);
  const [editChapterDetails, setEditChapterDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // options cho select
  const [lopOptions, setLopOptions] = useState([]);
  const [monHocOptions, setMonHocOptions] = useState([]);

  // Gọi API danh sách lớp, môn
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const lops = await hamChung.getAll("lop");
        const monhocs = await hamChung.getAll("mon_hoc");
        console.log("Lops:", lops);
        console.log("Monhocs:", monhocs);
        setLopOptions(lops);
        setMonHocOptions(monhocs);
      } catch {
        message.error("Lỗi tải danh sách lớp / môn học");
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
        setExamDetails(exam);
        setEditExamDetails(exam);
        setChapterDetails(details);
        setEditChapterDetails(details);
      } catch (error) {
        message.error(`Lỗi tải dữ liệu: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [visible, id_dang_ky_thi]);

  // Handlers
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
      { id_dang_ky_thi, chuong_so: "", so_cau: 0, id: `temp_${Date.now()}` },
    ]);

  const handleDeleteChapter = (i) =>
    setEditChapterDetails((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setLoading(true);
    try {
      await hamChung.update("dang_ky_thi", id_dang_ky_thi, editExamDetails);

      for (const c of editChapterDetails) {
        if (String(c.id).startsWith("temp_")) {
          const { id, ...data } = c;
          await hamChung.create("chi_tiet_dang_ky_thi", data);
        } else {
          await hamChung.update("chi_tiet_dang_ky_thi", c.id, c);
        }
      }

      const deleted = chapterDetails.filter(
        (c) => !editChapterDetails.find((ec) => ec.id === c.id)
      );
      for (const c of deleted)
        await hamChung.delete("chi_tiet_dang_ky_thi", c.id);

      message.success("Lưu thành công!");
      setExamDetails(editExamDetails);
      setChapterDetails(editChapterDetails);
      onCancel();
    } catch (e) {
      message.error(`Lỗi lưu dữ liệu: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Render input
  // const renderInput = (label, field, props = {}) => (
  //   <Descriptions.Item
  //     label={<span style={{ fontSize: 13 }}>{label}</span>}
  //     style={{ width: "50%" }}
  //   >
  //     <Input
  //       {...props}
  //       value={editExamDetails?.[field]}
  //       onChange={(e) => handleInputChange(field, e.target.value)}
  //       style={{ width: "100%" }}
  //     />
  //   </Descriptions.Item>
  // );

  // const renderSelect = (label, field, options) => (
  //   <Descriptions.Item
  //     label={<span style={{ fontSize: 13 }}>{label}</span>}
  //     style={{ width: "50%" }}
  //   >
  //     <Select
  //       value={editExamDetails?.[field]}
  //       onChange={(val) => handleInputChange(field, val)}
  //       style={{ width: "100%" }}
  //       placeholder={`Chọn ${label}`}
  //     >
  //       {options.map((opt) => (
  //         <Option key={opt.id} value={opt.id}>
  //           {opt.ten || opt.ma || opt.name}
  //         </Option>
  //       ))}
  //     </Select>
  //   </Descriptions.Item>
  // );

  const renderValue = (label, value) => (
    <Descriptions.Item label={label}>{value || "-"}</Descriptions.Item>
  );

  // Table columns
  const columns = [
    {
      title: "Số Chương",
      render: (_, r, i) =>
        mode === "edit" ? (
          <Input
            value={editChapterDetails[i]?.chuong_so}
            onChange={(e) =>
              handleChapterChange(i, "chuong_so", e.target.value)
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
            value={editChapterDetails[i]?.so_cau}
            onChange={(e) => handleChapterChange(i, "so_cau", e.target.value)}
          />
        ) : (
          r.so_cau || "-"
        ),
    },
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

  return (
    <Modal
      title={`Chi Tiết Đăng Ký Thi (ID: ${id_dang_ky_thi})`}
      open={visible}
      onCancel={onCancel}
      footer={
        mode === "edit" && [
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleSave}
            loading={loading}
          >
            Lưu
          </Button>,
        ]
      }
      width={800}
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
                label: { width: 120 }, // 👈 nhãn hẹp hơn
                content: { width: "calc(100% - 120px)" }, // 👈 nội dung rộng hơn
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
                  <Option value="ĐH">ĐH</Option>
                  <Option value="CĐ">CĐ</Option>
                  <Option value="VB2">VB2</Option>
                </Select>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày Thi" span={1}>
                <DatePicker
                  value={
                    editExamDetails.ngay_thi
                      ? moment(editExamDetails.ngay_thi)
                      : null
                  }
                  onChange={(d) =>
                    handleInputChange("ngay_thi", d ? d.toISOString() : null)
                  }
                  format="DD/MM/YYYY HH:mm"
                  showTime
                  style={{ width: "100%" }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Thời Gian Thi (phút)" span={1}>
                <Input
                  type="number"
                  value={editExamDetails?.thoi_gian}
                  onChange={(e) =>
                    handleInputChange("thoi_gian", e.target.value)
                  }
                  style={{ width: "100%" }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Số Câu Thi" span={1}>
                <Input
                  type="number"
                  value={
                    editChapterDetails?.reduce(
                      (sum, c) => sum + (Number(c.so_cau) || 0),
                      0
                    ) || 0
                  }
                  disabled
                  style={{ width: "100%" }}
                />
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
              {renderValue("Mã GV", examDetails.ma_gv)}
              {renderValue("Họ Tên GV", examDetails.ho_ten_gv)}
              {renderValue("Mã Lớp", examDetails.ma_lop)}
              {renderValue("Mã Môn Học", examDetails.ma_mh)}
              {renderValue("Trình Độ", examDetails.trinh_do)}
              {renderValue(
                "Ngày Thi",
                examDetails.ngay_thi
                  ? new Date(examDetails.ngay_thi).toLocaleString("vi-VN")
                  : "-"
              )}
              {renderValue("Thời Gian Thi", examDetails.thoi_gian)}
              {renderValue("Số Câu Thi", examDetails.so_cau_thi)}
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

              {renderValue("Người Phê Duyệt", examDetails.nguoi_phe_duyet)}
              {renderValue(
                "Ngày Tạo",
                examDetails.created_at &&
                  new Date(examDetails.created_at).toLocaleString("vi-VN")
              )}
              {renderValue(
                "Ngày Cập Nhật",
                examDetails.updated_at &&
                  new Date(examDetails.updated_at).toLocaleString("vi-VN")
              )}
            </Descriptions>
          )}

          <h3>Danh Sách Chương</h3>
          <Table
            rowKey={(r, i) => `${r.id_dang_ky_thi}_${r.chuong_so}_${i}`}
            columns={columns}
            dataSource={mode === "edit" ? editChapterDetails : chapterDetails}
            locale={{ emptyText: "Không có dữ liệu" }}
            pagination={false}
          />
          {mode === "edit" && (
            <Button
              type="dashed"
              onClick={handleAddChapter}
              icon={<PlusOutlined />}
              style={{ width: "100%", marginTop: 8 }}
            >
              Thêm chương
            </Button>
          )}
        </>
      ) : (
        <p>Không có thông tin đăng ký thi.</p>
      )}
    </Modal>
  );
};

export default RegisterExamDetailModal;
