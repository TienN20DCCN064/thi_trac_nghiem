// redux/sagas/factorySaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import hamChung from "../../services/service.hamChung.js";

export const createSaga = (tableName, types) => {
  function* fetchAll() {
    try {
      const data = yield call(hamChung.getAll, tableName);
      yield put({ type: types.FETCH_ALL_SUCCESS, payload: data });
    } catch (error) {
      yield put({ type: types.FETCH_ALL_FAILURE, payload: error.message });
    }
  }

  function* fetchOne(action) {
    try {
      const data = yield call(hamChung.getOne, tableName, action.payload);
      yield put({ type: types.FETCH_ONE_SUCCESS, payload: data });
    } catch (error) {
      yield put({ type: types.FETCH_ONE_FAILURE, payload: error.message });
    }
  }

  function* createItem(action) {
    try {
      const data = yield call(hamChung.create, tableName, action.payload);
      yield put({ type: types.CREATE_SUCCESS, payload: data });
    } catch (error) {
      yield put({ type: types.CREATE_FAILURE, payload: error.message });
    }
  }

  function* updateItem(action) {
    try {
      const { id, data } = action.payload;
      const res = yield call(hamChung.update, tableName, id, data);
      yield put({ type: types.UPDATE_SUCCESS, payload: res });
    } catch (error) {
      yield put({ type: types.UPDATE_FAILURE, payload: error.message });
    }
  }

  function* deleteItem(action) {
    try {
      const id = yield call(hamChung.delete, tableName, action.payload);
      yield put({ type: types.DELETE_SUCCESS, payload: id });
    } catch (error) {
      yield put({ type: types.DELETE_FAILURE, payload: error.message });
    }
  }

  return function* rootSaga() {
    yield takeLatest(types.FETCH_ALL_REQUEST, fetchAll);
    yield takeLatest(types.FETCH_ONE_REQUEST, fetchOne);
    yield takeLatest(types.CREATE_REQUEST, createItem);
    yield takeLatest(types.UPDATE_REQUEST, updateItem);
    yield takeLatest(types.DELETE_REQUEST, deleteItem);
  };
};
