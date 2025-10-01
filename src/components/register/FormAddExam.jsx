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
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/FormAddQuestionList.css";
import hamChung from "../../services/service.hamChung.js";

const { Option } = Select;

const FormAddExam = ({ visible, onCancel }) => {
  const [chapters, setChapters] = useState([{ chapterNumber: "", questionCount: 1 }]);
  const [dsLop, setDsLop] = useState([]);
  const [dsMon, setDsMon] = useState([]);
  const formRef = useRef(null);

  // Load dữ liệu khi mở form
  useEffect(() => {
    fetchLopHoc();
    fetchMonHoc();
  }, []);

  // Giả sử gọi API lấy danh sách lớp
  const fetchLopHoc = async () => {
    try {
      const data = await hamChung.getAll("lop");
      setDsLop(data);
    } catch (error) {
      console.error("Lỗi tải danh sách lớp:", error);
    }
  };

  // Giả sử gọi API lấy danh sách môn học
  const fetchMonHoc = async () => {
    try {
      const data = await hamChung.getAll("mon_hoc");
      setDsMon(data);
    } catch (error) {
      console.error("Lỗi tải danh sách môn:", error);
    }
  };

  // Thêm chương mới
  const handleAddChapter = () => {
    setChapters([...chapters, { chapterNumber: "", questionCount: 1 }]);
  };

  // Xóa chương
  const handleDeleteChapter = (index) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  // Submit form
  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const examData = {
          ma_lop: values.ma_lop,
          ma_mh: values.ma_mh,
          trinh_do: values.trinh_do,
          ngay_thi: values.ngay_thi,
          thoi_gian: values.thoi_gian,
          so_cau_thi: values.so_cau_thi,
          chapters,
        };
        console.log("Dữ liệu đăng ký thi:", examData);

        formRef.current.resetFields();
        setChapters([{ chapterNumber: "", questionCount: 1 }]);
        onCancel();
      })
      .catch((error) => console.error("Validation failed:", error));
  };

  // Cancel modal
  const handleCancel = () => {
    formRef.current.resetFields();
    setChapters([{ chapterNumber: "", questionCount: 1 }]);
    onCancel();
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
          so_cau_thi: 10,
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
              <Select placeholder="Chọn môn học">
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
              <Select placeholder="Chọn trình độ">
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
              rules={[{ required: true, message: "Vui lòng nhập thời gian thi!" }]}
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
              rules={[{ required: true, message: "Vui lòng nhập số câu cần thi!" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Nhập số câu cần thi"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Chi tiết chương">
          {chapters.map((chapter, index) => (
            <Row key={index} gutter={8} align="middle" style={{ marginBottom: 8 }}>
              <Col span={10}>
                <Form.Item
                  name={["chapters", index, "chapterNumber"]}
                  rules={[{ required: true, message: "Vui lòng nhập số chương!" }]}
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
                  rules={[{ required: true, message: "Vui lòng nhập số câu!" }]}
                  noStyle
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="Số câu"
                    value={chapter.questionCount}
                    onChange={(value) => {
                      const newChapters = [...chapters];
                      newChapters[index].questionCount = value;
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
