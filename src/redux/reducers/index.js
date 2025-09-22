import { combineReducers } from "redux";
import userReducer from "./userReducer.js";
import userstest from "./users.js";

const rootReducer = combineReducers({
  users: userReducer,
  userstest: userstest,
});

export default rootReducer;
