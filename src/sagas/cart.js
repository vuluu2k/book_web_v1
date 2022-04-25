import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { message } from 'antd';

import {
  INIT_CART,
  INIT_CART_SUCCESS,
  INIT_CART_ERROR,
  CHANGE_CART,
  CHANGE_CART_SUCCESS,
  CHANGE_CART_ERROR,
  GET_CART,
  // GET_CART_SUCCESS,
  // GET_CART_ERROR,
  ADD_ITEM_CART,
  // ADD_ITEM_CART_SUCCESS,
  // ADD_ITEM_CART_ERROR,
  EDIT_ITEM_CART,
  DELETE_ITEM_CART,
  CLEAR_CART,
} from 'constants/cart';
import { LOCAL_CART } from 'constants';
import { API_URL } from 'env_config';

let cart = [];
let quantity = 1;

export default [cartSagas];

function* startRequest(payload) {
  switch (payload.type) {
    case INIT_CART:
      yield call(initCart, payload);
      break;
    case CHANGE_CART:
      yield call(changeCart, payload);
      break;
    case ADD_ITEM_CART:
      yield call(addCart, payload);
      break;
    case EDIT_ITEM_CART:
      yield call(editCart, payload);
      break;
    case DELETE_ITEM_CART:
      yield call(deleteCart, payload);
      break;
    case CLEAR_CART:
      yield call(clearCart, payload);
      break;
    default:
      break;
  }
}

function* initCart({ payload }) {
  const { user_id } = payload;
  const url = `${API_URL}/cart/init`;
  const body = {
    user_id,
  };
  try {
    const response = yield call(axios.post, url, body);
    const cart = response.data.cart[0].products;
    if (!response.data.success) {
      yield put({ typ: INIT_CART_ERROR, ...response.data });
    } else {
      yield put({ type: INIT_CART_SUCCESS, ...response.data, cart });
      localStorage.setItem(LOCAL_CART, JSON.stringify(cart));
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: INIT_CART_ERROR, error: error });
    return error;
  }
}

function* changeCart({ payload }) {
  const { user_id, products } = payload;

  const url = `${API_URL}/cart/change`;
  const body = {
    user_id: user_id,
    products: products,
  };
  try {
    const response = yield call(axios.patch, url, body);
    if (!response.data.success) {
      yield put({ type: CHANGE_CART_ERROR, ...response.data });
    } else {
      yield put({ type: CHANGE_CART_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: CHANGE_CART_ERROR, error: error });
    return error;
  }
}

function* addCart({ payload }) {
  const { product_id, name, name_option, value_option, image_link, user_id } = payload;
  if (!user_id) return message.warning('Bạn chưa đăng nhập');

  let storage = localStorage.getItem(LOCAL_CART);
  if (storage) {
    cart = JSON.parse(storage);
  }
  let item = cart.find(c => c.product_id === product_id && c.name_option === name_option);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ product_id, name, name_option, value_option, quantity, image_link });
  }
  localStorage.setItem(LOCAL_CART, JSON.stringify(cart));
  const url = `${API_URL}/cart/change`;
  const body = {
    user_id: user_id,
    products: cart,
  };
  try {
    const response = yield call(axios.patch, url, body);
    if (!response.data.success) {
      yield put({ type: CHANGE_CART_ERROR, ...response.data });
    } else {
      yield put({ type: CHANGE_CART_SUCCESS, ...response.data, cart });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: CHANGE_CART_ERROR, error: error });
    return error;
  }
}

function* editCart({ payload }) {
  const { product_id, name_option, quantity, user_id } = payload;
  if (!user_id) return message.warning('Bạn chưa đăng nhập');

  let storage = localStorage.getItem(LOCAL_CART);
  if (storage) {
    cart = JSON.parse(storage);
  }
  let item = cart.find(c => c.product_id === product_id && c.name_option === name_option);
  if (item) {
    item.quantity = quantity;
  }
  localStorage.setItem(LOCAL_CART, JSON.stringify(cart));
  const url = `${API_URL}/cart/change`;
  const body = {
    user_id: user_id,
    products: cart,
  };
  try {
    const response = yield call(axios.patch, url, body);
    if (!response.data.success) {
      yield put({ type: CHANGE_CART_ERROR, ...response.data });
    } else {
      yield put({ type: CHANGE_CART_SUCCESS, ...response.data, cart });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: CHANGE_CART_ERROR, error: error });
    return error;
  }
}

function* deleteCart({ payload }) {
  const { product_id, name_option, user_id } = payload;

  if (!user_id) return message.warning('Bạn chưa đăng nhập');
  let storage = localStorage.getItem(LOCAL_CART);
  if (storage) {
    cart = JSON.parse(storage);
  }
  let delCart = cart.filter(c => c.product_id !== product_id && c.name_option !== name_option);
  if (delCart !== cart) {
    localStorage.setItem(LOCAL_CART, JSON.stringify(delCart));
    const url = `${API_URL}/cart/change`;
    const body = {
      user_id: user_id,
      products: delCart,
    };
    try {
      const response = yield call(axios.patch, url, body);
      if (!response.data.success) {
        yield put({ type: CHANGE_CART_ERROR, ...response.data });
      } else {
        yield put({ type: CHANGE_CART_SUCCESS, ...response.data, cart: delCart });
      }
      return response.data;
    } catch (error) {
      console.log(error);
      yield put({ type: CHANGE_CART_ERROR, error: error });
      return error;
    }
  } else if (delCart.length < 0) {
    localStorage.removeItem(LOCAL_CART);
  }
}

function* clearCart({ payload }) {
  const { user_id } = payload;
  localStorage.removeItem(LOCAL_CART);
  const url = `${API_URL}/cart/change`;
  const body = {
    user_id: user_id,
    products: [],
  };
  try {
    const response = yield call(axios.patch, url, body);
    if (!response.data.success) {
      yield put({ type: CHANGE_CART_ERROR, ...response.data });
    } else {
      yield put({ type: CHANGE_CART_SUCCESS, ...response.data, cart: [] });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: CHANGE_CART_ERROR, error: error });
    return error;
  }
}

export function* cartSagas() {
  yield takeLatest([GET_CART, INIT_CART, CHANGE_CART, ADD_ITEM_CART, EDIT_ITEM_CART, DELETE_ITEM_CART, CLEAR_CART], startRequest);
}
