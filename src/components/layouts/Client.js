import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, BackTop, Input, Drawer, Button, Dropdown, Menu, message as messageAntd } from 'antd';
import { UserOutlined, VerticalAlignTopOutlined, PhoneOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { ImTruck } from 'react-icons/im';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { authActions, cartActions, productActions } from 'actions';
import { selectAuth, selectCart, selectProduct } from 'selectors';
import { CartDetail } from 'components/cart';
import { sumMoney } from 'utils/number';
import { ProductItem } from 'components/product';

const { Header, Content, Footer } = Layout;

function Client({ children, ...props }) {
  const navigate = useNavigate();
  const {
    actions: { initCart, logout, hiddenCart, showCart, loadListProduct },
    selectVisibleCart,
    selectAuthStatus,
    selectCartInformation: { products },
    footer = true,
    selectProductInformation: { products: productSearchs },
  } = props;

  const [keySearch, setKeySearch] = useState('');

  useEffect(() => {
    initCart({ user_id: selectAuthStatus?.user?._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAuthStatus]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePay = () => {
    if (products.length > 0) {
      hiddenCart();
      navigate('/pay');
    } else {
      messageAntd.warning('Bạn chưa có sản phẩm nào trong giỏ hàng');
    }
  };

  return (
    <>
      <Layout className="layout">
        <Header className="header">
          <div className="d-flex align-items-center justify-content-between" style={{ height: 64 }}>
            <Link onClick={() => loadListProduct({ search: true })} to="/home">
              <img src="https://res.cloudinary.com/vuluu/image/upload/v1648835124/PhoneTop/Logo/logo_white_yhtbc6.png" height={64} alt="logo" />
            </Link>
            <Input
              placeholder="Bạn muốn tìm kiếm sản phẩm nào?"
              value={keySearch}
              allowClear
              onChange={e => {
                setKeySearch(e.target.value);
                loadListProduct({ name: e.target.value });
              }}
              style={{ width: 200, marginLeft: 16 }}
            />

            <div className="d-flex align-items-center" style={{ marginLeft: 16, textAlign: 'center' }}>
              <PhoneOutlined className="icon-header" style={{ marginRight: 8 }} />
              <a href="tel:0898709170">
                <div className="fw-500">Gọi mua hàng</div>
                <div className="fw-700">0898709170</div>
              </a>
            </div>
            <Link to="/check_package" style={{ marginRight: 8 }}>
              <div className="text-center">
                <ImTruck className="icon-header" />
                <div className="fw-500">Tra Cứu đơn hàng</div>
              </div>
            </Link>
            <div className="text-center cursor-pointer" onClick={() => showCart()}>
              <ShoppingCartOutlined className="icon-header" />
              <div className="fw-500 text-white">Giỏ hàng</div>
            </div>
            {(selectAuthStatus?.user?.name && (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => logout()}>
                      Đăng xuất
                    </Menu.Item>
                    <Menu.Item key="my-information" icon={<UserOutlined />}>
                      <Link to="/user">Thông tin cá nhân</Link>
                    </Menu.Item>
                  </Menu>
                }>
                <div className="text-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 16 }}>
                  <UserOutlined className="icon-header" />
                  <div className="fw-500 text-white">{selectAuthStatus?.user?.name || 'Tài khoản'}</div>
                </div>
              </Dropdown>
            )) || (
              <Link to="/login">
                <div className="text-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 16 }}>
                  <UserOutlined className="icon-header" />
                  <div className="fw-500 text-white">{selectAuthStatus?.user?.name || 'Tài khoản'}</div>
                </div>
              </Link>
            )}
          </div>
        </Header>
        <Content style={{ padding: '0 200px', marginTop: 64, backgroundColor: '#fff' }}>
          {(keySearch && (
            <div>
              <Row>
                {productSearchs.map(item => (
                  <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xxl={{ span: 4 }} style={{ padding: '4px' }}>
                    <ProductItem id={item._id} name={item.name} imageLink={item.image_link} value={item.value} />
                  </Col>
                ))}
              </Row>
            </div>
          )) ||
            children}
          <BackTop>
            <div className="back-top">
              <VerticalAlignTopOutlined />
            </div>
          </BackTop>
        </Content>
        {footer && (
          <>
            <Footer style={{ color: 'white', padding: '16px 200px' }}>
              <Row>
                <Col span={6}>
                  <div>Tìm cửa hàng</div>
                  <div>Tìm cửa hàng gần nhất</div>
                  <div>Mua hàng từ xa</div>
                </Col>
                <Col span={6}>
                  <div>
                    Gọi mua hàng:
                    <strong>
                      <a href="tel:18002097">1800.2097</a>
                    </strong>
                    (8h00 - 22h00)
                  </div>
                  <div>
                    Gọi khiếu nại:
                    <strong>
                      <a href="tel:18002063">1800.2063</a>
                    </strong>
                    (8h00 - 22h00)
                  </div>
                  <div>
                    Gọi bảo hành
                    <strong>
                      <a href="tel:18002064">1800.2064</a>
                    </strong>
                    (8h00 - 22h00)
                  </div>
                </Col>
                <Col span={6}>
                  <div>Mua hàng và thanh toán Online</div>
                  <div>Mua hàng trả góp Online</div>
                  <div>Tra thông tin đơn hàng</div>
                  <div>Trung tâm bảo hành chính hãng</div>
                  <div>Quy định về việc sao lưu dữ liệu</div>
                  <div>Dịch vụ bảo hành điện thoại</div>
                </Col>
                <Col span={6}>
                  <div>Quy chế hoạt động</div>
                  <div>Chính sách Bảo hành</div>
                  <div>Liên hệ hợp tác kinh doanh</div>
                  <div>Đơn Doanh nghiệp</div>
                  <div>Ưu đãi từ đối tác</div>
                  <div>Tuyển dụng</div>
                </Col>
              </Row>
            </Footer>{' '}
            <div
              className="w-100 d-flex justify-content-center "
              style={{ backgroundColor: 'rgba(255, 0, 0,0.8)', color: 'white', padding: '8px 0', fontWeight: 500 }}>
              ©Copyright Created by Lưu Công Quang Vũ
            </div>
          </>
        )}
      </Layout>
      <Drawer
        title="Giỏ hàng của bạn"
        placement="right"
        onClose={() => hiddenCart()}
        visible={selectVisibleCart}
        footer={
          <>
            <div className="text-upper fw-500 mb-8 text-center">
              Tổng tiền: <span style={{ color: 'rgb(215, 0, 24)' }}>{sumMoney(products?.map(item => item.quantity * item.value_option))}</span>
            </div>
            <div className="d-flex">
              <Button className="btn-red" block onClick={() => hiddenCart()}>
                <Link to="/cart">Xem chi tiết giỏ hàng</Link>
              </Button>
              <Button className="btn-blue ml-4" block onClick={() => handlePay()}>
                Thanh toán
              </Button>
            </div>
          </>
        }>
        <CartDetail user_id={selectAuthStatus?.user?._id} />
      </Drawer>
    </>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...authActions, ...cartActions, ...productActions }, dispatch) });
const mapStateToProps = state => ({ ...selectAuth(state), ...selectCart(state), ...selectProduct(state) });

export default connect(mapStateToProps, mapDispatchToProps)(Client);
