import update from 'immutability-helper';
import { converObjToCamelKeys } from './';

export const handleRequest = (state, action) =>
  update(state, {
    [action]: {
      requesting: { $set: true },
      success: { $set: false },
      message: { $set: '' },
    },
  });

export const handleSuccess = (state, action, payload) =>
  update(state, {
    [action]: {
      requesting: { $set: false },
      success: { $set: true },
      $merge: converObjToCamelKeys(payload),
    },
  });

export const handleError = (state, action, error) =>
  update(state, {
    [action]: {
      requesting: { $set: false },
      success: { $set: false },
      message: { $set: (typeof error === 'string' && error) || 'Đã có lỗi xảy ra vui lòng thử lại sau' },
    },
  });

export const handleFetchData = (state, action, key = 'data') =>
  update(state, {
    [action]: { requesting: { $set: true } },
  });
