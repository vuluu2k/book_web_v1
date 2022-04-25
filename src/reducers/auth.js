import {
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOAD_USER,
  LOAD_USER_SUCCESS,
  LOAD_USER_ERROR,
  LOAD_LIST_USER,
  LOAD_LIST_USER_SUCCESS,
  LOAD_LIST_USER_ERROR,
  LOGOUT,
  EDIT_USER,
  EDIT_USER_SUCCESS,
  EDIT_USER_ERROR,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
} from 'constants/auth';
import update from 'immutability-helper';
import { handleRequest, handleSuccess, handleError } from 'utils/handleReducer';
import { converObjToCamelKeys } from 'utils';

const initialState = {
  statusRegister: {
    message: '',
    success: false,
    requesting: true,
    user: undefined,
  },
  statusLogin: {
    message: '',
    success: false,
    accessToken: '',
    requesting: true,
  },
  auth: {
    requesting: true,
    isAuthenticated: false,
    user: {},
  },
  list_auth: {
    message: '',
    success: false,
    requesting: true,
    auths: [],
  },
};

const handleDelete = (state, payload) => {
  const { user } = payload;
  const listCurrent = state.list_auth.auths;
  const listFilter = listCurrent.filter(item => item._id !== user._id);

  return update(state, {
    list_auth: {
      requesting: { $set: false },
      success: { $set: true },
      auths: { $set: listFilter },
      $merge: converObjToCamelKeys(payload),
    },
  });
};

const authReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case REGISTER:
      return handleRequest(state, 'statusRegister', payload);

    case REGISTER_SUCCESS:
      return handleSuccess(state, 'statusRegister', payload);

    case REGISTER_ERROR:
      return handleError(state, 'statusRegister', payload.message);

    case LOGIN:
      return handleRequest(state, 'statusLogin', payload);
    case LOGIN_SUCCESS:
      return handleSuccess(state, 'statusLogin', payload);
    case LOGIN_ERROR:
      return handleError(state, 'statusLogin', payload.message);

    case LOGOUT:
      return update(state, {
        auth: {
          requesting: { $set: true },
          isAuthenticated: { $set: false },
          user: { $set: null },
        },
      });

    case LOAD_USER:
      return handleRequest(state, 'auth', payload);
    case LOAD_USER_SUCCESS:
      return handleSuccess(state, 'auth', payload);
    case LOAD_USER_ERROR:
      return handleError(state, 'auth', payload.message);

    case LOAD_LIST_USER:
      return handleRequest(state, 'list_auth', payload);
    case LOAD_LIST_USER_SUCCESS:
      return handleSuccess(state, 'list_auth', payload);
    case LOAD_LIST_USER_ERROR:
      return handleError(state, 'list_auth', payload.message);

    case EDIT_USER:
      return handleRequest(state, 'auth', payload);
    case EDIT_USER_SUCCESS:
      return handleSuccess(state, 'auth', payload);
    case EDIT_USER_ERROR:
      return handleError(state, 'auth', payload.message);

    case DELETE_USER:
      return handleRequest(state, 'list_auth', payload);
    case DELETE_USER_SUCCESS:
      return handleDelete(state, payload);
    case DELETE_USER_ERROR:
      return handleError(state, 'list_auth', payload.message);

    default:
      return state;
  }
};

export default authReducer;
