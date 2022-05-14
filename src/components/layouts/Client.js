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
              <img src="https://thienminhbook.com/wp-content/uploads/2022/02/TMBLogoHeader.png" height={32} alt="logo" />
            </Link>
            <Input
              placeholder="Nhập tên sách bạn đang cần tìm..."
              value={keySearch}
              allowClear
              onChange={e => {
                setKeySearch(e.target.value);
                loadListProduct({ name: e.target.value });
              }}
              style={{ width: 400, marginLeft: 16 }}
            />

            <div className="d-flex align-items-center" style={{ marginLeft: 16 }}>
              <PhoneOutlined className="icon-header" style={{ marginRight: 8 }} />
              <a href="tel:0898709170">
                <div className="d-flex flex-column">
                  <div className="fw-500">Liên hệ</div>
                  <div className="fw-700">0971979655</div>
                </div>
              </a>
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
                  <div className="fw-500 ">{selectAuthStatus?.user?.name || 'Tài khoản'}</div>
                </div>
              </Dropdown>
            )) || (
              <Link to="/login">
                <div className="text-center d-flex" style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 16 }}>
                  <UserOutlined className="icon-header" />
                  <div className="fw-500 ml-4">{selectAuthStatus?.user?.name || 'Tài khoản'}</div>
                </div>
              </Link>
            )}
            <div className="text-center cursor-pointer d-flex" onClick={() => showCart()}>
              <ShoppingCartOutlined className="icon-header" />
              <div className="fw-500 ml-4">Giỏ hàng</div>
            </div>
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
                  <h4>HỖ TRỢ KHÁCH HÀNG</h4>
                  <div>Sản phẩm & Đơn hàng: 0933 109 009</div>
                  <div>Kỹ thuật & Bảo hành: 0989 439 986</div>
                  <div>Điện thoại: (028) 3820 7153 (giờ hành chính)</div>
                  <div>Email: info@Thiên Minh.vn</div>
                  <div>Địa chỉ: 9 Lý Văn Phức, Tân Định, Q1, TP.HCM</div>
                </Col>
                <Col span={6}>
                  <h4>TRỢ GIÚP</h4>
                  <div>Đăng ký nhận bản tin</div>
                  <div>Hướng dẫn mua hàng</div>
                  <div>Phương thức thanh toán</div>
                  <div>Phương thức vận chuyển</div>
                  <div>Chính sách đổi - trả</div>
                  <div>Chính sách bồi hoàn</div>
                  <div> Câu hỏi thường gặp (FAQs)</div>
                </Col>
                <Col span={6}>
                  <h4>TÀI KHOẢN CỦA BẠN</h4>
                  <div>Cập nhật tài khoản</div>
                  <div>Giỏ hàng</div>
                  <div>Lịch sử giao dịch</div>
                  <div>Sản phẩm yêu thích</div>
                  <div>Kiểm tra đơn hàng</div>
                </Col>
                <Col span={6}>
                  <h4>Thiên Minh</h4>
                  <div>Giới thiệu Thiên Minh.vn</div>
                  <div>Thiên Minh trên Facebook</div>
                  <div>Liên hệ Thiên Minh</div>
                  <div>Đặt hàng theo yêu cầu</div>
                  <div>Tích lũy BBxu</div>
                  <div>Proguide.vn - Kaspersky</div>
                  <div>iBookStop.vn</div>
                </Col>
              </Row>
            </Footer>{' '}
            <div
              className="w-100 d-flex justify-content-center "
              style={{ backgroundColor: '#f8bc5a', color: 'white', padding: '8px 0', fontWeight: 500 }}>
              ©Copyright By Nguyễn Văn Đôn
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
