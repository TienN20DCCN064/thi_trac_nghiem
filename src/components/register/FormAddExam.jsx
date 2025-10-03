import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Select,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/FormAddQuestionList.css";
import hamChung from "../../services/service.hamChung.js";
import hamChiTiet from "../../services/service.hamChiTiet.js";
import { getUserInfo } from "../../globals/globals.js";

const { Option } = Select;

const FormAddExam = ({ visible, onCancel }) => {
  const [chapters, setChapters] = useState([
    { chapterNumber: "", questionCount: 1 },
  ]);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [dsLop, setDsLop] = useState([]);
  const [dsMon, setDsMon] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchLopHoc();
    fetchMonHoc();
  }, []);

  useEffect(() => {
    const total = chapters.reduce((sum, c) => sum + (c.questionCount || 0), 0);
    setTotalQuestions(total);
    formRef.current?.setFieldsValue({ so_cau_thi: total });
  }, [chapters]);

  useEffect(() => {
    if (selectedSubject && selectedLevel) {
      fetchQuestionCounts(selectedSubject, selectedLevel);
    } else {
      setQuestionCounts({});
    }
  }, [selectedSubject, selectedLevel]);

  const fetchLopHoc = async () => {
    try {
      const data = await hamChung.getAll("lop");
      setDsLop(data);
    } catch (error) {
      console.error("Lỗi tải danh sách lớp:", error);
    }
  };

  const fetchMonHoc = async () => {
    try {
      const data = await hamChung.getAll("mon_hoc");
      setDsMon(data);
    } catch (error) {
      console.error("Lỗi tải danh sách môn:", error);
    }
  };

  const fetchQuestionCounts = async (ma_mh, trinh_do) => {
    try {
      const data = await hamChiTiet.getQuestionCountByChapter(ma_mh, trinh_do);
      setQuestionCounts(data);
    } catch (error) {
      console.error("Lỗi tải số câu hỏi:", error);
      setQuestionCounts({});
    }
  };

  const handleAddChapter = () => {
    setChapters([...chapters, { chapterNumber: "", questionCount: 1 }]);
  };

  const handleDeleteChapter = (index) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
  };

  const handleLevelChange = (value) => {
    setSelectedLevel(value);
  };

  const handleOk = async () => {
    try {
      const values = await formRef.current.validateFields();

      const id_tai_khoanUser = getUserInfo().id_tai_khoan;
      const gvData = await hamChung.getOne(
        "tai_khoan_giao_vien",
        id_tai_khoanUser
      );
      const ma_gv = gvData?.ma_gv || "";

      // Chuyển ngày sang định dạng YYYY-MM-DD để MySQL hiểu
      const ngayThiSQL = values.ngay_thi
        ? values.ngay_thi.format("YYYY-MM-DD HH:mm:ss")
        : null;

      const payload = {
        ma_gv,
        ma_lop: values.ma_lop,
        ma_mh: values.ma_mh,
        trinh_do: values.trinh_do,
        ngay_thi: ngayThiSQL,
        // so_cau_thi: Number(totalQuestions) || 0,
        thoi_gian: Number(values.thoi_gian) || 60,
        chi_tiet_dang_ky_thi: chapters.map((c) => ({
          chuong_so: Number(c.chapterNumber),
          so_cau: Number(c.questionCount),
        })),
      };
      console.log("🚀 Payload đăng ký thi:", payload);

      const result = await hamChung.registerExam(payload);

      message.success(result.message || "Đăng ký thi thành công!");
      formRef.current.resetFields();
      setChapters([{ chapterNumber: "", questionCount: 1 }]);
      setQuestionCounts({});
      setSelectedSubject(null);
      setSelectedLevel(null);
      onCancel();
      // Tải lại trang web
      hamChung.reloadWeb_test();
    } catch (error) {
      console.error("❌ Lỗi validate hoặc API:", error);

      if (error.message?.includes("Chương")) {
        const match = error.message.match(/Chương (\d+)/);
        if (match) {
          const chapterNumber = parseInt(match[1], 10);
          formRef.current.setFields([
            {
              name: ["chapters", chapterNumber - 1, "questionCount"],
              errors: [error.message],
            },
          ]);
        }
      }

      message.error(error.message || "Form chưa hợp lệ hoặc lỗi server!");
    }
  };

  const handleCancel = () => {
    formRef.current.resetFields();
    setChapters([{ chapterNumber: "", questionCount: 1 }]);
    setQuestionCounts({});
    setSelectedSubject(null);
    setSelectedLevel(null);
    onCancel();
  };

  const renderQuestionCountText = () => {
    if (!selectedSubject || !selectedLevel) {
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

  return (
    <Modal
      title="Đăng Ký Thi"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Hủy"
      centered
      width={800}
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={{
          ma_lop: undefined,
          ma_mh: undefined,
          ngay_thi: null,
          thoi_gian: 60,
          so_cau_thi: totalQuestions,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ma_lop"
              label="Mã lớp"
              rules={[{ required: true, message: "Vui lòng chọn mã lớp!" }]}
            >
              <Select placeholder="Chọn lớp">
                {dsLop.map((lop) => (
                  <Option key={lop.ma_lop} value={lop.ma_lop}>
                    {lop.ten_lop} ({lop.ma_lop})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ma_mh"
              label="Mã môn học"
              rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
            >
              <Select placeholder="Chọn môn học" onChange={handleSubjectChange}>
                {dsMon.map((mon) => (
                  <Option key={mon.ma_mh} value={mon.ma_mh}>
                    {mon.ten_mh} ({mon.ma_mh})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="trinh_do"
              label="Trình độ"
              rules={[{ required: true, message: "Vui lòng chọn trình độ!" }]}
            >
              <Select placeholder="Chọn trình độ" onChange={handleLevelChange}>
                <Option value="ĐH">Đại học</Option>
                <Option value="CĐ">Cao đẳng</Option>
                <Option value="VB2">Văn bằng 2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ngay_thi"
              label="Ngày thi"
              rules={[{ required: true, message: "Vui lòng chọn ngày thi!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày thi"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="thoi_gian"
              label="Thời gian thi (phút)"
              rules={[
                { required: true, message: "Vui lòng nhập thời gian thi!" },
              ]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Nhập thời gian (phút)"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="so_cau_thi"
              label="Số câu cần thi"
              rules={[
                {
                  required: true,
                  message: "Số câu cần thi được tính tự động!",
                },
              ]}
            >
              <InputNumber
                disabled
                style={{ width: "100%" }}
                value={totalQuestions}
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginBottom: 16, color: "#1890ff" }}>
          {renderQuestionCountText()}
        </div>

        <Form.Item label="Chi tiết chương">
          {chapters.map((chapter, index) => (
            <Row
              key={index}
              gutter={8}
              align="middle"
              style={{ marginBottom: 8 }}
            >
              <Col span={10}>
                <Form.Item
                  name={["chapters", index, "chapterNumber"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập số chương!" },
                  ]}
                  noStyle
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder={`Chương ${index + 1}`}
                    value={chapter.chapterNumber}
                    onChange={(value) => {
                      const newChapters = [...chapters];
                      newChapters[index].chapterNumber = value;
                      setChapters(newChapters);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name={["chapters", index, "questionCount"]}
                  initialValue={1}
                  rules={[{ required: true, message: "Vui lòng nhập số câu!" }]}
                  noStyle
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    value={chapter.questionCount}
                    onChange={(value) => {
                      const newChapters = [...chapters];
                      newChapters[index].questionCount = value || 1;
                      setChapters(newChapters);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteChapter(index)}
                  disabled={chapters.length <= 1}
                />
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={handleAddChapter}
                />
              </Col>
            </Row>
          ))}
          <Button
            type="dashed"
            onClick={handleAddChapter}
            icon={<PlusOutlined />}
            style={{ width: "100%", marginTop: 8 }}
          >
            Thêm chương
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormAddExam;
