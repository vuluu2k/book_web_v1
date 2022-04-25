import {
  INIT_CART,
  INIT_CART_SUCCESS,
  INIT_CART_ERROR,
  CHANGE_CART,
  CHANGE_CART_SUCCESS,
  CHANGE_CART_ERROR,
  SHOW_CART,
  HIDDEN_CART,
  ADD_ITEM_CART,
  // ADD_ITEM_CART_SUCCESS,
  // ADD_ITEM_CART_ERROR,
  EDIT_ITEM_CART,
  DELETE_ITEM_CART,
} from 'constants/cart';

import { handleRequest, handleSuccess, handleError } from 'utils/handleReducer';
import update from 'immutability-helper';
import { converObjToCamelKeys } from 'utils';

const initialState = {
  cartInfomation: {
    success: false,
    message: '',
    products: [],
  },
  visibleCart: false,
};

const handleChange = (state, payload) => {
  return update(state, {
    cartInfomation: {
      requesting: { $set: false },
      success: { $set: true },
      products: { $set: payload.cart },
    },
  });
};

const categoryReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case INIT_CART:
      return handleRequest(state, 'cartInfomation', payload);
    case INIT_CART_SUCCESS:
      return handleChange(state, payload);
    case INIT_CART_ERROR:
      return handleError(state, 'cartInfomation', payload.message);

    case CHANGE_CART:
      return handleRequest(state, 'cartInfomation', payload);
    case CHANGE_CART_SUCCESS:
      return handleChange(state, payload);
    case CHANGE_CART_ERROR:
      return handleError(state, 'cartInfomation', payload.message);

    case SHOW_CART:
      return update(state, {
        visibleCart: { $set: true },
      });
    case HIDDEN_CART:
      return update(state, {
        visibleCart: { $set: false },
      });

    default:
      return state;
  }
};

export default categoryReducer;
