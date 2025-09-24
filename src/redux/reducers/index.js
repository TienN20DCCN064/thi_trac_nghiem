import { combineReducers } from "redux";
import dangKyThiReducer from "./dangKyThiReducer.js";

const rootReducer = combineReducers({
  dangKyThi: dangKyThiReducer,
});

export default rootReducer;
