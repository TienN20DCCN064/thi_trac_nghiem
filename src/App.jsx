import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserList from "./components/UserList.jsx";
import Sidebar from "./components/Sidebar.js";

function Home() {
  return <h2>Welcome to My React App 🚀</h2>;
}

function About() {
  return <h2>About Page</h2>;
}

function App() {
  return (
    <>
      {/* <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>  👈 xám nhạt */}
      <Layout className="app-layout">
        <Sidebar />
        {/* <Layout className="app-container">
          <HeaderUserInfo />
          <Content className="app-content">{this.renderContent()}</Content>
        </Layout> */}
      </Layout>
      {/* 👇 thêm cái overlay loading ở đây */}
      {/* <LoadingOverlay
        loading={
          this.props.users.loading ||
          this.props.roles.loading ||
          this.props.questionGroups.loading
        }
      /> */}
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
