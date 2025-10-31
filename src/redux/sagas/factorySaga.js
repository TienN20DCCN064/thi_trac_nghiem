import { call, put, takeLatest } from "redux-saga/effects";
import hamChung from "../../services/service.hamChung.js";

export const createSaga = (tableName, types) => {
  function* fetchAll(action) {
    try {
      const data = yield call(hamChung.getAll, tableName);
      yield put({ type: types.FETCH_ALL_SUCCESS, payload: data });
      if (action.callback) action.callback({ success: true, data });
    } catch (error) {
      yield put({ type: types.FETCH_ALL_FAILURE, payload: error.message });
      if (action.callback) action.callback({ success: false, message: error.message });
    }
  }

  function* fetchOne(action) {
    try {
      const data = yield call(hamChung.getOne, tableName, action.payload);
      yield put({ type: types.FETCH_ONE_SUCCESS, payload: data });
      if (action.callback) action.callback({ success: true, data });
    } catch (error) {
      yield put({ type: types.FETCH_ONE_FAILURE, payload: error.message });
      if (action.callback) action.callback({ success: false, message: error.message });
    }
  }

  function* createItem(action) {
    try {
      const res = yield call(hamChung.create, tableName, action.payload);
      if (res.success) {
        yield put({ type: types.CREATE_SUCCESS, payload: res.data });
      } else {
        yield put({ type: types.CREATE_FAILURE, payload: res.message });
      }
      if (action.callback) action.callback(res);
    } catch (error) {
      yield put({ type: types.CREATE_FAILURE, payload: error.message });
      if (action.callback) action.callback({ success: false, message: error.message });
    }
  }

  function* updateItem(action) {
    try {
      const { id, data } = action.payload;
      const res = yield call(hamChung.update, tableName, id, data);
      if (res.success) {
        yield put({ type: types.UPDATE_SUCCESS, payload: res.data });
      } else {
        yield put({ type: types.UPDATE_FAILURE, payload: res.message });
      }
      if (action.callback) action.callback(res);
    } catch (error) {
      yield put({ type: types.UPDATE_FAILURE, payload: error.message });
      if (action.callback) action.callback({ success: false, message: error.message });
    }
  }

  function* deleteItem(action) {
    try {
      const res = yield call(hamChung.remove, tableName, action.payload);
      if (res.success) {
        yield put({ type: types.DELETE_SUCCESS, payload: action.payload });
      } else {
        yield put({ type: types.DELETE_FAILURE, payload: res.message });
      }
      if (action.callback) action.callback(res);
    } catch (error) {
      yield put({ type: types.DELETE_FAILURE, payload: error.message });
      if (action.callback) action.callback({ success: false, message: error.message });
    }
  }
  // cải tiến mới 
  // function* createItem(action) {
  //   try {
  //     const res = yield call(hamChung.create, tableName, action.payload);
  //     if (res.success) {
  //       yield put({ type: types.CREATE_SUCCESS, payload: res.data });

  //       // ✅ Fetch lại danh sách mới nhất sau khi thêm
  //       const allData = yield call(hamChung.getAll, tableName);
  //       yield put({ type: types.FETCH_ALL_SUCCESS, payload: allData });
  //     } else {
  //       yield put({ type: types.CREATE_FAILURE, payload: res.message });
  //     }

  //     if (action.callback) action.callback(res);
  //   } catch (error) {
  //     yield put({ type: types.CREATE_FAILURE, payload: error.message });
  //     if (action.callback)
  //       action.callback({ success: false, message: error.message });
  //   }
  // }

  // function* updateItem(action) {
  //   try {
  //     const { id, data } = action.payload;
  //     const res = yield call(hamChung.update, tableName, id, data);
  //     if (res.success) {
  //       yield put({ type: types.UPDATE_SUCCESS, payload: res.data });

  //       // ✅ Fetch lại danh sách mới nhất sau khi cập nhật
  //       const allData = yield call(hamChung.getAll, tableName);
  //       yield put({ type: types.FETCH_ALL_SUCCESS, payload: allData });
  //     } else {
  //       yield put({ type: types.UPDATE_FAILURE, payload: res.message });
  //     }

  //     if (action.callback) action.callback(res);
  //   } catch (error) {
  //     yield put({ type: types.UPDATE_FAILURE, payload: error.message });
  //     if (action.callback)
  //       action.callback({ success: false, message: error.message });
  //   }
  // }

  // function* deleteItem(action) {
  //   try {
  //     const res = yield call(hamChung.remove, tableName, action.payload);
  //     if (res.success) {
  //       yield put({ type: types.DELETE_SUCCESS, payload: action.payload });

  //       // ✅ Fetch lại danh sách mới nhất sau khi xóa
  //       const allData = yield call(hamChung.getAll, tableName);
  //       yield put({ type: types.FETCH_ALL_SUCCESS, payload: allData });
  //     } else {
  //       yield put({ type: types.DELETE_FAILURE, payload: res.message });
  //     }

  //     if (action.callback) action.callback(res);
  //   } catch (error) {
  //     yield put({ type: types.DELETE_FAILURE, payload: error.message });
  //     if (action.callback)
  //       action.callback({ success: false, message: error.message });
  //   }
  // }

  return function* rootSaga() {
    yield takeLatest(types.FETCH_ALL_REQUEST, fetchAll);
    yield takeLatest(types.FETCH_ONE_REQUEST, fetchOne);
    yield takeLatest(types.CREATE_REQUEST, createItem);
    yield takeLatest(types.UPDATE_REQUEST, updateItem);
    yield takeLatest(types.DELETE_REQUEST, deleteItem);
  };
};
