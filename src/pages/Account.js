import React, { useState, useEffect } from 'react';
import { Row, Col, Avatar, Button, Input, message as messageAntd } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SaveOutlined } from '@ant-design/icons';

import { Client } from 'components/layouts';
import { selectAuth } from 'selectors';
import { authActions } from 'actions';

function Account(props) {
  const {
    actions: { editUser },
    selectAuthStatus: { user, requesting, success, message },
  } = props;

  const [state, setState] = useState({
    statusChange: 'information',
    fullName: user?.full_name,
    Email: user?.email,
    phoneNumber: user?.phone_number,
    password: '',
    newPassword: '',
    newPasswordRepeat: '',
  });
  const { statusChange, fullName, Email, phoneNumber, password, newPassword, newPasswordRepeat } = state;
  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setState({
      statusChange: 'information',
      fullName: user?.full_name,
      Email: user?.email,
      phoneNumber: user?.phone_number,
      password: '',
      newPassword: '',
      newPasswordRepeat: '',
    });
  }, [user]);

  useEffect(() => {
    notification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requesting]);

  const notification = () => {
    if (success && !requesting) {
      return messageAntd.success(message || 'Cập nhật thành công');
    } else if (!success && !requesting) return messageAntd.error(message || 'Cập nhật thất bại');
  };

  const onSubmitChangeInfor = () => {
    editUser({ user_id: user._id, email: Email, phone_number: phoneNumber, full_name: fullName });
  };

  const onSubmitChangePassword = () => {
    editUser({ user_id: user._id, new_password: newPassword, password: password, change_password: true });
  };

  return (
    <Client>
      <Row style={{ margin: '16px 0' }}>
        <Col span={6} style={{ padding: 16 }}>
          <div className="d-flex align-items-center justify-content-center">
            <Avatar size={60} />
            <div className="ml-8 fw-500">{user?.name}</div>
          </div>
          <div className="mt-16">
            <Button type="text" block onClick={() => setState({ ...state, statusChange: 'information' })}>
              Thông tin tài khoản
            </Button>
          </div>
          <div>
            <Button type="text" block onClick={() => setState({ ...state, statusChange: 'changePassword' })}>
              Đổi mật khẩu
            </Button>
          </div>
        </Col>
        <Col span={18} style={{ backgroundColor: 'white', padding: 16, minHeight: 'calc(100vh - 298px)' }}>
          {(statusChange === 'information' && (
            <>
              <div>
                <h1>Hồ Sơ Của Tôi</h1>
                <h4>Quản lý thông tin hồ sơ để bảo mật tài khoản</h4>
              </div>

              <div className="text">
                Tên đăng nhập: <span className="fw-500">{user?.name}</span>
              </div>
              <Row>
                <div className="text">Họ và Tên</div>
                <Input name="fullName" value={fullName} onChange={onChange} />
              </Row>
              <Row>
                <div className="text">Email</div>
                <Input name="Email" value={Email} onChange={onChange} />
              </Row>
              <Row>
                <div className="text">Số điện thoại</div>
                <Input name="phoneNumber" value={phoneNumber} onChange={onChange} />
              </Row>
              <Row className="mt-16">
                <Button className="btn-blue" icon={<SaveOutlined />} style={{ minWidth: 112 }} onClick={() => onSubmitChangeInfor()}>
                  Lưu
                </Button>
              </Row>
            </>
          )) ||
            (statusChange === 'changePassword' && (
              <>
                <Row>
                  <div className="text">Nhập mật khẩu cũ</div>
                  <Input type="password" name="password" value={password} onChange={onChange} />
                </Row>
                <Row>
                  <div className="text">Mật khẩu mới</div>
                  <Input type="password" name="newPassword" value={newPassword} onChange={onChange} />
                </Row>
                <Row>
                  <div className="text">Nhập lại mật khẩu mới</div>
                  <Input type="password" name="newPasswordRepeat" value={newPasswordRepeat} onChange={onChange} />
                </Row>
                <Row className="mt-16">
                  <Button className="btn-blue" icon={<SaveOutlined />} style={{ minWidth: 112 }} onClick={() => onSubmitChangePassword()}>
                    Thay đổi mật khẩu
                  </Button>
                </Row>
              </>
            ))}
        </Col>
      </Row>
    </Client>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...authActions }, dispatch) });
const mapStateToProps = state => ({ ...selectAuth(state) });

export default connect(mapStateToProps, mapDispatchToProps)(Account);
