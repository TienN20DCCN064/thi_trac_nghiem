import React, { useState } from "react";
import { Card, Tabs } from "antd";
import StudentExamList from "./StudentExamList.jsx";
import StudentExamDetail from "./StudentExamDetail.jsx";

const { TabPane } = Tabs;

const StudentExamPage = () => {
  const [activeKey, setActiveKey] = useState("chua_lam");
  const [selectedExam, setSelectedExam] = useState(null);

  const handleViewDetail = (exam) => {
    setSelectedExam(exam);
    setActiveKey("detail");
  };

  return (
    <Card title="Bài thi của sinh viên">
      <Tabs activeKey={activeKey} onChange={(k) => setActiveKey(k)}>
        <TabPane tab="Chưa làm" key="chua_lam">
          <StudentExamList statusFilter="chua_lam" onViewDetail={handleViewDetail} />
        </TabPane>
        <TabPane tab="Đã làm" key="da_lam">
          <StudentExamList statusFilter="da_lam" onViewDetail={handleViewDetail} />
        </TabPane>
        <TabPane tab="Tất cả" key="tat_ca">
          <StudentExamList statusFilter="tat_ca" onViewDetail={handleViewDetail} />
        </TabPane>
        {selectedExam && (
          <TabPane tab="Chi tiết" key="detail">
            <StudentExamDetail exam={selectedExam} onBack={() => setActiveKey("chua_lam")} />
          </TabPane>
        )}
      </Tabs>
    </Card>
  );
};

export default StudentExamPage;