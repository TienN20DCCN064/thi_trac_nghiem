import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import StudentExamPage from "./components/studenExam/StudentExamPage.jsx";
import StudentExamDetailPage from "./pages/StudentExamDetailPage.jsx";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={StudentExamPage} />
        <Route path="/student/exam/detail" component={StudentExamDetailPage} />
      </Switch>
    </Router>
  );
};

export default App;