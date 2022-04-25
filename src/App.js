import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import { Landing } from 'components/layouts';
import { Home, Account, ProductDetail, Cart, Pay, CheckPackage, Blog } from 'pages';
import { Auth } from 'components/auth';
import { Dashboard, ProductManager, CategoryManager, PackageManager, BlogManager, AccountManager } from 'pages/admin';
import { UserRouting } from 'components/user';
import { PrivateRoute } from 'components/routing';

import 'css/common.scss';
import 'css/layout.scss';
import 'css/home.scss';
import 'css/auth.scss';
import 'css/product.scss';
import 'css/cart.scss';
import 'css/blog.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function App() {
  return (
    <Provider store={store}>
      <UserRouting>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/user" element={<Account />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/check_package" element={<CheckPackage />} />
            <Route path="/blog" element={<Blog />} />

            <Route exact path="/" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/product-manager" element={<ProductManager />} />
              <Route path="/category-manager" element={<CategoryManager />} />
              <Route path="/package-manager" element={<PackageManager />} />
              <Route path="/blog-manager" element={<BlogManager />} />
              <Route path="/account-manager" element={<AccountManager />} />
            </Route>
            <Route path="/*" element={<h1>Địa chỉ trang không tồn tại trên trang web PhoneTop .... (*-*)</h1>} />
          </Routes>
        </BrowserRouter>
      </UserRouting>
    </Provider>
  );
}

export default App;
