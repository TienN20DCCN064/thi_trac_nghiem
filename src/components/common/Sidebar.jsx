import React from "react";
import TeacherSidebar from "./sidebar/TeacherSidebar";
import StudentSidebar from "./sidebar/StudentSidebar";
import RegistrarSidebar from "./sidebar/RegistrarSidebar";
import { getRole } from "../../globals/globals";

const Sidebar = () => {
  const role = getRole();
  console.log("Sidebar role:", role);

  if (role === "GiaoVu") {
    return <RegistrarSidebar />;
  } 
  else if (role === "GiaoVien") {
    return <TeacherSidebar />;
  } 
  else if (role === "SinhVien") {
    return <StudentSidebar />;
  } else {
    return null; // chưa đăng nhập thì không hiển thị
  }
};

export default Sidebar;
