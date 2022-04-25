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
  DELETE_PACKAGE,
  DELETE_PACKAGE_SUCCESS,
  DELETE_PACKAGE_ERROR,
  GET_TURNOVER,
  GET_TURNOVER_SUCCESS,
  GET_TURNOVER_ERROR,
} from 'constants/package';

import { handleRequest, handleSuccess, handleError } from 'utils/handleReducer';
import update from 'immutability-helper';
import { converObjToCamelKeys } from 'utils';

const initialState = {
  list_package: {
    success: false,
    message: '',
    packageNew: {},
    viewPackage: [],
    requesting: true,
  },

  check_package: {
    success: false,
    message: '',
    checkPackage: {},
    requesting: true,
  },

  list_turnover: {
    success: false,
    message: '',
    requesting: true,
    packages: [],
    productCount: 0,
    productCountOld: 0,
    packageAcceptCount: 0,
    packageNotAcceptCount: 0,
    userCount: 0,
  },
};

const handleCreate = (state, payload) => {
  const { packageNew } = payload;
  const listCurrent = state.list_package.viewPackage;
  return update(state, {
    list_package: {
      requesting: { $set: false },
      success: { $set: true },
      viewPackage: { $set: [packageNew].concat(listCurrent) },
      $merge: converObjToCamelKeys(payload),
    },
  });
};

const handleDelete = (state, payload) => {
  const { id } = payload;
  const listCurrent = state.list_package.viewPackage;
  const listFilter = listCurrent.filter(item => item._id !== id);
  return update(state, {
    list_package: {
      requesting: { $set: false },
      success: { $set: true },
      viewPackage: { $set: listFilter },
      $merge: converObjToCamelKeys(payload),
    },
  });
};

const handleAccpet = (state, payload) => {
  const { package_accept } = payload;
  const listCurrent = state.list_package.viewPackage;
  const listAfterEdit = listCurrent.map(item => {
    if (item._id === package_accept._id) {
      return package_accept;
    }
    return item;
  });

  return update(state, {
    list_package: {
      requesting: { $set: false },
      success: { $set: true },
      viewPackage: { $set: listAfterEdit },
      $merge: converObjToCamelKeys(payload),
    },
  });
};

const packageReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case LOAD_LIST_PACKAGE:
      return handleRequest(state, 'list_package', payload);
    case LOAD_LIST_PACKAGE_SUCCESS:
      return handleSuccess(state, 'list_package', payload);
    case LOAD_LIST_PACKAGE_ERROR:
      return handleError(state, 'list_package', payload.message);

    case CHECK_PACKAGE:
      return handleRequest(state, 'check_package', payload);
    case CHECK_PACKAGE_SUCCESS:
      return handleSuccess(state, 'check_package', payload);
    case CHECK_PACKAGE_ERROR:
      return handleError(state, 'check_package', payload.message);

    case CREATE_PACKAGE:
      return handleRequest(state, 'list_package', payload);
    case CREATE_PACKAGE_SUCCESS:
      return handleCreate(state, payload);
    case CREATE_PACKAGE_ERROR:
      return handleError(state, 'list_package', payload.message);

    case ACCEPT_PACKAGE:
      return handleRequest(state, 'list_package', payload);
    case ACCEPT_PACKAGE_SUCCESS:
      return handleAccpet(state, payload);
    case ACCEPT_PACKAGE_ERROR:
      return handleError(state, 'list_package', payload.message);

    case GET_TURNOVER:
      return handleRequest(state, 'list_turnover', payload);
    case GET_TURNOVER_SUCCESS:
      return handleSuccess(state, 'list_turnover', payload);
    case GET_TURNOVER_ERROR:
      return handleError(state, 'list_turnover', payload.message);

    case DELETE_PACKAGE:
      return handleRequest(state, 'list_package');
    case DELETE_PACKAGE_SUCCESS:
      return handleDelete(state, payload);
    case DELETE_PACKAGE_ERROR:
      return handleError(state, 'list_package', payload.message);

    default:
      return state;
  }
};

export default packageReducer;
