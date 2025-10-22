import React, { useState, useEffect } from "react";
import { Card, Tabs } from "antd";
import StudentExamList from "./StudentExamList.jsx";
import CustomBreadcrumb from "../CustomBreadcrumb.jsx";
import ExamResult from "./examsDetail/ExamResult.jsx"; // ✅ import

const { TabPane } = Tabs;

const StudentExamPage = () => {
  const [activeKey, setActiveKey] = useState("tat_ca");

  // result modal state driven by URL params
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({
    score: null,
    correct: null,
    total: null,
  });

  useEffect(() => {
    const checkParams = () => {
      const q = new URLSearchParams(window.location.search);
      const score = q.get("score");
      const correct = q.get("correct");
      const total = q.get("total");

      if (score !== null && correct !== null && total !== null) {
        setResultData({ score, correct, total });
        setShowResult(true);
      }
    };

    // chạy kiểm tra lần đầu (khi mount)
    checkParams();

    // lắng nghe khi user dùng back/forward (popstate) và custom event (khi pushState)
    window.addEventListener("popstate", checkParams);
    window.addEventListener("urlchange", checkParams);

    return () => {
      window.removeEventListener("popstate", checkParams);
      window.removeEventListener("urlchange", checkParams);
    };
  }, []);

  const handleCloseResult = () => {
    // remove only the result params
    const q = new URLSearchParams(window.location.search);
    q.delete("score");
    q.delete("correct");
    q.delete("total");
    const qs = q.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.pushState(null, "", newUrl);

    setShowResult(false);
    setResultData({ score: null, correct: null, total: null });
  };

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

      <ExamResult
        visible={showResult}
        score={resultData.score}
        correctCount={resultData.correct}
        total={resultData.total}
        onClose={handleCloseResult}
      />
    </>
  );
};

export default StudentExamPage;
