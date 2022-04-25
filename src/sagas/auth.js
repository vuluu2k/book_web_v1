import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
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
import { setToken } from 'utils/token';
import { LOCAL_STORAGE_TOKEN_NAME, USER, LOCAL_CART } from 'constants';
import { API_URL } from 'env_config';

export default [authSagas];

function* startRequest(payload) {
  switch (payload.type) {
    case REGISTER:
      yield call(register, payload);
      break;
    case LOGIN:
      yield call(login, payload);
      yield call(loadUser, payload);
      break;
    case LOAD_USER:
      yield call(loadUser, payload);
      break;
    case LOAD_LIST_USER:
      yield call(loadListUser, payload);
      break;
    case EDIT_USER:
      yield call(editUser, payload);
      break;
    case DELETE_USER:
      yield call(deleteUser, payload);
      break;
    case LOGOUT:
      yield call(logout);
      break;
    default:
      break;
  }
}

function* register({ payload }) {
  const { username, email, password, phone_number, full_name } = payload;

  const url = `${API_URL}/auth/register`;
  const body = {
    name: username,
    email: email,
    password: password,
    phone_number: phone_number,
    full_name: full_name,
  };

  try {
    const response = yield axios.post(url, body);

    if (!response.data.success) {
      yield put({ type: REGISTER_ERROR, ...response.data });
    }
    yield put({ type: REGISTER_SUCCESS, ...response.data });
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: REGISTER_ERROR, error: error });
    return error;
  }
}

function* login({ payload }) {
  const { username, password } = payload;

  const url = `${API_URL}/auth/login`;
  const body = { name: username, password: password };
  try {
    const response = yield call(axios.post, url, body);
    if (!response.data.success) {
      yield put({ type: LOGIN_ERROR, ...response.data });
    } else {
      yield put({ type: LOGIN_SUCCESS, ...response.data });
      localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: LOGIN_ERROR, error: error });
    return error;
  }
}

function* logout() {
  localStorage.removeItem(LOCAL_CART);
  localStorage.removeItem(USER);
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
  window.location.pathname = '/login';
}

function* loadUser() {
  if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
    setToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
  }
  const url = `${API_URL}/auth`;
  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ type: LOAD_USER_ERROR, ...response.data, isAuthenticated: false });
    } else {
      yield put({ type: LOAD_USER_SUCCESS, ...response.data, isAuthenticated: true });
    }
    localStorage.setItem(USER, JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    setToken(null);
    console.log(error);
    yield put({ type: LOAD_USER_ERROR, error: error, isAuthenticated: false });
    return error;
  }
}

function* loadListUser({ payload }) {
  const { name, email, phone_number } = payload;
  const url = `${API_URL}/auth/view_auth?name=${name}&email=${email || ''}&phone_number=${phone_number || ''}`;
  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ type: LOAD_LIST_USER_ERROR, ...response.data });
    } else {
      yield put({ type: LOAD_LIST_USER_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: LOAD_LIST_USER_ERROR, error: error });
    return error;
  }
}

function* editUser({ payload }) {
  const { user_id, email, role, role_name, phone_number, full_name, password, new_password, change_password } = payload;
  const url = `${API_URL}/auth/edit_auth`;
  const body = { user_id, email, role, role_name, phone_number, full_name, password, new_password, change_password };
  try {
    const response = yield call(axios.patch, url, body);
    if (!response.data.success) {
      yield put({ type: EDIT_USER_ERROR, ...response.data });
    } else {
      yield put({ type: EDIT_USER_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: EDIT_USER_ERROR, error: error });
    return error;
  }
}

function* deleteUser({ payload }) {
  const { id } = payload;
  const url = `${API_URL}/auth/delete_auth/${id}`;
  try {
    const response = yield call(axios.delete, url);
    if (!response.data.success) {
      yield put({ type: DELETE_USER_ERROR, ...response.data });
    } else {
      yield put({ type: DELETE_USER_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: DELETE_USER_ERROR, error: error });
    return error;
  }
}

export function* authSagas() {
  yield takeLatest([REGISTER, LOGIN, LOAD_USER, LOAD_LIST_USER, LOGOUT, EDIT_USER, DELETE_USER], startRequest);
}
