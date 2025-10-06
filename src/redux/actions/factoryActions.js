export const createActions = (tableName) => {
  const UPPER = tableName.toUpperCase();

  const types = {
    // GET ALL
    FETCH_ALL_REQUEST: `FETCH_${UPPER}_ALL_REQUEST`,
    FETCH_ALL_SUCCESS: `FETCH_${UPPER}_ALL_SUCCESS`,
    FETCH_ALL_FAILURE: `FETCH_${UPPER}_ALL_FAILURE`,

    // GET ONE
    FETCH_ONE_REQUEST: `FETCH_${UPPER}_ONE_REQUEST`,
    FETCH_ONE_SUCCESS: `FETCH_${UPPER}_ONE_SUCCESS`,
    FETCH_ONE_FAILURE: `FETCH_${UPPER}_ONE_FAILURE`,

    // DELETE
    DELETE_REQUEST: `DELETE_${UPPER}_REQUEST`,
    DELETE_SUCCESS: `DELETE_${UPPER}_SUCCESS`,
    DELETE_FAILURE: `DELETE_${UPPER}_FAILURE`,

    // CREATE
    CREATE_REQUEST: `CREATE_${UPPER}_REQUEST`,
    CREATE_SUCCESS: `CREATE_${UPPER}_SUCCESS`,
    CREATE_FAILURE: `CREATE_${UPPER}_FAILURE`,

    // UPDATE
    UPDATE_REQUEST: `UPDATE_${UPPER}_REQUEST`,
    UPDATE_SUCCESS: `UPDATE_${UPPER}_SUCCESS`,
    UPDATE_FAILURE: `UPDATE_${UPPER}_FAILURE`,
  };

  const creators = {
    // GET ALL
    fetchAllRequest: (callback) => ({ type: types.FETCH_ALL_REQUEST, callback }),
    fetchAllSuccess: (data) => ({ type: types.FETCH_ALL_SUCCESS, payload: data }),
    fetchAllFailure: (error) => ({ type: types.FETCH_ALL_FAILURE, payload: error }),

    // GET ONE
    fetchOneRequest: (id, callback) => ({ type: types.FETCH_ONE_REQUEST, payload: id, callback }),
    fetchOneSuccess: (data) => ({ type: types.FETCH_ONE_SUCCESS, payload: data }),
    fetchOneFailure: (error) => ({ type: types.FETCH_ONE_FAILURE, payload: error }),

    // DELETE
    deleteRequest: (id, callback) => ({ type: types.DELETE_REQUEST, payload: id, callback }),
    deleteSuccess: (id) => ({ type: types.DELETE_SUCCESS, payload: id }),
    deleteFailure: (error) => ({ type: types.DELETE_FAILURE, payload: error }),

    // CREATE
    createRequest: (data, callback) => ({ type: types.CREATE_REQUEST, payload: data, callback }),
    createSuccess: (data) => ({ type: types.CREATE_SUCCESS, payload: data }),
    createFailure: (error) => ({ type: types.CREATE_FAILURE, payload: error }),

    // UPDATE
    updateRequest: (id, data, callback) => ({
      type: types.UPDATE_REQUEST,
      payload: { id, data },
      callback,
    }),
    updateSuccess: (data) => ({ type: types.UPDATE_SUCCESS, payload: data }),
    updateFailure: (error) => ({ type: types.UPDATE_FAILURE, payload: error }),
  };

  return { types, creators };
};
