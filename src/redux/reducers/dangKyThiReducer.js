import {
  FETCH_DANG_KY_THI_REQUEST,
  FETCH_DANG_KY_THI_SUCCESS,
  FETCH_DANG_KY_THI_FAILURE,
} from "../actions/dangKyThiActions";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function dangKyThiReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DANG_KY_THI_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DANG_KY_THI_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_DANG_KY_THI_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
