import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

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

import { API_URL } from 'env_config';

export default [blogSagas];

function* startRequest(payload) {
  switch (payload.type) {
    case LOAD_LIST_BLOG:
      yield call(loadList, payload);
      break;
    case CREATE_BLOG:
      yield call(createBlog, payload);
      break;
    case EDIT_BLOG:
      yield call(editBlog, payload);
      break;
    case DELETE_BLOG:
      yield call(deleteBlog, payload);
      break;
    default:
      break;
  }
}

function* loadList({ payload }) {
  const { title, type } = payload;

  const url = `${API_URL}/blog/view_blog?title=${title || ''}&&type=${type || ''}`;

  try {
    const response = yield call(axios.get, url);
    if (!response.data.success) {
      yield put({ typ: LOAD_LIST_BLOG_ERROR, ...response.data });
    } else {
      yield put({ type: LOAD_LIST_BLOG_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: LOAD_LIST_BLOG_ERROR, error: error });
    return error;
  }
}

function* createBlog({ payload }) {
  const { title, image, type, description } = payload;
  const url = `${API_URL}/blog/create_blog`;
  const body = {
    title,
    image,
    type,
    description,
  };
  try {
    const response = yield call(axios.post, url, body);
    if (!response.data.success) {
      yield put({ typ: CREATE_BLOG_ERROR, ...response.data });
    } else {
      yield put({ type: CREATE_BLOG_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: CREATE_BLOG_ERROR, error: error });
    return error;
  }
}

function* editBlog({ payload }) {
  const { blog_id, title, image, type, description } = payload;
  const url = `${API_URL}/blog/edit_blog`;
  const body = {
    blog_id,
    title,
    image,
    type,
    description,
  };
  try {
    const response = yield call(axios.patch, url, body);
    if (!response.data.success) {
      yield put({ type: EDIT_BLOG_ERROR, ...response.data });
    } else {
      yield put({ type: EDIT_BLOG_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: EDIT_BLOG_ERROR, error: error });
    return error;
  }
}

function* deleteBlog({ payload }) {
  const { blog_id } = payload;
  const url = `${API_URL}/blog/delete_blog/${blog_id}`;
  try {
    const response = yield call(axios.delete, url);
    if (!response.data.success) {
      yield put({ type: DELETE_BLOG_ERROR, ...response.data });
    } else {
      yield put({ type: DELETE_BLOG_SUCCESS, ...response.data });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    yield put({ type: DELETE_BLOG_ERROR, error: error });
    return error;
  }
}

export function* blogSagas() {
  yield takeLatest([LOAD_LIST_BLOG, CREATE_BLOG, EDIT_BLOG, DELETE_BLOG], startRequest);
}
