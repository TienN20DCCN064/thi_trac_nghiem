import React, { Component } from "react";
import { Form, Input, Button, Select, Space, Row, Col, Upload, Avatar, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";


const { Option } = Select;

class AddUserForm extends Component {
    formRef = React.createRef();

    state = {
        avatarUrl: null,
        avatarFileName: null // thêm để lưu tên file
    };
    componentDidUpdate(prevProps) {
        const { initialValues } = this.props;
        if (initialValues && initialValues !== prevProps.initialValues) {
            // Reset toàn bộ trước khi set để tránh giữ giá trị cũ
            this.formRef.current.resetFields();
            this.formRef.current.setFieldsValue(initialValues);

            // Nếu có ảnh thì hiển thị ảnh cũ
            if (initialValues.image) {
                this.setState({ avatarUrl: initialValues.image });
            } else {
                this.setState({ avatarUrl: null });
            }
        }
    }


    handleAdd = (value) => {
        // Nếu có avatarFileName thì gán vào image
        if (this.state.avatarFileName) {
            value.image = `/images/images_api/${this.state.avatarFileName}`;
        } else if (!value.image) {
            value.image = "/images/images_api/img_default.jpg";
        }
        if (this.props.onAdd_or_UpdateUser) {
            this.props.onAdd_or_UpdateUser(value);
        }
        const isAddUser = window.location.pathname.includes("user-add");
        if (isAddUser) {
            this.handleReset();
        }
    };


    handleCancel = () => {
        this.handleReset(); // reset form
        if (this.props.onCancel) {
            this.props.onCancel(); // gọi callback từ cha
        }
    };

    // --- Reset form và state ---
    handleReset = () => {
        this.formRef.current.resetFields();
        this.setState({ avatarUrl: null });
    };

    render() {

        return (
            <Form
                ref={this.formRef}
                layout="vertical"
                onFinish={this.handleAdd}
                style={{
                    fontSize: '12px', // giảm chữ
                }}
                initialValues={this.props.initialValues}
            >
                {/* Avatar upload */}

                <Form.Item label="Avatar" name="image">
                    <Upload
                        listType="picture-card"
                        name="image"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            const isImage = file.type.startsWith("image/");
                            if (!isImage) {
                                message.error("Chỉ cho phép upload hình ảnh!");
                                return Upload.LIST_IGNORE;
                            }
                            // Tạo URL tạm để hiển thị preview
                            const previewUrl = URL.createObjectURL(file);
                            this.setState({ avatarUrl: previewUrl, avatarFileName: file.name });
                            // Không upload file, chỉ lấy tên file
                            return Upload.LIST_IGNORE;
                        }}
                    >
                        <img
                            src={this.state.avatarUrl || "/images/images_api/img_default.jpg"}
                            alt="Avatar"
                            style={{
                                width: this.state.avatarUrl ? "90px" : "100px", // nếu không có avatarUrl thì dùng 100px
                                height: "100px",
                                objectFit: "cover",
                                cursor: "pointer",
                                display: "block",
                            }}
                        />

                    </Upload>
                </Form.Item>



                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên người dùng"
                            name="userName"
                            rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
                        >
                            <Input style={{ fontSize: '12px' }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                        >
                            <Input.Password style={{ fontSize: '12px' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                        >
                            <Input style={{ fontSize: '12px' }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ type: "email", message: "Email không hợp lệ" }]}
                        >
                            <Input style={{ fontSize: '12px' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                        >
                            <Input style={{ fontSize: '12px' }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Quyền"
                            name="roleId"
                            rules={[{ required: true, message: "Vui lòng chọn quyền" }]}
                            initialValue="User"
                        >
                            <Select placeholder="Chọn quyền" style={{ fontSize: '12px' }}>
                                <Option value="Admin">ROLE ADMIN</Option>
                                <Option value="Test">ROLE TEST</Option>
                                <Option value="User">ROLE USER</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item style={{ textAlign: "right" }}>
                    <Space>
                        <Button onClick={this.handleCancel}>Hủy</Button>
                        <Button
                            id="button"
                            type="primary"
                            htmlType="submit"
                            style={{ flex: 1 }}
                        >
                            Lưu
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

        );
    }
}

export default AddUserForm;
