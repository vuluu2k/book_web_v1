import { LOAD_LIST_PRODUCT, LOAD_LIST_PRODUCT_HOME, CREATE_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT, GET_ITEM_PRODUCT } from 'constants/product';

function loadListProduct(payload) {
  return {
    type: LOAD_LIST_PRODUCT,
    payload,
  };
}

function loadListProductHome(payload) {
  return {
    type: LOAD_LIST_PRODUCT_HOME,
    payload,
  };
}

function createProduct(payload) {
  return {
    type: CREATE_PRODUCT,
    payload,
  };
}

function editProduct(payload) {
  return {
    type: EDIT_PRODUCT,
    payload,
  };
}

function deleteProduct(payload) {
  return {
    type: DELETE_PRODUCT,
    payload,
  };
}

function getProductItem(payload) {
  return {
    type: GET_ITEM_PRODUCT,
    payload,
  };
}

const productActions = { loadListProduct, createProduct, editProduct, deleteProduct, loadListProductHome, getProductItem };

export default productActions;
