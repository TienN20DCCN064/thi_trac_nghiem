import { takeEvery, takeLatest, take, call, put, fork, select } from 'redux-saga/effects';
import * as actions from '../actions/users.js';
import * as api from '../../services/users.js';

function* getUsers() {
    try {
        const result = yield call(api.getUsers);
        yield put(actions.getUsersSuccess({
            items: result.data.data
        }));
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to get the users'
        }));
    }
}

function* watchGetUsersRequest() {
    yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}


function* getUsers_page({ payload }) {
    try {
        const result = yield call(api.getUsers_page, payload); // payload có thể là { page, pageSize, name, phone }
        yield put(actions.getUsersPageSuccess({
            items: result.data.data,
            page: result.data.page,
            pageSize: result.data.pageSize,
            total: result.data.total,
            totalPages: result.data.totalPages,
            name: payload.name || '',   // phải gửi lại filter
            phone: payload.phone || ''
        }));
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to get the users'
        }));
    }
}

function* watchGetUsersPageRequest() {
    yield takeEvery(actions.Types.GET_USERS_PAGE_REQUEST, getUsers_page);
}

function getPagingFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
        page: parseInt(params.get("page"), 10) || 1,
        pageSize: parseInt(params.get("pageSize"), 10) || 10,
        name: params.get("name") || "",
        phone: params.get("phone") || ""
    };
}

function* deleteUser(userId) {
    try {
        yield call(api.deleteUser, userId);
        // Lấy lại danh sách theo phân trang từ URL
        const { page, pageSize, name, phone } = getPagingFromUrl();
        yield put(actions.getUsersPageRequest({ page, pageSize, name, phone }));
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to delete the user'
        }));
    }
}

function* watchDeleteUserRequest() {
    while (true) {
        const { payload } = yield take(actions.Types.DELETE_USER_REQUEST);
        yield call(deleteUser, payload.userId);
    }
}

function* createUser({ payload }) {
    try {
        yield call(api.createUser, {
            fullName: payload.fullName,
            email: payload.email,
            userName: payload.userName,
            password: payload.password,
            roleId: payload.roleId,
            phone: payload.phone,
            image: payload.image
        });
        // Lấy lại danh sách theo phân trang
        const { page, pageSize, name, phone } = getPagingFromUrl();
        yield put(actions.getUsersPageRequest({ page, pageSize, name, phone }));
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to create the user'
        }));
    }
}

function* watchCreateUserRequest() {
    yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUser);
}



function* updateUser({ payload }) {
    try {
        yield call(api.updateUser, {
            userId: payload.userId,
            fullName: payload.fullName,
            email: payload.email,
            userName: payload.userName,
            password: payload.password,
            roleId: payload.roleId,
            phone: payload.phone,
            image: payload.image
        });
        // Lấy lại danh sách theo phân trang
        const { page, pageSize, name, phone } = getPagingFromUrl();
        yield put(actions.getUsersPageRequest({ page, pageSize, name, phone }));
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to create the user'
        }));
    }
}

function* watchUpdateUserRequest() {
    yield takeLatest(actions.Types.UPDATE_USER_REQUEST, updateUser);
}
// role


const userSagas = [
    fork(watchGetUsersRequest),
    fork(watchDeleteUserRequest),
    fork(watchCreateUserRequest),
    fork(watchUpdateUserRequest),
    fork(watchGetUsersPageRequest),
    // fork(watchUpdateUserRequest)
];

export default userSagas;