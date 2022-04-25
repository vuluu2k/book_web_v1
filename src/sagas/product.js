import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
  LOAD_LIST_PRODUCT,
  LOAD_LIST_PRODUCT_SUCCESS,
  LOAD_LIST_PRODUCT_ERROR,
  LOAD_LIST_PRODUCT_HOME,
  LOAD_LIST_PRODUCT_HOME_SUCCESS,
  LOAD_LIST_PRODUCT_HOME_ERROR,
  CREATE_PRODUCT,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_ERROR,
  EDIT_PRODUCT,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_ERROR,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_ERROR,
  GET_ITEM_PRODUCT,
  GET_ITEM_PRODUCT_SUCCESS,
  GET_ITEM_PRODUCT_ERROR,
} from 'constants/product';

import { API_URL } from 'env_config';

export default [productSagas];

function* startRequest(payload) {
  switch (payload.type) {
    case LOAD_LIST_PRODUCT:
      yield call(loadList, payload);
      break;
    case LOAD_LIST_PRODUCT_HOME:
      yield call(loadListHome);
      break;
    case CREATE_PRODUCT:
      yield call(createProduct, payload);
      break;
    case EDIT_PRODUCT:
      yield call(editProduct, payload);
      break;
    case DELETE_PRODUCT:
      yield call(deleteProduct, payload);
      break;
    case GET_ITEM_PRODUCT:
      yield call(getItem, payload);
      break;
    default:
      break;
  }
}

function* loadList({ payload }) {
  const { product_id, name, value, status, category, sub_category, page_number = 1, page_size = 10, search } = payload;
  const queryParams = `?product_id=${product_id}&name=${name}&value=${value}&status=${status}&category=${category}&sub_category=${sub_category}&page_number=${page_number}&page_size=${page_size}`;

  const url = `${API_URL}/product/view${queryParams}`;

  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ typ: LOAD_LIST_PRODUCT_ERROR, ...response.data });
    } else {
      yield put({ type: LOAD_LIST_PRODUCT_SUCCESS, ...response.data, search });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: LOAD_LIST_PRODUCT_ERROR, error: error });
    return error;
  }
}

function* loadListHome() {
  const url = `${API_URL}/product/view_home`;

  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ typ: LOAD_LIST_PRODUCT_HOME_ERROR, ...response.data });
    } else {
      yield put({ type: LOAD_LIST_PRODUCT_HOME_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: LOAD_LIST_PRODUCT_HOME_ERROR, error: error });
    return error;
  }
}

function* createProduct({ payload }) {
  const { name, value, image, status, quantity, category, sub_category, options, profile, description } = payload;
  const url = `${API_URL}/product/create`;
  const body = {
    name,
    value,
    image,
    status,
    quantity,
    category,
    sub_category,
    options,
    profile,
    description,
  };
  try {
    const response = yield call(axios.post, url, body);
    if (!response.data.success) {
      yield put({ typ: CREATE_PRODUCT_ERROR, ...response.data });
    } else {
      yield put({ type: CREATE_PRODUCT_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: CREATE_PRODUCT_ERROR, error: error });
    return error;
  }
}

function* editProduct({ payload }) {
  const { id, name, value, image, status, quantity, category, sub_category, options, profile, description } = payload;

  const url = `${API_URL}/product/edit`;
  const body = {
    product_id: id,
    name,
    value,
    image,
    status,
    quantity,
    category,
    sub_category,
    options,
    profile,
    description,
  };
  try {
    const response = yield call(axios.patch, url, body);
    if (!response.data.success) {
      yield put({ type: EDIT_PRODUCT_ERROR, ...response.data });
    } else {
      yield put({ type: EDIT_PRODUCT_SUCCESS, ...response.data, id });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: EDIT_PRODUCT_ERROR, error: error });
    return error;
  }
}

function* deleteProduct({ payload }) {
  const { id } = payload;
  const url = `${API_URL}/product/delete/${id}`;
  try {
    const response = yield call(axios.delete, url);
    if (!response.data.success) {
      yield put({ type: DELETE_PRODUCT_ERROR, ...response.data });
    } else {
      yield put({ type: DELETE_PRODUCT_SUCCESS, ...response.data, id });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: DELETE_PRODUCT_ERROR, error: error });
    return error;
  }
}

function* getItem({ payload }) {
  const { product_id } = payload;
  const url = `${API_URL}/product/view?product_id=${product_id}`;

  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ typ: GET_ITEM_PRODUCT_ERROR, ...response.data });
    } else {
      yield put({ type: GET_ITEM_PRODUCT_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: GET_ITEM_PRODUCT_ERROR, error: error });
    return error;
  }
}

export function* productSagas() {
  yield takeLatest([LOAD_LIST_PRODUCT, LOAD_LIST_PRODUCT_HOME, CREATE_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT, GET_ITEM_PRODUCT], startRequest);
}
