import React, { useEffect } from 'react';
import { Layout, Menu, Carousel, Image, Row, Col } from 'antd';
import Icon, { MobileOutlined, LaptopOutlined, TabletOutlined, HomeOutlined } from '@ant-design/icons';
import { IoWatchOutline } from 'react-icons/io5';
import { CgUsb } from 'react-icons/cg';
import { FaHeadphonesAlt, FaRegNewspaper } from 'react-icons/fa';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectCategory, selectProduct } from 'selectors';
import { productActions } from 'actions';
import { Client } from 'components/layouts';
import { ProductItem } from 'components/product';
import { SilderCustom } from 'components/Common';
import { Link } from 'react-router-dom';
const { SubMenu } = Menu;
const { Content, Sider } = Layout;

function renderProductArray(product, title) {
  return (
    <>
      <h1 style={{ marginBottom: 16 }} className="text-upper">
        {title}
      </h1>
      <Row gutter={15}>
        {product.map((a, index) => (
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xxl={{ span: 4 }} key={index} span={4}>
            <ProductItem name={a.name} value={a.value} imageLink={a.image_link} id={a._id} />
          </Col>
        ))}
      </Row>
    </>
  );
}

function Home(props) {
  const {
    selectCategory: {
      selectCategoryInformation: { categorys },
    },
    selectProductInformation: { products, dataSearch },
    actions: { loadListProductHome, loadListProduct },
    selectProductInformationHome: { hot, mobile, laptop, watch, tablet, accessory },
  } = props;

  useEffect(() => {
    loadListProductHome();
  }, []);

  const loadListProductWithCategory = key => {
    const keys = key.split('/');
    loadListProduct({ ...dataSearch, category: keys[0], sub_category: keys[1] });
  };

  return (
    <Client>
      {(products.length > 0 && (
        <div>
          <Row>
            {products.map(item => (
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xxl={{ span: 4 }} style={{ padding: '4px' }}>
                <ProductItem id={item._id} name={item.name} imageLink={item.image_link} value={item.value} />
              </Col>
            ))}
          </Row>
        </div>
      )) || (
        <>
          <Layout className="layout-carousel site-layout-background" style={{ marginBottom: 16 }}>
            <Sider className="site-layout-background">
              <Menu mode="vertical">
                {categorys?.map(category => {
                  const icon =
                    (category.name_vi === 'Điện thoại' && MobileOutlined) ||
                    (category.name_vi === 'Laptop, PC, Màn hình' && LaptopOutlined) ||
                    (category.name_vi === 'Máy tỉnh bảng' && TabletOutlined) ||
                    (category.name_vi === 'Âm thanh' && FaHeadphonesAlt) ||
                    (category.name_vi === 'Nhà thông minh' && HomeOutlined) ||
                    (category.name_vi === 'Đồng hồ' && IoWatchOutline) ||
                    (category.name_vi === 'Phụ kiện' && CgUsb);
                  return (
                    <SubMenu key={category._id} icon={<Icon component={icon} />} title={category.name_vi}>
                      {category.sub_name.map((item, idx) => (
                        <SubMenu key={category._id + '/' + item} title={item} onTitleClick={e => loadListProductWithCategory(e.key)}></SubMenu>
                      ))}
                    </SubMenu>
                  );
                })}
                <Menu.Item key="/blog" icon={<FaRegNewspaper />}>
                  <Link to="/blog">Tin công nghệ</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Content>
              <Carousel autoplay>
                <div>
                  <Image src="https://cdn.cellphones.com.vn/media/ltsoft/promotion/S22_1.png" width={'100%'} />
                </div>
                <div>
                  <Image src="https://cdn.cellphones.com.vn/media/ltsoft/promotion/S22_1.png" width={'100%'} />
                </div>
                <div>
                  <Image src="https://cdn.cellphones.com.vn/media/ltsoft/promotion/S22_1.png" width={'100%'} />
                </div>
                <div>
                  <Image src="https://cdn.cellphones.com.vn/media/ltsoft/promotion/S22_1.png" width={'100%'} />
                </div>
              </Carousel>
            </Content>
          </Layout>
          <Layout>
            <SilderCustom item={hot} title="Sản phẩm bán chạy nhất" />

            {mobile.length > 0 && renderProductArray(mobile, 'Điện thoại')}
            {laptop.length > 0 && renderProductArray(laptop, 'Laptop, PC, Màn hình')}
            {watch.length > 0 && renderProductArray(watch, 'Đồng hồ')}
            {tablet.length > 0 && renderProductArray(tablet, 'Máy tính bảng')}
            {accessory.length > 0 && renderProductArray(accessory, 'Phụ kiện')}
          </Layout>
        </>
      )}
    </Client>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...productActions }, dispatch) });

const mapStateToProps = state => ({
  selectCategory: selectCategory(state),
  ...selectProduct(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
