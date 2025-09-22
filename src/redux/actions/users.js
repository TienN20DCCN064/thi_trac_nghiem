export const Types = {
  // Users
  GET_USERS_REQUEST: "users/get_users_request",
  GET_USERS_SUCCESS: "users/get_users_success",

  CREATE_USER_REQUEST: "users/create_user_request",
  CREATE_USER_SUCCESS: "users/create_user_success",
  CREATE_USER_ERROR: "users/create_user_error",

  UPDATE_USER_REQUEST: "users/update_user_request",
  UPDATE_USER_SUCCESS: "users/update_user_success",
  UPDATE_USER_ERROR: "users/update_user_error",

  DELETE_USER_REQUEST: "users/delete_user_request",
  DELETE_USER_SUCCESS: "users/delete_user_success",
  DELETE_USER_ERROR: "users/delete_user_error",

  USERS_ERROR: "users/user_error",

  //   // Accounts
  //   GET_ACCOUNTS_REQUEST: "users/get_accounts_request",
  //   GET_ACCOUNT_REQUEST: "users/get_account_request",
  //   GET_ACCOUNT_SUCCESS: "users/get_account_success",
  //   DELETE_ACCOUNT_REQUEST: "users/delete_account_request",
  //   CREATE_ACCOUNT_REQUEST: "users/create_account_request",

  // Search
  SEARCH_USERS_REQUEST: "users/search_users_request",
  SEARCH_USERS_SUCCESS: "users/search_users_success",
  SEARCH_USERS_ERROR: "users/search_users_error",

  // Pagination
  GET_USERS_PAGE_REQUEST: "users/get_users_page_request",
  GET_USERS_PAGE_SUCCESS: "users/get_users_page_success",
  
};

// ============ Users ============
export const getUsersRequest = () => ({
  type: Types.GET_USERS_REQUEST,
});

export const getUsersSuccess = ({ items }) => ({
  type: Types.GET_USERS_SUCCESS,
  payload: { items },
});

// Pagination
export const getUsersPageRequest = ({ page, pageSize, name = "", phone = "" }) => ({
  type: Types.GET_USERS_PAGE_REQUEST,
  payload: { page, pageSize, name, phone },
});

export const getUsersPageSuccess = ({ items, page, pageSize, total, totalPages }) => ({
  type: Types.GET_USERS_PAGE_SUCCESS,
  payload: { items, page, pageSize, total, totalPages },
});

// Create
export const createUserRequest = ({ fullName, email, userName, password, roleId, phone, image }) => ({
  type: Types.CREATE_USER_REQUEST,
  payload: { fullName, email, userName, password, roleId, phone, image },
});

export const createUserSuccess = (user) => ({
  type: Types.CREATE_USER_SUCCESS,
  payload: user,
});

// Update
export const updateUserRequest = ({ userId, fullName, email, userName, password, roleId, phone, image }) => ({
  type: Types.UPDATE_USER_REQUEST,
  payload: { userId, fullName, email, userName, password, roleId, phone, image },
});

export const updateUserSuccess = (user) => ({
  type: Types.UPDATE_USER_SUCCESS,
  payload: user,
});

// Delete
export const deleteUserRequest = (userId) => ({
  type: Types.DELETE_USER_REQUEST,
  payload: { userId },
});

export const deleteUserSuccess = (userId) => ({
  type: Types.DELETE_USER_SUCCESS,
  payload: { userId },
});

// Search (dùng lại API getUsersPage)
export const searchUsersRequest = ({ page = 1, pageSize = 10, name = "", phone = "" }) => ({
  type: Types.SEARCH_USERS_REQUEST,
  payload: { page, pageSize, name, phone },
});

export const searchUsersSuccess = ({ items, page, pageSize, total, totalPages }) => ({
  type: Types.SEARCH_USERS_SUCCESS,
  payload: { items, page, pageSize, total, totalPages },
});

// Error chung
export const usersError = (error) => ({
  type: Types.USERS_ERROR,
  payload: { error },
});

