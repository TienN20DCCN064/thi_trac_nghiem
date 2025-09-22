import axios from 'axios';

export const getUsers_page = ({ page, pageSize, name, phone }) => {
    return axios.get('/users/paging', {
        params: {
            page,
            pageSize,
            name,    // thêm
            phone    // thêm
        }
    });
};


export const getUsers = () => {
    return axios.get('/users', {
        params: {
            limit: 1000
        }
    });
};

export const getUser = (userId) => {
    return axios.get(`/users/${userId}`);
};

// Tạo user mới
export const createUser = ({ fullName, email, userName, password, roleId, phone, image }) => {
    console.log("create user", fullName, email, userName, password, roleId, phone, image);
    return axios.post('/users', {
        fullName,
        email,
        userName,
        password,
        roleId,
        phone,
        image
    });
};


export const deleteUser = (userId) => {
    return axios.delete(`/users/${userId}`);
};

// Cập nhật user
export const updateUser = ({ userId, fullName, email, userName, password, roleId, phone, image }) => {
    console.log(userId, fullName, email, userName, password, roleId, phone, image);
    return axios.put(`/users/${userId}`, {
        fullName,
        email,
        userName,
        password,
        roleId,
        phone,
        image
    });
};

