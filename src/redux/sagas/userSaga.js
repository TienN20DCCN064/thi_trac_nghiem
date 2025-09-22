import { call, put, takeLatest } from "redux-saga/effects";
import {
  FETCH_USERS_REQUEST,
  fetchUsersSuccess,
  fetchUsersFailure,
} from "../actions/userActions.js";
import api from "../../services/api.js";

function* fetchUsersSaga() {
  try {
    const response = yield call(api.get, "/users");
    yield put(fetchUsersSuccess(response.data));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

export default function* userSaga() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
}
