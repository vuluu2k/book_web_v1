import { fork, all } from 'redux-saga/effects';
import authSagas from './auth';
import categorySagas from './category';
import productSagas from './product';
import cartSagas from './cart';
import packageSagas from './package';
import blogSagas from './blog';

const rootSagas = function* () {
  yield all([fork(...authSagas), fork(...categorySagas), fork(...productSagas), fork(...cartSagas), fork(...packageSagas), fork(...blogSagas)]);
};

export default rootSagas;
