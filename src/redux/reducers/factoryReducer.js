// redux/reducers/factoryReducer.js

export const createReducer = (tableName, types) => {
  const initialState = {
    data: [],
    item: null,
    loading: false,
    error: null,
  };

  return function reducer(state = initialState, action) {
    switch (action.type) {
      case types.FETCH_ALL_REQUEST:
      case types.FETCH_ONE_REQUEST:
      case types.CREATE_REQUEST:
      case types.UPDATE_REQUEST:
      case types.DELETE_REQUEST:
        return { ...state, loading: true, error: null };

      case types.FETCH_ALL_SUCCESS:
        return { ...state, loading: false, data: action.payload };
      case types.FETCH_ONE_SUCCESS:
        return { ...state, loading: false, item: action.payload };
      case types.CREATE_SUCCESS:
        return { ...state, loading: false, data: [...state.data, action.payload] };
      case types.UPDATE_SUCCESS:
        return {
          ...state,
          loading: false,
          data: state.data.map((item) =>
            item.id === action.payload.id ? action.payload : item
          ),
        };
      case types.DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          data: state.data.filter((item) => item.id !== action.payload),
        };

      case types.FETCH_ALL_FAILURE:
      case types.FETCH_ONE_FAILURE:
      case types.CREATE_FAILURE:
      case types.UPDATE_FAILURE:
      case types.DELETE_FAILURE:
        return { ...state, loading: false, error: action.payload };

      default:
        return state;
    }
  };
};
