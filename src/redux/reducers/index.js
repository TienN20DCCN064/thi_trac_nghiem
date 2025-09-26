// redux/reducers/index.js
import { combineReducers } from "redux";
import { createReducer } from "./factoryReducer.js";
import { createActions } from "../actions/factoryActions.js";
import  PrimaryKeys  from "../../globals/databaseKey.js";

const reducers = {};

Object.keys(PrimaryKeys).forEach((table) => {
  const { types } = createActions(table);
  reducers[table] = createReducer(table, types);
});

const rootReducer = combineReducers(reducers);
export default rootReducer;
