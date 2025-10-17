import React, { useState } from "react";
import { Card } from "antd";
import CheckExamForm from "./examsDetail/CheckExamForm.jsx";
import ExamFullScreen from "./examsDetail/ExamFullScreen.jsx";

const StudentExamTakingPage = () => {
  const [examRecord, setExamRecord] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleStartExam = (exam, student) => {
    setExamRecord(exam);
    setStudentInfo(student);
    setVisible(true);
  };

  return (
    <div style={{ padding: 16 }}>
      <Card title="Kiểm tra thông tin thi" style={{ maxWidth: 800, margin: "0 auto" }}>
        <CheckExamForm onSuccess={handleStartExam} />
      </Card>

      <ExamFullScreen
        visible={visible}
        exam={examRecord}
        student={studentInfo}
        onClose={() => {
          setVisible(false);
          setExamRecord(null);
          setStudentInfo(null);
        }}
      />
    </div>
  );
};

export default StudentExamTakingPage;