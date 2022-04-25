import React, { useState } from 'react';
import { Input, Button, message as messageAntd, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Client } from 'components/layouts';
import { packageActions } from 'actions';
import { selectPackage } from 'selectors';
import dayjs from 'dayjs';

function CheckPackage(props) {
  const {
    actions,
    selectCheckPackage: { checkPackage },
  } = props;

  const [statePackage, setStatePackage] = useState({ phone_number: undefined, code_package: undefined });
  const { phone_number, code_package } = statePackage;

  const onChangeInput = e => setStatePackage({ ...statePackage, [e.target.name]: e.target.value });

  const onSubmitCheck = () => {
    if (!phone_number || !code_package) {
      return messageAntd.error('Bạn chưa nhập đầy đủ trường thông tin');
    }
    actions.checkPackage({ phone_number, code_package });
  };

  return (
    <Client footer={false}>
      <div className="border-radius-16 box-shadow" style={{ backgroundColor: '#eeeeeeee', padding: '16px', margin: '16px 0' }}>
        <h1 className="fw-700 text-center">KIỂM TRA THÔNG TIN ĐƠN HÀNG & TÌNH TRẠNG VẬN CHUYỂN</h1>
        <div className="d-flex justify-content-between ">
          <div style={{ flex: 1 }}>
            <strong>Số điện thoại:</strong> <Input name="phone_number" value={phone_number} onChange={onChangeInput} />
          </div>
          <div style={{ flex: 1, marginLeft: 16 }}>
            <strong>Mã đơn hàng:</strong> <Input name="code_package" value={code_package} onChange={onChangeInput} />
          </div>
        </div>
        <Button className="btn-buy mt-16" style={{ height: 36 }} onClick={() => onSubmitCheck()} block>
          KIỂM TRA
        </Button>
      </div>
      <Row gutter={8}>
        <Col span={12}>
          <div className="box-shadow p-16 border-radius-16">
            <div className="fz-16 text-upper fw-700">Thông tin người nhận</div>
            <div>
              <strong>Họ và tên:</strong> {checkPackage?.full_name}
            </div>
            <div>
              <strong>Số điện thoại:</strong> {checkPackage?.phone_number}
            </div>
            <div>
              <strong>Trạng thái: </strong>
              {checkPackage?.current_status_vi}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="box-shadow p-16 border-radius-16">
            <div className="fz-16 text-upper fw-700">Thông tin sản phẩm</div>
            <div>
              <strong>Sản phẩm:</strong>{' '}
              {checkPackage?.products?.map((item, idx) => (
                <span key={idx}>{item.name + ','}</span>
              ))}
            </div>
            <div>
              <strong>Giá trị:</strong> {checkPackage?.value}
            </div>
            <div>
              <strong>Thanh toán:</strong> {checkPackage?.is_pay}
            </div>
          </div>
        </Col>
      </Row>
      <div className="box-shadow p-16 border-radius-16 mt-16">
        <div className="fz-16 text-upper fw-700">Hành trình</div>
        {(checkPackage?.historys?.length > 0 &&
          checkPackage?.historys?.map(item => (
            <div className="mt-16">
              <Row>
                <Col span={6}>{item.status_vi}</Col>
                <Col span={12}>{item.note}</Col>
                <Col span={6}>{dayjs(item.createdAt).format('DD/MM/YYYY')}</Col>
              </Row>
            </div>
          ))) || <div>Hành trình đơn hàng chưa được cập nhật do chưa được xác nhận thanh toán</div>}
      </div>
    </Client>
  );
}
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...packageActions }, dispatch) });
const mapStateToProps = state => ({ ...selectPackage(state) });

export default connect(mapStateToProps, mapDispatchToProps)(CheckPackage);
