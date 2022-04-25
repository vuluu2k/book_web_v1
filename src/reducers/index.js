import { combineReducers } from 'redux';
import authReducer from './auth';
import categoryReducer from './category';
import productReducer from './product';
import cartReducer from './cart';
import packageReducer from './package';
import blogReducer from './blog';

const rootReducers = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  cart: cartReducer,
  package: packageReducer,
  blog: blogReducer,
});

export default rootReducers;
