import React, { useState } from "react";
import { Button, Upload, message, Space } from "antd";
import { UploadOutlined, DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ImportExportGuide from "./ImportExportGuide.jsx"; // 👈 import component hướng dẫn

const ImportExportExcel = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleImport = () => {
    message.info("Import Excel clicked");
  };

  const handleExport = () => {
    message.success("Export Excel clicked");
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      {/* Hàng ngang chứa 2 nút Import và Export */}
      <Space direction="horizontal" size="middle">
        <Upload beforeUpload={() => false} showUploadList={false}>
          <Button icon={<UploadOutlined />} onClick={handleImport}>
            Import từ Excel
          </Button>
        </Upload>

        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          Export ra Excel
        </Button>
      </Space>

      {/* Nút mở hướng dẫn nằm bên dưới */}
      <div style={{ marginTop: 20 }}>
        <Button
          type="primary"
          icon={<InfoCircleOutlined />}
          onClick={() => setIsGuideOpen(true)}
        >
          Hướng dẫn Import / Export
        </Button>
      </div>

      {/* Gọi component hướng dẫn */}
      <ImportExportGuide
        open={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};

export default ImportExportExcel;
