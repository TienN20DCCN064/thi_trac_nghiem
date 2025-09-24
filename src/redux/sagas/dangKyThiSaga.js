import { call, put, takeLatest } from "redux-saga/effects";
import {
  FETCH_DANG_KY_THI_REQUEST,
  fetchDangKyThiSuccess,
  fetchDangKyThiFailure,
} from "../actions/dangKyThiActions.js";
import hamChung from "../../services/service.hamChung.js";


function* fetchDangKyThiSaga() {
  try {
    const response = yield call(hamChung.getAllDangKyThi);
    yield put(fetchDangKyThiSuccess(response));
  } catch (error) {
    yield put(fetchDangKyThiFailure(error.message));
  }
}

export default function* dangKyThiSaga() {
  yield takeLatest(FETCH_DANG_KY_THI_REQUEST, fetchDangKyThiSaga);
}
