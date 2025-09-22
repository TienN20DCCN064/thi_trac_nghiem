import React, { Component } from "react";
import { Input, Button, Space, Row, Col } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";

class UserSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.initialName || "",
      phone: props.initialPhone || ""
    };
  }
  componentDidUpdate(prevProps) {
    // Nếu giá trị filter thay đổi thì cập nhật lại state
    if (
      prevProps.initialName !== this.props.initialName ||
      prevProps.initialPhone !== this.props.initialPhone
    ) {
      this.setState({
        name: this.props.initialName || "",
        phone: this.props.initialPhone || ""
      });
    }
  }

  handleInputChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  handleSearch = () => {
    const { name, phone } = this.state;
    console.log("Searching with:", { name, phone });
    // Gọi callback từ props nếu có, truyền giá trị tìm kiếm
    if (this.props.onSearch) {
      this.props.onSearch({ name, phone });
    }
  };

  handleReset = () => {
    this.setState({ name: "", phone: "" });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { name, phone } = this.state;

    return (
      <div
        style={{
          background: "#fff", // nền trắng
          marginBottom: "16px", // khoảng cách dưới
          marginTop: "16px",
        }}
      >
        <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => this.handleInputChange(e, "name")}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => this.handleInputChange(e, "phone")}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space style={{ width: "100%" }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={this.handleSearch}
              >
                Tìm kiếm
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={this.handleReset}
              >
                Xóa
              </Button>
            </Space>
          </Col>

        </Row>

      </div>
    );
  }
}

export default UserSearchBar;
