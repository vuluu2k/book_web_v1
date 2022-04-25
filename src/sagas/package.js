import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
  LOAD_LIST_PACKAGE,
  LOAD_LIST_PACKAGE_SUCCESS,
  LOAD_LIST_PACKAGE_ERROR,
  CREATE_PACKAGE,
  CREATE_PACKAGE_SUCCESS,
  CREATE_PACKAGE_ERROR,
  CHECK_PACKAGE,
  CHECK_PACKAGE_SUCCESS,
  CHECK_PACKAGE_ERROR,
  ACCEPT_PACKAGE,
  ACCEPT_PACKAGE_SUCCESS,
  ACCEPT_PACKAGE_ERROR,
  // EDIT_PACKAGE,
  // EDIT_PACKAGE_SUCCESS,
  // EDIT_PACKAGE_ERROR,
  DELETE_PACKAGE,
  DELETE_PACKAGE_SUCCESS,
  DELETE_PACKAGE_ERROR,
  GET_TURNOVER,
  GET_TURNOVER_SUCCESS,
  GET_TURNOVER_ERROR,
} from 'constants/package';

import { API_URL } from 'env_config';
import { message as messageAntd } from 'antd';

export default [packageSagas];

function* startRequest(payload) {
  switch (payload.type) {
    case LOAD_LIST_PACKAGE:
      yield call(loadList, payload);
      break;
    case CHECK_PACKAGE:
      yield call(checkPackage, payload);
      break;
    case CREATE_PACKAGE:
      yield call(createPackage, payload);
      break;
    case ACCEPT_PACKAGE:
      yield call(acceptPackage, payload);
      break;
    case GET_TURNOVER:
      yield call(getTurnover, payload);
      break;
    case DELETE_PACKAGE:
      yield call(deletePackage, payload);
      break;
    default:
      break;
  }
}

function* loadList({ payload }) {
  const { isAccess = ' ' } = payload;
  const url = `${API_URL}/package/view_package?isAccess=${isAccess}`;

  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ typ: LOAD_LIST_PACKAGE_ERROR, ...response.data });
    } else {
      yield put({ type: LOAD_LIST_PACKAGE_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: LOAD_LIST_PACKAGE_ERROR, message: error });
    return error;
  }
}

function* checkPackage({ payload }) {
  const { code_package, phone_number } = payload;

  const url = `${API_URL}/package/check_package?code_package=${code_package}&phone_number=${phone_number}`;

  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ typ: CHECK_PACKAGE_ERROR, ...response.data });
      messageAntd.error(response.data.message || 'Thông tin bạn nhập không chính xác');
    } else {
      yield put({ type: CHECK_PACKAGE_SUCCESS, ...response.data });
      messageAntd.success('Tìm thấy đơn hàng của bạn');
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: CHECK_PACKAGE_ERROR, message: error });
    return error;
  }
}

function* createPackage({ payload }) {
  const { user_id, products, full_name, phone_number, email, voucher, value, address, is_access, note, is_pay } = payload;
  const url = `${API_URL}/package/create_package`;
  const body = {
    user_id,
    products,
    full_name,
    phone_number,
    email,
    voucher,
    value,
    address,
    is_access,
    note,
    is_pay,
  };

  try {
    const response = yield call(axios.post, url, body);

    if (!response.data.success) {
      yield put({ typ: CREATE_PACKAGE_ERROR, ...response.data });
    } else {
      yield put({ type: CREATE_PACKAGE_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: CREATE_PACKAGE_ERROR, message: error });
    return error;
  }
}

function* acceptPackage({ payload }) {
  const { package_id } = payload;
  const url = `${API_URL}/package/accept_package`;
  const body = {
    package_id,
  };
  try {
    const response = yield call(axios.post, url, body);

    if (!response.data.success) {
      yield put({ typ: ACCEPT_PACKAGE_ERROR, ...response.data });
      messageAntd.error(response.data.message);
    } else {
      yield put({ type: ACCEPT_PACKAGE_SUCCESS, ...response.data });
      messageAntd.success(response.data.message);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: ACCEPT_PACKAGE_ERROR, message: error });
    return error;
  }
}

function* deletePackage({ payload }) {
  const { id } = payload;
  const url = `${API_URL}/package/delete_package/${id}`;
  try {
    const response = yield call(axios.delete, url);
    if (!response.data.success) {
      yield put({ type: DELETE_PACKAGE_ERROR, ...response.data });
    } else {
      yield put({ type: DELETE_PACKAGE_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: DELETE_PACKAGE_ERROR, error: error });
    return error;
  }
}

function* getTurnover({ payload }) {
  const { startDate, endDate } = payload;
  const url = `${API_URL}/package/view_turnover?startDate=${startDate}&endDate=${endDate}`;
  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ type: GET_TURNOVER_ERROR, ...response.data });
    } else {
      yield put({ type: GET_TURNOVER_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: GET_TURNOVER_ERROR, error: error });
    return error;
  }
}

export function* packageSagas() {
  yield takeLatest([LOAD_LIST_PACKAGE, CREATE_PACKAGE, CHECK_PACKAGE, ACCEPT_PACKAGE, DELETE_PACKAGE, GET_TURNOVER], startRequest);
}
