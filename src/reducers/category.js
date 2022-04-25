import {
  LOAD_LIST_CATEGORY,
  LOAD_LIST_CATEGORY_SUCCESS,
  LOAD_LIST_CATEGORY_ERROR,
  CREATE_CATEGORY,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_ERROR,
  EDIT_CATEGORY,
  EDIT_CATEGORY_SUCCESS,
  EDIT_CATEGORY_ERROR,
  DELETE_CATEGORY,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_ERROR,
} from 'constants/category';

import { handleRequest, handleSuccess, handleError } from 'utils/handleReducer';
import update from 'immutability-helper';
import { converObjToCamelKeys } from 'utils';

const initialState = {
  categoryInfomation: {
    success: false,
    message: '',
    categorys: [],
  },
  categoryStatusDel: {
    success: false,
    message: '',
  },
  categoryStatusCreate: {
    success: false,
    message: '',
  },
  categoryStatusEdit: {
    success: false,
    message: '',
  },
};

const handleDelete = (state, payload) => {
  const { id } = payload;
  const listCurrent = state.categoryInfomation.categorys;
  const listFilter = listCurrent.filter(item => item._id !== id);
  return update(state, {
    categoryStatusDel: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
    },
    categoryInfomation: {
      categorys: { $set: listFilter },
    },
  });
};

const handleEdit = (state, payload) => {
  const { id, category } = payload;
  const listCurrent = state.categoryInfomation.categorys;
  const listAfterEdit = listCurrent.map(item => {
    if (item._id === id) {
      return category;
    }
    return item;
  });

  return update(state, {
    categoryStatusDel: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
    },
    categoryInfomation: {
      categorys: { $set: listAfterEdit },
    },
  });
};

const handleCreate = (state, payload) => {
  const { category } = payload;
  const listCurrent = state.categoryInfomation.categorys;
  return update(state, {
    categoryStatusDel: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
    },
    categoryInfomation: {
      categorys: { $set: listCurrent.concat(category) },
    },
  });
};

const categoryReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case LOAD_LIST_CATEGORY:
      return handleRequest(state, 'categoryInfomation', payload);
    case LOAD_LIST_CATEGORY_SUCCESS:
      return handleSuccess(state, 'categoryInfomation', payload);
    case LOAD_LIST_CATEGORY_ERROR:
      return handleError(state, 'categoryInfomation', payload.message);

    case CREATE_CATEGORY:
      return handleRequest(state, 'categoryStatusCreate', payload);
    case CREATE_CATEGORY_SUCCESS:
      return handleCreate(state, payload);
    case CREATE_CATEGORY_ERROR:
      return handleError(state, 'categoryStatusCreate', payload.message);

    case EDIT_CATEGORY:
      return handleRequest(state, 'categoryStatusEdit');
    case EDIT_CATEGORY_SUCCESS:
      return handleEdit(state, payload);
    case EDIT_CATEGORY_ERROR:
      return handleError(state, 'categoryStatusEdit', payload.message);

    case DELETE_CATEGORY:
      return handleRequest(state, 'categoryStatusDel');
    case DELETE_CATEGORY_SUCCESS:
      return handleDelete(state, payload);
    case DELETE_CATEGORY_ERROR:
      return handleError(state, 'categoryStatusDel', payload.message);

    default:
      return state;
  }
};

export default categoryReducer;
