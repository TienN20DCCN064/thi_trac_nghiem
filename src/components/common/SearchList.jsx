import React, { useState, useEffect } from "react";
import { Input, Button, Space, Row, Col, Select } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const RegisterExamListSearch = ({ fields = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // state lưu giá trị nhập của từng field
  const [values, setValues] = useState({});

  // load giá trị từ URL khi component mount hoặc thay đổi location
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newValues = {};
    fields.forEach((field) => {
      newValues[field.key] = params.get(field.key) || "";
    });
    setValues(newValues);
  }, [location.search, fields]);

  const handleInputChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams(location.search);
    fields.forEach((field) => {
      if (values[field.key]) {
        params.set(field.key, values[field.key]);
      } else {
        params.delete(field.key);
      }
    });
    navigate({ search: params.toString() });
  };

  const handleReset = () => {
    const params = new URLSearchParams(location.search);
    fields.forEach((field) => {
      params.delete(field.key);
    });
    navigate({ search: params.toString() });
  };

  return (
    <div
      style={{
        background: "#fff",
        marginBottom: "16px",
        marginTop: "16px",
        padding: "12px",
      }}
    >
      <Row gutter={[16, 16]}>
        {fields.map((field) => (
          <Col xs={24} sm={12} md={3} key={field.key}>
            {field.type === "select" ? (
              <Select
                style={{ width: "100%" }}
                placeholder={field.placeholder || field.key}
                value={values[field.key] || undefined}
                onChange={(value) => handleInputChange(field.key, value)}
                allowClear // 👈 dòng này cho phép clear về rỗng
              >
                {field.options?.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Input
                placeholder={field.placeholder || field.key}
                value={values[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              />
            )}
          </Col>
        ))}

        <Col xs={24} sm={12} md={6}>
          <Space style={{ width: "100%" }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleReset}>
              Xóa
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterExamListSearch;
