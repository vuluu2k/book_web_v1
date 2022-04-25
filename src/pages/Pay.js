import React, { useState } from 'react';
import { Steps, Row, Col, Input, Radio, Select, Button, message as messageAntd } from 'antd';
import { ShoppingCartOutlined, IdcardOutlined, PercentageOutlined, CreditCardOutlined, LeftOutlined } from '@ant-design/icons';
import { SiHomeassistantcommunitystore } from 'react-icons/si';
import { FiPackage } from 'react-icons/fi';
import { MdPayment } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BsFillCartPlusFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Client } from 'components/layouts';
import { packageActions, cartActions } from 'actions';
import { selectAuth, selectCart, selectPackage } from 'selectors';
import { sumMoney, moneyMask, sumMoneyNumber } from 'utils/number';
import validator from 'validator';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const color_disable = '#0e2431';

function Pay(props) {
  const navigate = useNavigate();
  const {
    actions: { createPackage, clearCart },
    selectAuthStatus: { user },
    selectCartInformation: { products },
    selectListPackage: { packageNew },
  } = props;
  const [stateStep, setStateStep] = useState(1);
  const [stateRadio, setStateRadio] = useState(1);
  const [stateStore, setStateStore] = useState('');
  const [stateInfor, setStateInfor] = useState({
    full_name: user?.full_name || '',
    phone_number: user?.phone_number || '',
    email: user?.email || '',
    full_address: '',
    provice: '',
    district: '',
    address: '',
    note: '',
    voucher: '',
    is_pay: undefined,
  });

  const { full_name, phone_number, email, full_address, provice, district, address, note, voucher, is_pay } = stateInfor;

  const sumPay = sumMoney(products?.map(item => item.quantity * item.value_option));

  const sumPayNumber = sumMoneyNumber(products?.map(item => item.quantity * item.value_option));

  console.log(sumPayNumber);

  const onChangeInput = e => setStateInfor({ ...stateInfor, [e.target.name]: e.target.value });

  const styleIconStep = { width: 36, height: 36, borderRadius: 18, border: '1px solid #000' };

  const handleGoBack = () => {
    if (stateStep === 0) navigate('/cart');
    else setStateStep(stateStep - 1);
  };

  const handleNext = () => {
    if (!full_name || !phone_number || !email) {
      return messageAntd.error('Bạn chưa nhập đủ trường thông tin cá nhân');
    }
    if (!validator.isMobilePhone(String(phone_number), 'vi-VN')) {
      return messageAntd.error('Bạn chưa nhập đúng số điện thoại');
    }
    if (!validator.isEmail(String(email))) {
      return messageAntd.error('Bạn chưa nhập đúng tài khoản email');
    }
    if ((stateRadio === 1 && !stateStore) || (stateRadio === 2 && !provice && !district && !address)) {
      return messageAntd.error('Bạn chưa nhập đầy đủ/lựa chọn địa chỉ nhận hàng');
    }

    setStateInfor({ ...stateInfor, full_address: stateRadio === 1 ? stateStore : `${address}-${district}-${provice}` });
    if (stateStep === 3) {
      if (!is_pay) {
        return messageAntd.error('Vui lòng chọn phương thức thanh toán');
      }
      createPackage({
        user_id: user._id,
        products,
        full_name,
        phone_number,
        email,
        voucher,
        value: sumPayNumber,
        address: full_address,
        is_access: false,
        note,
        is_pay,
      });
      clearCart({ user_id: user._id });
    }

    return setStateStep(stateStep + 1);
  };

  const renderItemPay = (text, icon) => {
    return (
      <div
        className="box-shadow d-flex flex-column align-items-center justify-content-center p-8 border-radius-16 cursor-pointer"
        style={(is_pay && is_pay === text && { border: '1px solid #f5222d', color: '#f5222d' }) || {}}
        onClick={() => setStateInfor({ ...stateInfor, is_pay: text })}>
        <div>{text}</div>
        <div>{icon}</div>
      </div>
    );
  };

  const renderItemProduct = item => {
    return (
      <div className="box-shadow p-16 mt-16 cart-detail" style={{ borderRadius: 16 }}>
        <div className="d-flex">
          <div>
            <img src={item.image_link} alt={item.name} width={160} height={160} />
          </div>
          <div className="ml-8 w-100">
            <div className="d-flex justify-content-between w-100 fw-700 fz-16">
              {item.name} ({item.name_option})
            </div>
            <div className="text-red fw-700 fz-16">{moneyMask(item.value_option)}</div>
            <div className="d-flex align-items-center">
              <div className="fw-500">Số lượng: {item.quantity}</div>
            </div>
            <div className="d-flex align-items-center">
              <div className="fw-500">Tổng tiền: {moneyMask(item.quantity * item.value_option)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Client footer={false}>
      <div className="d-flex justify-content-center">
        <div style={{ padding: '16px', maxWidth: 644 }}>
          <div>
            <div className="  d-flex text-red fz-18 fw-700 align-items-center justify-content-center mb-16" style={{ position: 'relative' }}>
              <div
                className="d-flex align-items-center justify-content-center cursor-pointer"
                onClick={() => handleGoBack()}
                style={{ position: 'absolute', left: 0 }}>
                <LeftOutlined style={{ fontSize: 14 }} />
                Trở về
              </div>
              <div>
                {stateStep === 1
                  ? 'Thông tin đặt hàng'
                  : stateStep === 2
                  ? 'Phiếu giảm giá'
                  : stateStep === 3
                  ? 'Chọn phương thức thanh toán'
                  : 'Hoàn tất'}
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fef2f2', borderRadius: 16 }}>
            <Steps current={stateStep} className="step-custom p-16" direction="horizontal" labelPlacement="vertical" onChange={e => setStateStep(e)}>
              <Step
                title="Chọn sản phẩm"
                icon={
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ ...styleIconStep, borderColor: (stateStep >= 0 && '#d70018') || color_disable }}>
                    <ShoppingCartOutlined style={{ color: (stateStep >= 0 && '#d70018') || color_disable, fontSize: 16 }} />
                  </div>
                }
              />
              <Step
                title="Thông tin"
                icon={
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ ...styleIconStep, borderColor: (stateStep >= 1 && '#d70018') || color_disable }}>
                    <IdcardOutlined style={{ color: (stateStep >= 1 && '#d70018') || color_disable, fontSize: 16 }} />
                  </div>
                }
              />
              <Step
                title="Phiếu giảm giá"
                icon={
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ ...styleIconStep, borderColor: (stateStep >= 2 && '#d70018') || color_disable }}>
                    <PercentageOutlined style={{ color: (stateStep >= 2 && '#d70018') || color_disable, fontSize: 16 }} />
                  </div>
                }
              />
              <Step
                title="Thanh toán"
                icon={
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ ...styleIconStep, borderColor: (stateStep >= 3 && '#d70018') || color_disable }}>
                    <CreditCardOutlined style={{ color: (stateStep >= 3 && '#d70018') || color_disable, fontSize: 16 }} />
                  </div>
                }
              />
              <Step
                title="Hoàn tất"
                icon={
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ ...styleIconStep, borderColor: (stateStep >= 4 && '#d70018') || color_disable }}>
                    <FiPackage style={{ color: (stateStep >= 4 && '#d70018') || color_disable, fontSize: 16 }} />
                  </div>
                }
              />
            </Steps>

            {stateStep === 2 && (
              <div className="p-16">
                <div className="box-shadow p-16 border-radius-16 d-flex" style={{ background: 'white' }}>
                  <Input name="voucher" value={voucher} onChange={onChangeInput} placeholder="Nhập phiếu giảm giá" />
                  <Button className="btn-buy ml-8" style={{ height: 36 }}>
                    Áp dụng
                  </Button>
                </div>
              </div>
            )}

            <div className="box-shadow border-radius-16 p-16" style={{ backgroundColor: 'white' }}>
              {stateStep === 1 && (
                <>
                  <div className="fz-16 fw-700">Thông tin khách hàng</div>
                  <div className="mt-8">
                    <Input name="full_name" value={full_name} onChange={onChangeInput} placeholder="Họ và tên (bắt buộc)" />
                  </div>
                  <div className="mt-8">
                    <Input name="phone_number" value={phone_number} onChange={onChangeInput} placeholder="Số điện thoại (bắt buộc)" />
                  </div>
                  <div className="mt-8">
                    <Input name="email" value={email} onChange={onChangeInput} placeholder="Email (Vui lòng điền email để nhận hóa đơn VAT)" />
                  </div>

                  <div className="fz-16 fw-700 mt-8">Chọn cách thức giao hàng</div>
                  <div className="mt-4">
                    <Radio.Group onChange={e => setStateRadio(e.target.value)} value={stateRadio}>
                      <Radio value={1}>Nhận tại cửa hàng</Radio>
                      <Radio value={2}>Giao hàng tận nơi</Radio>
                    </Radio.Group>
                  </div>

                  <div className="border-radius-16 p-16 mt-8" style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                    <Row gutter={8}>
                      {(stateRadio === 2 && (
                        <>
                          <Col span={12}>
                            <Input name="provice" value={provice} onChange={onChangeInput} placeholder="Tỉnh/Thành Phố" />
                          </Col>
                          <Col span={12}>
                            <Input name="district" value={district} onChange={onChangeInput} placeholder="Quận/Huyện" />
                          </Col>
                          <Col span={24} className="mt-8">
                            <Input name="address" value={address} onChange={onChangeInput} placeholder="Địa chỉ người nhận" />
                          </Col>
                        </>
                      )) || (
                        <Select defaultValue="" className="w-100" value={stateStore} onChange={e => setStateStore(e)}>
                          <Option value="">Chọn cơ sơ muốn nhận máy</Option>
                          <Option value="CS1-Xuân Phương-Nam Từ Liêm-Hà Nội">CS1-Xuân Phương-Nam Từ Liêm-Hà Nội</Option>
                          <Option value="CS2-Thường Tín-Thanh Xuân-Hà Nội">CS2-Thường Tín-Thanh Xuân-Hà Nội</Option>
                        </Select>
                      )}
                    </Row>
                  </div>
                  <div className="mt-8">
                    <TextArea rows={2} name="note" value={note} onChange={onChangeInput} placeholder="Yêu cầu khác" maxLength={6} />
                  </div>
                </>
              )}

              {stateStep === 2 && (
                <>
                  <div className="box-shadow p-16 border-radius-16">
                    <div className="fz-16 fw-500 text-upper text-center ">THÔNG TIN ĐẶT HÀNG</div>
                    <div>
                      Người nhận: <strong>{full_name}</strong>
                    </div>
                    <div>
                      Số điện thoại: <strong>{phone_number}</strong>
                    </div>
                    <div>
                      Email: <strong>{email}</strong>
                    </div>
                    <div>
                      Nhận sản phẩm tại: <strong>{(stateRadio === 1 && stateStore) || `${address}-${district}-${provice}`}</strong>
                    </div>
                    <div>
                      Tổng tiền: <strong>{sumPay}</strong>
                    </div>
                  </div>
                </>
              )}

              {stateStep === 3 && (
                <>
                  <div className="box-shadow p-16 border-radius-16">
                    <div className="fz-16 fw-500 text-upper text-center ">THÔNG TIN ĐẶT HÀNG</div>
                    <div>
                      Người nhận: <strong>{full_name}</strong>
                    </div>
                    <div>
                      Số điện thoại: <strong>{phone_number}</strong>
                    </div>
                    <div>
                      Email: <strong>{email}</strong>
                    </div>
                    <div>
                      Nhận sản phẩm tại: <strong>{(stateRadio === 1 && stateStore) || `${address}-${district}-${provice}`}</strong>
                    </div>
                    <div>
                      Tổng tiền: <strong>{sumPay}</strong>
                    </div>
                  </div>
                  <div className="p-16">
                    <div className="mt-8 mb-8 fz-16 fw-500">Chọn hình thức thanh toán</div>
                    <Row gutter={4}>
                      <Col span={12}>{renderItemPay('Thanh toán tại cửa hàng', <SiHomeassistantcommunitystore />)}</Col>
                      <Col span={12}>{renderItemPay('Thanh toán chuyển khoản', <MdPayment />)}</Col>
                    </Row>
                  </div>
                </>
              )}
              {stateStep === 4 && (
                <>
                  <div className="mb-8">
                    Cảm ơn Quý khách hàng đã chọn mua hàng tại PhoneTop. Trong 15 phút, PhoneTop sẽ SMS hoặc gọi để xác nhận đơn hàng. * Các đơn hàng
                    từ 21h30 tối tới 8h sáng hôm sau. PhoneTop sẽ liên hệ với Quý khách trước 10h trưa cùng ngày
                  </div>
                  <div className="box-shadow p-16 border-radius-16" style={{ backgroundColor: '#d4edda', color: '#155724' }}>
                    <div className="fz-16 fw-700 text-upper text-center mb-b ">ĐẶT HÀNG THÀNH CÔNG</div>
                    <div>
                      Mã đơn hàng: <strong>{packageNew?._id || '#000'}</strong>
                    </div>
                    <div>
                      Người nhận: <strong>{full_name}</strong>
                    </div>
                    <div>
                      Số điện thoại: <strong>{phone_number}</strong>
                    </div>
                    <div>
                      Email: <strong>{email}</strong>
                    </div>
                    <div>
                      Nhận sản phẩm tại: <strong>{(stateRadio === 1 && stateStore) || `${address}-${district}-${provice}`}</strong>
                    </div>
                    <div>
                      Hình thức thanh toán: <strong>{is_pay}</strong>
                    </div>
                    <div>
                      Tổng tiền: <strong>{sumPay}</strong>
                    </div>
                    {is_pay === 'Thanh toán chuyển khoản' && (
                      <div className="p-8 border-radius-16 mt-8" style={{ backgroundColor: 'white', color: '#155724' }}>
                        <div className="fw-700">Thông tin chuyển khoản:</div>
                        <ul style={{ marginBottom: 0 }}>
                          <li>Công ty TNHH Thương mại và dịch vụ kỹ thuật PanCake</li>
                          <li>Ngân hàng ViettinBank - Sở giao dịch 2</li>
                          <li>
                            Số tài khoản: <strong>104870361932</strong>
                          </li>
                          <li>
                            <strong>Hotline hỗ trợ: 0898709170</strong>
                          </li>
                          <li>
                            <strong>Cú pháp chuyển khoản:</strong> [Tên cá nhân/tổ chức] + [SĐT mua hàng] + [mã thanh toán 6 kí tự] (nếu có)
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  {packageNew?.products?.length > 0 && packageNew?.products?.map((item, idx) => <div key={idx}>{renderItemProduct(item)}</div>)}
                  <div className="d-flex mt-16">
                    <Button className="btn-primary" block onClick={() => navigate('/check_package')}>
                      <div>Kiểm tra đơn hàng</div>
                      <div>
                        <AiOutlineCheckCircle />
                      </div>
                    </Button>
                    <Button className="btn-buy ml-8" block onClick={() => navigate('/home')}>
                      <div>Tiếp tục mua hàng</div>
                      <div>
                        <BsFillCartPlusFill />
                      </div>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          {stateStep !== 4 && (
            <div>
              <div className="box-shadow p-16 border-radius-16">
                <div className="d-flex justify-content-between mb-16 fw-700 fz-16">
                  <div>Tổng tiền tạm tính</div>
                  <div className="text-red">{sumPay}</div>
                </div>
                <Button className="btn-buy fw-500 fz-16 mb-8" style={{ height: 60, textTransform: 'uppercase' }} block onClick={() => handleNext()}>
                  Tiếp tục
                </Button>
                <Button className="btn-red fw-500 fz-16" style={{ height: 60, textTransform: 'uppercase' }} block>
                  <Link to="/home">Chọn sản phẩm khác</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Client>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...packageActions, ...cartActions }, dispatch) });
const mapStateToProps = state => ({ ...selectCart(state), ...selectAuth(state), ...selectPackage(state) });

export default connect(mapStateToProps, mapDispatchToProps)(Pay);
