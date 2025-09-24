import { all } from "redux-saga/effects";
import dangKyThiSaga from "./dangKyThiSaga.js";

export default function* rootSaga() {
  yield all([dangKyThiSaga()]);
}
