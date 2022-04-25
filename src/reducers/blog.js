import {
  LOAD_LIST_BLOG,
  LOAD_LIST_BLOG_SUCCESS,
  LOAD_LIST_BLOG_ERROR,
  CREATE_BLOG,
  CREATE_BLOG_SUCCESS,
  CREATE_BLOG_ERROR,
  EDIT_BLOG,
  EDIT_BLOG_SUCCESS,
  EDIT_BLOG_ERROR,
  DELETE_BLOG,
  DELETE_BLOG_SUCCESS,
  DELETE_BLOG_ERROR,
} from 'constants/blog';

import { handleRequest, handleSuccess, handleError } from 'utils/handleReducer';
import update from 'immutability-helper';
import { converObjToCamelKeys } from 'utils';

const initialState = {
  blogData: {
    success: false,
    message: '',
    blogs: [],
  },
};

const handleDelete = (state, payload) => {
  const { blog } = payload;
  const listCurrent = state.blogData.blogs;
  const listFilter = listCurrent.filter(item => item._id !== blog._id);
  return update(state, {
    blogData: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
      blogs: { $set: listFilter },
    },
  });
};

const handleEdit = (state, payload) => {
  const { blog } = payload;
  const listCurrent = state.blogData.blogs;
  const listAfterEdit = listCurrent.map(item => {
    if (item._id === blog._id) {
      return blog;
    }
    return item;
  });

  return update(state, {
    blogData: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
      blogs: { $set: listAfterEdit },
    },
  });
};

const handleCreate = (state, payload) => {
  const { blog } = payload;
  const listCurrent = state.blogData.blogs;
  return update(state, {
    blogData: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
      blogs: { $set: [blog].concat(listCurrent) },
    },
  });
};

const categoryReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case LOAD_LIST_BLOG:
      return handleRequest(state, 'blogData', payload);
    case LOAD_LIST_BLOG_SUCCESS:
      return handleSuccess(state, 'blogData', payload);
    case LOAD_LIST_BLOG_ERROR:
      return handleError(state, 'blogData', payload.message);

    case CREATE_BLOG:
      return handleRequest(state, 'blogData', payload);
    case CREATE_BLOG_SUCCESS:
      return handleCreate(state, payload);
    case CREATE_BLOG_ERROR:
      return handleError(state, 'blogData', payload.message);

    case EDIT_BLOG:
      return handleRequest(state, 'blogData');
    case EDIT_BLOG_SUCCESS:
      return handleEdit(state, payload);
    case EDIT_BLOG_ERROR:
      return handleError(state, 'blogData', payload.message);

    case DELETE_BLOG:
      return handleRequest(state, 'blogData');
    case DELETE_BLOG_SUCCESS:
      return handleDelete(state, payload);
    case DELETE_BLOG_ERROR:
      return handleError(state, 'blogData', payload.message);

    default:
      return state;
  }
};

export default categoryReducer;
