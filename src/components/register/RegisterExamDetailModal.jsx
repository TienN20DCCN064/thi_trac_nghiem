import React, { useState, useEffect } from "react";
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
} from "antd";
import { DeleteOutlined , PlusOutlined} from "@ant-design/icons"; // Import icon xóa
import hamChung from "../../services/service.hamChung.js";
import moment from "moment";

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

  // Gọi API để lấy thông tin
  useEffect(() => {
    if (visible && id_dang_ky_thi) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const examResponse = await hamChung.getOne("dang_ky_thi", id_dang_ky_thi);
          const detailExamResponse = await hamChung.getAll("chi_tiet_dang_ky_thi");
          const detailExamResponse_for_id = detailExamResponse.filter(
            (item) => item.id_dang_ky_thi === id_dang_ky_thi
          );

          setExamDetails(examResponse);
          setEditExamDetails(examResponse);
          setChapterDetails(
            Array.isArray(detailExamResponse_for_id)
              ? detailExamResponse_for_id
              : []
          );
          setEditChapterDetails(
            Array.isArray(detailExamResponse_for_id)
              ? detailExamResponse_for_id
              : []
          );
        } catch (error) {
          message.error(`Lỗi khi tải chi tiết đăng ký thi: ${error.message}`);
          setExamDetails(null);
          setEditExamDetails(null);
          setChapterDetails([]);
          setEditChapterDetails([]);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [visible, id_dang_ky_thi]);

  // Xử lý thay đổi dữ liệu chỉnh sửa
  const handleInputChange = (field, value) => {
    setEditExamDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleChapterChange = (index, field, value) => {
    setEditChapterDetails((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };

  // Xử lý thêm chương mới
  const handleAddChapter = () => {
    setEditChapterDetails((prev) => [
      ...prev,
      {
        id_dang_ky_thi,
        chuong_so: "",
        so_cau: 0,
        id: `temp_${Date.now()}_${prev.length}`,
      },
    ]);
  };

  // Xử lý xóa chương
  const handleDeleteChapter = (index) => {
    setEditChapterDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý lưu dữ liệu
  const handleSave = async () => {
    setLoading(true);
    try {
      // Cập nhật dang_ky_thi
      await hamChung.update("dang_ky_thi", id_dang_ky_thi, editExamDetails);

      // Xử lý chi_tiet_dang_ky_thi
      for (const chapter of editChapterDetails) {
        if (chapter.id.toString().startsWith("temp_")) {
          const { id, ...chapterData } = chapter;
          await hamChung.create("chi_tiet_dang_ky_thi", chapterData);
        } else {
          await hamChung.update("chi_tiet_dang_ky_thi", chapter.id, chapter);
        }
      }

      // Xóa các chương đã bị xóa
      const currentIds = editChapterDetails.map((chapter) => chapter.id);
      const deletedChapters = chapterDetails.filter(
        (chapter) => !currentIds.includes(chapter.id)
      );
      for (const chapter of deletedChapters) {
        if (!chapter.id.toString().startsWith("temp_")) {
          await hamChung.delete("chi_tiet_dang_ky_thi", chapter.id);
        }
      }

      message.success("Cập nhật đăng ký thi thành công!");
      setExamDetails(editExamDetails);
      setChapterDetails(editChapterDetails);
      onCancel();
    } catch (error) {
      message.error(`Lỗi khi lưu dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cột cho bảng chi_tiet_dang_ky_thi
  const columns = [
    {
      title: "Số Chương",
      key: "chuong_so",
      render: (_, record, index) =>
        mode === "edit" ? (
          <Input
            value={editChapterDetails[index]?.chuong_so}
            onChange={(e) =>
              handleChapterChange(index, "chuong_so", e.target.value)
            }
          />
        ) : (
          `Chương ${record.chuong_so || "-"}`
        ),
      width: "46%", // Chiếm 4.6 phần (46%)
    },
    {
      title: "Số Câu Hỏi",
      key: "so_cau",
      render: (_, record, index) =>
        mode === "edit" ? (
          <Input
            type="number"
            value={editChapterDetails[index]?.so_cau}
            onChange={(e) =>
              handleChapterChange(index, "so_cau", e.target.value)
            }
          />
        ) : (
          record.so_cau || "-"
        ),
      width: "46%", // Chiếm 4.6 phần (46%)
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record, index) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteChapter(index)}
          disabled={mode !== "edit"} // Khóa ở chế độ view
          size="small" // Nút nhỏ hơn
          style={{ padding: "0 8px" }} // Thu gọn padding
        >
          {/* Xóa */}
        </Button>
      ),
      width: "8%", // Chiếm 0.8 phần (8%), nhỏ hơn
    },
  ];

 const modalFooter =
  mode === "edit"
    ? [
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
    : null;


  return (
    <Modal
      title={`Chi Tiết Đăng Ký Thi (ID: ${id_dang_ky_thi})`}
      visible={visible}
      onCancel={onCancel}
      footer={modalFooter}
      width={800}
    >
      {loading ? (
        <Spin
          tip="Đang tải chi tiết..."
          style={{ display: "block", margin: "20px auto" }}
        />
      ) : (
        <>
          {/* Thông tin từ dang_ky_thi */}
          {editExamDetails ? (
            mode === "edit" ? (
              <div style={{ marginBottom: 20 }}>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Mã GV">
                    <Input
                      value={editExamDetails.ma_gv}
                      onChange={(e) =>
                        handleInputChange("ma_gv", e.target.value)
                      }
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã Lớp">
                    <Input
                      value={editExamDetails.ma_lop}
                      onChange={(e) =>
                        handleInputChange("ma_lop", e.target.value)
                      }
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã Môn">
                    <Input
                      value={editExamDetails.ma_mh}
                      onChange={(e) =>
                        handleInputChange("ma_mh", e.target.value)
                      }
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày Thi">
                    <DatePicker
                      value={
                        editExamDetails.ngay_thi
                          ? moment(editExamDetails.ngay_thi)
                          : null
                      }
                      onChange={(date) =>
                        handleInputChange(
                          "ngay_thi",
                          date ? date.toISOString() : null
                        )
                      }
                      format="DD/MM/YYYY HH:mm"
                      showTime
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Số Câu Thi">
                    <Input
                      type="number"
                      value={editExamDetails.so_cau_thi}
                      onChange={(e) =>
                        handleInputChange("so_cau_thi", e.target.value)
                      }
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời Gian (phút)">
                    <Input
                      type="number"
                      value={editExamDetails.thoi_gian}
                      onChange={(e) =>
                        handleInputChange("thoi_gian", e.target.value)
                      }
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Trình Độ">
                    <Input
                      value={editExamDetails.trinh_do}
                      onChange={(e) =>
                        handleInputChange("trinh_do", e.target.value)
                      }
                    />
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ) : (
              <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
                <Descriptions.Item label="ID Đăng Ký">
                  {examDetails.id_dang_ky_thi}
                </Descriptions.Item>
                <Descriptions.Item label="Mã GV">
                  {examDetails.ma_gv || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã Lớp">
                  {examDetails.ma_lop || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Mã Môn">
                  {examDetails.ma_mh || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Thi">
                  {examDetails.ngay_thi
                    ? new Date(examDetails.ngay_thi).toLocaleString("vi-VN")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Số Câu Thi">
                  {examDetails.so_cau_thi || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Thời Gian (phút)">
                  {examDetails.thoi_gian || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Trình Độ">
                  {examDetails.trinh_do || "-"}
                </Descriptions.Item>
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
                <Descriptions.Item label="Người Phê Duyệt">
                  {examDetails.nguoi_phe_duyet || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Tạo">
                  {examDetails.created_at
                    ? new Date(examDetails.created_at).toLocaleString("vi-VN")
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày Cập Nhật">
                  {examDetails.updated_at
                    ? new Date(examDetails.updated_at).toLocaleString("vi-VN")
                    : "-"}
                </Descriptions.Item>
              </Descriptions>
            )
          ) : (
            <p>Không có thông tin đăng ký thi.</p>
          )}

          {/* Danh sách chi tiết từ chi_tiet_dang_ky_thi */}
          <h3>Danh Sách Chương</h3>
          <Table
            rowKey={(record, index) =>
              `${record.id_dang_ky_thi}_${record.chuong_so}_${index}`
            }
            columns={columns}
            dataSource={mode === "edit" ? editChapterDetails : chapterDetails}
            locale={{ emptyText: "Không có dữ liệu chi tiết đăng ký thi" }}
            pagination={false}
            style={{ width: "100%" }}
            tableLayout="fixed"
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
      )}
    </Modal>
  );
};

export default RegisterExamDetailModal;