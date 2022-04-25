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

          <div className="w-100" style={{ border: '1px solid #D1D5DB', borderRadius: 10, marginTop: 16 }}>
            <div className="w-100 fw-500" style={{ padding: 8 }}>
              THÔNG TIN SẢN PHẨM
            </div>
            <div className="p-8">
              <div>
                <MobileOutlined style={{ marginRight: 8 }} />
                Nguyên hộp, đầy đủ phụ kiện từ nhà sản xuất
              </div>
              <div>
                <FileProtectOutlined style={{ marginRight: 8 }} />
                Bảo hành 24 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất.
              </div>
              <div>
                <AccountBookOutlined style={{ marginRight: 8 }} />
                Số lượng còn trong kho: <span className="text-red">{quantity}</span>
              </div>
            </div>
          </div>

          <Button className="btn-buy" style={{ marginTop: 16 }} onClick={() => handleAddCart()} block>
            <div className="fw-500">MUA NGAY</div>
            <div>(Giao tận nơi hoặc lấy tại cửa hàng)</div>
          </Button>
          <div className="w-100" style={{ border: '1px solid #D1D5DB', borderRadius: 10, marginTop: 16 }}>
            <div className="w-100 fw-500" style={{ backgroundColor: '#D1D5DB', padding: 8, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
              ƯU ĐÃI THÊM
            </div>
            <div className="p-8">
              <div>
                <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
                Giảm thêm tới 1% cho thành viên Smember (áp dụng tùy sản phẩm)
              </div>
              <div>
                <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
                Giảm thêm 500.000đ khi thanh toán qua ví thẻ tín dụng VP Bank cho đơn hàng từ 10 triệu
              </div>
              <div>
                <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
                Thu cũ đổi mới: Giá thu cao - Thủ tục nhanh chóng - Trợ giá tốt nhất
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Divider />
      <Row gutter={30} style={{ paddingBottom: 16 }}>
        <Col span={16}>
          <div
            className="description"
            style={{
              boxShadow: 'rgb(60 64 67 / 0.1) 0px 1px 2px 0px, rgb(60 64 67 / 0.15) 0px 2px 6px 2px',
              borderRadius: 16,
              padding: 8,
              backgroundColor: 'white',
            }}>
            <div className="text-center text-red fw-700 fz-16">ĐẶC ĐIỂM NỔI BẬT</div>
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
        </Col>
        <Col span={8}>
          <div
            style={{
              boxShadow: 'rgb(60 64 67 / 0.1) 0px 1px 2px 0px, rgb(60 64 67 / 0.15) 0px 2px 6px 2px',
              borderRadius: 16,
              backgroundColor: 'rgba(255, 255, 255)',
            }}>
            <div className="fw-700 p-8">THÔNG SỐ KĨ THUẬT</div>
            {renderItemProfile('Kích thước màn hình', (profile?.screen_size && `${profile.screen_size} inches`) || text_empty, '#F2F2F2')}
            {renderItemProfile('Công nghệ màn hình', (profile?.screen_technology && `${profile.screen_technology} inches`) || text_empty)}
            {renderItemProfile('Camera sau', (profile?.camera_font && `${profile.camera_font} inches`) || text_empty, '#F2F2F2')}
            {renderItemProfile('Camera trước', (profile?.camera_back && `${profile.camera_back} inches`) || text_empty)}
            {renderItemProfile('Chipset', (profile?.chipset && `${profile.chipset} inches`) || text_empty, '#F2F2F2')}
            {renderItemProfile('Dung lượng RAM', (profile?.ram_capacity && `${profile.ram_capacity} inches`) || text_empty)}
            {renderItemProfile('Bộ nhớ trong', (profile?.rom_capacity && `${profile.rom_capacity} inches`) || text_empty, '#F2F2F2')}
            {renderItemProfile('Pin', (profile?.baterry && `${profile.baterry} inches`) || text_empty)}
            {renderItemProfile('Thẻ SIM', (profile?.sim_card && `${profile.sim_card} inches`) || text_empty, '#F2F2F2')}
            {renderItemProfile('Hệ điều hành', (profile?.os && `${profile.os} inches`) || text_empty)}
            {renderItemProfile('Độ phân giải màn hình', (profile?.screen_pixel && `${profile.screen_pixel} inches`) || text_empty, '#F2F2F2')}
            {renderItemProfile('Tần số quét', (profile?.scan_frequency && `${profile.scan_frequency} inches`) || text_empty)}
            {renderItemProfile('Trọng lượng', (profile?.weight && `${profile.weight} inches`) || text_empty, '#F2F2F2')}
            {renderItemProfile('Bluetooth', (profile?.bluetooth && `${profile.bluetooth} inches`) || text_empty, 'white', '16px')}
          </div>
        </Col>
      </Row>
    </Client>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...cartActions }, dispatch) });
const mapStateToProps = state => ({ ...selectAuth(state), ...selectCart(state) });

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
