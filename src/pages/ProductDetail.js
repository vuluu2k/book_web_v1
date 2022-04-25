import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message, Row, Col, Image, Button, Divider } from 'antd';
import { CheckCircleOutlined, MobileOutlined, FileProtectOutlined, AccountBookOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cartActions } from 'actions';
import { selectAuth, selectCart } from 'selectors';
import { API_URL } from 'env_config';
import { Client } from 'components/layouts';
import { moneyMask } from 'utils/number';

const text_empty = 'Thông số chưa cập nhật';

function ProductDetail(props) {
  let { id } = useParams();
  const [state, setState] = useState({ productItem: {}, selectOption: -1, nameState: '', valueState: null, user_id: undefined });
  const [stateMoreDescription, setStateMoreDescription] = useState(false);

  const {
    actions: { addCart, showCart },
    selectAuthStatus: { user },
  } = props;
  const { productItem, selectOption, nameState, valueState, user_id } = state;
  const { image_link, name, value, options, profile, _id, quantity, description } = productItem;

  useEffect(() => {
    setState({ ...state, nameState: profile?.ram_capacity + 'GB ' + profile?.rom_capacity + 'GB', valueState: value, user_id: user?._id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, value, user]);

  const hanldeOnSelectOptions = (idx, name, value) => {
    setState({ ...state, selectOption: idx, nameState: name, valueState: value });
  };

  const hanleGetProduct = async () => {
    const url = `${API_URL}/product/view?product_id=${id}`;

    try {
      const response = await axios.get(url);

      if (!response.data.success) {
        message.error(response.data.message);
        setState({ ...state, productItem: {} });
      } else {
        setState({ ...state, productItem: response.data.products[0] });
      }
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = () => {
    addCart({ product_id: _id, name_option: nameState, value_option: valueState, image_link: image_link, user_id: user_id, name });
    user_id && showCart();
  };

  useEffect(() => {
    hanleGetProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItemProfile = (title, content, color, border) => {
    return (
      <Row style={{ backgroundColor: color || 'white', padding: 8, borderBottomRightRadius: border, borderBottomLeftRadius: border }}>
        <Col span={6}>{title}</Col>
        <Col span={18}>
          <div style={{ marginLeft: 4 }}>{content}</div>
        </Col>
      </Row>
    );
  };

  return (
    <Client>
      <Row gutter={30} style={{ padding: '16px 0' }}>
        <Col span={8}>
          <div className="product-item-detail d-flex align-item-center justify-content-center">
            <Image src={image_link} width={180} height={180} />
          </div>
        </Col>
        <Col span={16}>
          <h2>{name?.toUpperCase()}</h2>
          <div>Giá chính thức:</div>
          <div className="product-item-money">{moneyMask(valueState || value)}</div>

          {options?.length > 0 && (
            <div className="d-flex align-items-center justify-content-between">
              <div
                className={(selectOption === -1 && 'option-item-activated') || 'option-item'}
                style={{ cursor: 'pointer' }}
                onClick={() => hanldeOnSelectOptions(-1, name, value)}>
                <div>{profile?.ram_capacity + 'GB ' + profile?.rom_capacity + 'GB'}</div>
                <div>{moneyMask(value)}</div>
              </div>
              {options?.length > 0 &&
                options.map((item, idx) => (
                  <div
                    key={idx}
                    className={(selectOption === idx && 'option-item-activated') || 'option-item'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => hanldeOnSelectOptions(idx, item?.name_option, item?.value_option)}>
                    <div>{item?.name_option.toUpperCase()}</div>
                    <div>{moneyMask(item?.value_option)}</div>
                  </div>
                ))}
            </div>
          )}

          <Button className="btn-buy" style={{ marginTop: 16 }} onClick={() => handleAddCart()} block>
            <div className="fw-500">THÊM VÀO GIỎ HÀNG</div>
          </Button>
        </Col>
      </Row>
      <Divider />
      <div className="w-100 mb-16">
          <div
            className="description"
            style={{
              borderRadius: 16,
              padding: 8,
              backgroundColor: 'white',
            }}>
            <div className="text-center text-upper fw-700 fz-16">Một số thông tin về sách</div>
            {(description && (
              <>
                <div
                  style={{
                    backgroundColor: 'white',
                    height: stateMoreDescription ? '100%' : 800,
                    overflow: stateMoreDescription ? 'visible' : 'hidden',
                  }}
                  dangerouslySetInnerHTML={{ __html: description }}></div>
                <div className="w-100 text-center bg-description">
                  <Button
                    onClick={() => setStateMoreDescription(!stateMoreDescription)}
                    icon={stateMoreDescription ? <UpOutlined /> : <DownOutlined />}
                    className="box-shadow"
                    style={{ borderRadius: 8, border: 'none', minWidth: 200 }}>
                    {stateMoreDescription ? 'Thu gọn' : 'Xem thêm'}
                  </Button>
                </div>
              </>
            )) || <div>Sản phẩm chưa được shop nhập mô tả</div>}
          </div>
      </div>
    </Client>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...cartActions }, dispatch) });
const mapStateToProps = state => ({ ...selectAuth(state), ...selectCart(state) });

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
