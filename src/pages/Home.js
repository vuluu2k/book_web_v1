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
    selectProductInformationHome: { hot,sp1,sp2,sp3,sp4,sp5,name1,name2,name3,name4,name5},
  } = props;

  useEffect(() => {
    loadListProduct({});
    loadListProductHome({});
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
          <Layout className=" site-layout-background" style={{ marginBottom: 16 }}>
            <Sider className="site-layout-background">
              <Menu mode="vertical">
                {categorys?.map(category => {
                  return (
                    <SubMenu key={category._id}title={category.name_vi}>
                      {category.sub_name.map((item, idx) => (
                        <SubMenu key={category._id + '/' + item} title={item} onTitleClick={e => loadListProductWithCategory(e.key)}></SubMenu>
                      ))}
                    </SubMenu>
                  );
                })}
              </Menu>
            </Sider>
            <Content>
              <Carousel autoplay>
                <div>
                  <Image src="https://bookbuy.vn/Res/Images/Album/dbeee104-d003-4439-b710-f1b4d28922b8.jpg?w=880&scale=both&h=320&mode=crop" width={'100%'} />
                </div>
                <div>
                  <Image src="https://bookbuy.vn/Res/Images/Album/ead14324-98df-42d0-9589-345fa575fb25.jpg?w=880&scale=both&h=320&mode=crop" width={'100%'} />
                </div>
                <div>
                  <Image src="https://bookbuy.vn/Res/Images/Album/1517cd9d-ca75-4674-a2a9-3ffc1d509a91.jpg?w=880&scale=both&h=320&mode=crop" width={'100%'} />
                </div>
                <div>
                  <Image src="https://bookbuy.vn/Res/Images/Album/50b028b4-c03e-4fac-8307-52e4e2bff0a2.jpg?w=880&scale=both&h=320&mode=crop" width={'100%'} />
                </div>
              </Carousel>
            </Content>
          </Layout>
          <Layout>
            <SilderCustom item={hot} title="Sách bán chạy nhất gần đây >>>" />

            {products.length > 0 && renderProductArray(products, 'Chào bạn đến thế giới sách ')}

            {sp1.length > 0 && renderProductArray(sp1, name1)}
            {sp2.length > 0 && renderProductArray(sp2, name2)}
            {sp3.length > 0 && renderProductArray(sp3, name3)}
            {sp4.length > 0 && renderProductArray(sp4, name4)}
            {sp5.length > 0 && renderProductArray(sp5, name5)}
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
