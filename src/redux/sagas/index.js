// redux/sagas/index.js
import { all } from "redux-saga/effects";
import { createSaga } from "./factorySaga.js";
import { createActions } from "../actions/factoryActions.js";
import PrimaryKeys  from "../../globals/databaseKey.js";

const sagas = [];

Object.keys(PrimaryKeys).forEach((table) => {
  const { types } = createActions(table);
  sagas.push(createSaga(table, types));
});

export default function* rootSaga() {
  yield all(sagas.map((saga) => saga()));
}
