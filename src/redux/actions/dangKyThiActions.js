export const FETCH_DANG_KY_THI_REQUEST = "FETCH_DANG_KY_THI_REQUEST";
export const FETCH_DANG_KY_THI_SUCCESS = "FETCH_DANG_KY_THI_SUCCESS";
export const FETCH_DANG_KY_THI_FAILURE = "FETCH_DANG_KY_THI_FAILURE";

export const fetchDangKyThiRequest = () => ({ type: FETCH_DANG_KY_THI_REQUEST });
export const fetchDangKyThiSuccess = (data) => ({
  type: FETCH_DANG_KY_THI_SUCCESS,
  payload: data,
});
export const fetchDangKyThiFailure = (error) => ({
  type: FETCH_DANG_KY_THI_FAILURE,
  payload: error,
});
