import React from "react";
import UserListItem from "./UserListItem";

const UserList = ({ 
    users, 
    onDeleteUserClick, 
    onEditUserClick, 
    onPageChange, 
    pageSize, 
    total, 
    totalPages, 
    currentPage   // lấy từ props, không tạo state nữa
}) => {
    return (
        <UserListItem
            data={users}
            onDeleteClick={onDeleteUserClick}
            onEditClick={onEditUserClick}
            currentPage={currentPage}
            onPageChange={onPageChange}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
        />
    );
};

export default UserList;

