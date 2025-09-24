import React, { Component } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  InputNumber,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/FormAddQuestionList.css"; // File CSS để tùy chỉnh giao diện (nếu cần)

class FormAddExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [{ chapterNumber: "", questionCount: 1 }], // Danh sách chương ban đầu
    };
    this.formRef = React.createRef();
  }

  // Thêm chương mới
  handleAddChapter = () => {
    this.setState((prevState) => ({
      chapters: [
        ...prevState.chapters,
        { chapterNumber: "", questionCount: 1 },
      ],
    }));
  };

  // Xóa chương
  handleDeleteChapter = (index) => {
    this.setState((prevState) => ({
      chapters: prevState.chapters.filter((_, i) => i !== index),
    }));
  };

  // Xử lý khi submit form
  handleOk = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        // Dữ liệu từ form
        const examData = {
          ma_lop: values.ma_lop,
          ma_mh: values.ma_mh,
          ngay_thi: values.ngay_thi,
          thoi_gian: values.thoi_gian,
          so_cau_thi: values.so_cau_thi,
          chapters: this.state.chapters,
        };
        console.log("Dữ liệu đăng ký thi:", examData);
        // TODO: Gọi API để lưu dữ liệu ở đây (khi có logic)

        // Reset form và đóng modal
        this.formRef.current.resetFields();
        this.setState({ chapters: [{ chapterNumber: "", questionCount: 1 }] });
        this.props.onCancel();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  // Xử lý khi hủy modal
  handleCancel = () => {
    this.formRef.current.resetFields();
    this.setState({ chapters: [{ chapterNumber: "", questionCount: 1 }] });
    this.props.onCancel();
  };

  render() {
    const { visible } = this.props;
    const { chapters } = this.state;

    return (
      <Modal
        title="Đăng Ký Thi"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        centered
        width={800}
      >
        <Form
          ref={this.formRef}
          layout="vertical"
          initialValues={{
            ma_lop: "",
            ma_mh: "",
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
                rules={[{ required: true, message: "Vui lòng nhập mã lớp!" }]}
              >
                <Input placeholder="Nhập mã lớp" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ma_mh"
                label="Mã môn học"
                rules={[
                  { required: true, message: "Vui lòng nhập mã môn học!" },
                ]}
              >
                <Input placeholder="Nhập mã môn học" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
          </Row>

          <Form.Item
            name="so_cau_thi"
            label="Số câu cần thi"
            rules={[
              { required: true, message: "Vui lòng nhập số câu cần thi!" },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Nhập số câu cần thi"
            />
          </Form.Item>

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
                    <Input
                      placeholder={`Chương ${index + 1}`}
                      value={chapter.chapterNumber}
                      onChange={(e) => {
                        const newChapters = [...this.state.chapters];
                        newChapters[index].chapterNumber = e.target.value;
                        this.setState({ chapters: newChapters });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={["chapters", index, "questionCount"]}
                    rules={[
                      { required: true, message: "Vui lòng nhập số câu!" },
                    ]}
                    noStyle
                  >
                    <InputNumber
                      min={1}
                      style={{ width: "100%" }}
                      placeholder="Số câu"
                      value={chapter.questionCount}
                      onChange={(value) => {
                        const newChapters = [...this.state.chapters];
                        newChapters[index].questionCount = value;
                        this.setState({ chapters: newChapters });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => this.handleDeleteChapter(index)}
                    disabled={chapters.length <= 1}
                  />
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={this.handleAddChapter}
                  />
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              onClick={this.handleAddChapter}
              icon={<PlusOutlined />}
              style={{ width: "100%", marginTop: 8 }}
            >
              Thêm chương
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default FormAddExam;
