import React, { useState } from "react";
import { Card, Tabs } from "antd";
import StudentExamList from "./StudentExamList.jsx";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";

const { TabPane } = Tabs;

const StudentExamPage = () => {
  const [activeKey, setActiveKey] = useState("tat_ca");

  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang Chủ" },
          { label: "Kỳ Thi" },
          { label: "Danh Sách Bài Thi", isCurrent: true },
        ]}
      />
      <div className="custom-card">
        <Card title="Bài thi của sinh viên">
          <Tabs activeKey={activeKey} onChange={(k) => setActiveKey(k)}>
            <TabPane tab="Tất cả" key="tat_ca">
              <StudentExamList statusFilter="tat_ca" />
            </TabPane>
            <TabPane tab="Chưa làm" key="chua_lam">
              <StudentExamList statusFilter="chua_lam" />
            </TabPane>
            <TabPane tab="Đã làm" key="da_lam">
              <StudentExamList statusFilter="da_lam" />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default StudentExamPage;
