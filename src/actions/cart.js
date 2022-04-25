import {
  INIT_CART,
  CHANGE_CART,
  GET_CART,
  ADD_ITEM_CART,
  EDIT_ITEM_CART,
  DELETE_ITEM_CART,
  SHOW_CART,
  HIDDEN_CART,
  CLEAR_CART,
} from 'constants/cart';

function initCart(payload) {
  return {
    type: INIT_CART,
    payload,
  };
}

function changeCart(payload) {
  return {
    type: CHANGE_CART,
    payload,
  };
}

function getCart(payload) {
  return {
    type: GET_CART,
    payload,
  };
}

function addCart(payload) {
  return {
    type: ADD_ITEM_CART,
    payload,
  };
}

function editCart(payload) {
  return {
    type: EDIT_ITEM_CART,
    payload,
  };
}

function deleteCart(payload) {
  return {
    type: DELETE_ITEM_CART,
    payload,
  };
}

function showCart(payload) {
  return {
    type: SHOW_CART,
    payload,
  };
}

function hiddenCart(payload) {
  return {
    type: HIDDEN_CART,
    payload,
  };
}

function clearCart(payload) {
  return {
    type: CLEAR_CART,
    payload,
  };
}

const cartActions = { initCart, changeCart, getCart, addCart, editCart, deleteCart, showCart, hiddenCart, clearCart };

export default cartActions;
