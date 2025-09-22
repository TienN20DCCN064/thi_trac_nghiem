import { all } from "redux-saga/effects";
import userSaga from "./userSaga.js";
import userSagasTest from './users';

export default function* rootSaga() {
  
  yield all([
    ...userSagasTest(),
    userSaga()
  
  ]);
}
