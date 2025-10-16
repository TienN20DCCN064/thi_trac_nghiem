import { createAction } from 'redux-actions';

export const fetchAllRequest = createAction('FETCH_ALL_REQUEST');
export const fetchAllSuccess = createAction('FETCH_ALL_SUCCESS');
export const fetchAllFailure = createAction('FETCH_ALL_FAILURE');

export const createRegistrationRequest = createAction('CREATE_REGISTRATION_REQUEST');
export const createRegistrationSuccess = createAction('CREATE_REGISTRATION_SUCCESS');
export const createRegistrationFailure = createAction('CREATE_REGISTRATION_FAILURE');

export const updateRegistrationRequest = createAction('UPDATE_REGISTRATION_REQUEST');
export const updateRegistrationSuccess = createAction('UPDATE_REGISTRATION_SUCCESS');
export const updateRegistrationFailure = createAction('UPDATE_REGISTRATION_FAILURE');

export const deleteRegistrationRequest = createAction('DELETE_REGISTRATION_REQUEST');
export const deleteRegistrationSuccess = createAction('DELETE_REGISTRATION_SUCCESS');
export const deleteRegistrationFailure = createAction('DELETE_REGISTRATION_FAILURE');