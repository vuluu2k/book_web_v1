import {
  LOAD_LIST_PRODUCT,
  LOAD_LIST_PRODUCT_SUCCESS,
  LOAD_LIST_PRODUCT_ERROR,
  CREATE_PRODUCT,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_ERROR,
  EDIT_PRODUCT,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_ERROR,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_ERROR,
  LOAD_LIST_PRODUCT_HOME,
  LOAD_LIST_PRODUCT_HOME_SUCCESS,
  LOAD_LIST_PRODUCT_HOME_ERROR,
  GET_ITEM_PRODUCT,
  GET_ITEM_PRODUCT_SUCCESS,
  GET_ITEM_PRODUCT_ERROR,
} from 'constants/product';

import { handleRequest, handleSuccess, handleError } from 'utils/handleReducer';
import update from 'immutability-helper';
import { converObjToCamelKeys } from 'utils';

const initialState = {
  productInfomation: {
    success: false,
    message: '',
    requesting: true,
    products: [],
    page_size: 0,
    page_number: 0,
    page_entries: 0,
    page_totals: 0,
    dataSearch: {},
  },
  productInfomationHome: {
    success: false,
    message: '',
    hot: [],
    mobile: [],
    laptop: [],
    watch: [],
    tablet: [],
    accessory: [],
  },

  productStatusDel: {
    success: false,
    message: '',
  },
  productStatusCreate: {
    success: false,
    message: '',
  },
  productStatusEdit: {
    success: false,
    message: '',
  },

  productItem: {
    item: undefined,
    success: false,
    message: '',
  },
};

const handleDelete = (state, payload) => {
  const { id } = payload;
  const listCurrent = state.productInfomation.products;
  const listFilter = listCurrent.filter(item => item._id !== id);
  return update(state, {
    productInfomation: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
      products: { $set: listFilter },
    },
  });
};

const handleEdit = (state, payload) => {
  const { id, product } = payload;
  const listCurrent = state.productInfomation.products;
  const listAfterEdit = listCurrent.map(item => {
    if (item._id === id) {
      return product;
    }
    return item;
  });

  return update(state, {
    productInfomation: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
      products: { $set: listAfterEdit },
    },
  });
};

const handleCreate = (state, payload) => {
  const { product } = payload;
  const listCurrent = state.productInfomation.products;
  return update(state, {
    productInfomation: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
      products: { $set: [product].concat(listCurrent) },
    },
  });
};

const productReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case LOAD_LIST_PRODUCT:
      return handleRequest(state, 'productInfomation', payload);
    case LOAD_LIST_PRODUCT_SUCCESS:
      return update(state, {
        productInfomation: {
          requesting: { $set: false },
          success: { $set: true },
          message: { $set: 'Lấy sản phẩm thành công' },
          products: { $set: (payload.search && []) || payload.products },
        },
      });
    case LOAD_LIST_PRODUCT_ERROR:
      return handleError(state, 'productInfomation', payload.message);

    case LOAD_LIST_PRODUCT_HOME:
      return handleRequest(state, 'productInfomationHome', payload);
    case LOAD_LIST_PRODUCT_HOME_SUCCESS:
      return handleSuccess(state, 'productInfomationHome', payload);
    case LOAD_LIST_PRODUCT_HOME_ERROR:
      return handleError(state, 'productInfomationHome', payload.message);

    case CREATE_PRODUCT:
      return handleRequest(state, 'productInfomation', payload);
    case CREATE_PRODUCT_SUCCESS:
      return handleCreate(state, payload);
    case CREATE_PRODUCT_ERROR:
      return handleError(state, 'productInfomation', payload.message);

    case EDIT_PRODUCT:
      return handleRequest(state, 'productInfomation');
    case EDIT_PRODUCT_SUCCESS:
      return handleEdit(state, payload);
    case EDIT_PRODUCT_ERROR:
      return handleError(state, 'productInfomation', payload.message);

    case DELETE_PRODUCT:
      return handleRequest(state, 'productInfomation');
    case DELETE_PRODUCT_SUCCESS:
      return handleDelete(state, payload);
    case DELETE_PRODUCT_ERROR:
      return handleError(state, 'productInfomation', payload.message);

    case GET_ITEM_PRODUCT:
      return handleRequest(state, 'productItem');
    case GET_ITEM_PRODUCT_SUCCESS:
      return update(state, {
        productItem: {
          requesting: { $set: false },
          success: { $set: true },
          message: { $set: 'Lấy sản phẩm thành công' },
          item: { $set: payload.products[0] },
        },
      });
    case GET_ITEM_PRODUCT_ERROR:
      return handleError(state, 'productItem', payload.message);

    default:
      return state;
  }
};

export default productReducer;
