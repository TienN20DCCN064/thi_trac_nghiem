import { Types } from '../actions/users';

const INITIAL_STATE = {
    items: [],
    loading: false, // cờ loading
};

export default function users(state = INITIAL_STATE, action) {
    switch (action.type) {
        // ================= Bật loading khi gọi API =================
        case Types.GET_USERS_REQUEST:
        case Types.GET_USERS_PAGE_REQUEST:
        case Types.CREATE_USER_REQUEST:
        case Types.UPDATE_USER_REQUEST:
        case Types.DELETE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        // ================= Tắt loading khi thành công =================
        case Types.GET_USERS_SUCCESS: {
            return {
                ...state,
                items: action.payload.items,
                loading: false
            }
        }
        case Types.GET_USERS_PAGE_SUCCESS: {
            return {
                ...state,
                items: action.payload.items,
                page: action.payload.page,
                pageSize: action.payload.pageSize,
                total: action.payload.total,
                totalPages: action.payload.totalPages,
                name: action.payload.name || state.name,
                phone: action.payload.phone || state.phone,
                loading: false
            }
        }

        case Types.CREATE_USER_SUCCESS:
        case Types.UPDATE_USER_SUCCESS:
        case Types.DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false
            };

        // ================= Tắt loading khi lỗi =================
        case Types.USERS_ERROR: {
            return {
                ...state,
                error: action.payload.error,
                loading: false
            }
        }

        default: {
            return state;
        }
    }
}
