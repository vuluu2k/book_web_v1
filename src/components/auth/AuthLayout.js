import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Login from './Login';
import Register from './Register';

import authActions from 'actions/auth';
import { selectAuth } from 'selectors';

function AuthLayout(props) {
  const [status, setStatus] = useState(true);
  const onButtonLogin = () => setStatus(true);
  const onButtonRegister = () => setStatus(false);

  return (
    <div className="auth container">
      <div className="dark-overlay">
        <div className="auth-inner">
          <div style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column' }}>
            <h3>Đăng nhập để mua sách ngay trong ngày hôm nay</h3>
            <div className="mt-16" style={{ width: 400 }}>
              {(status && <Login {...props} />) || <Register {...props} onButtonLogin={onButtonLogin} statusBtn={status} />}
              {(status&& <div className="mt-16" >Bạn chưa có tài khoản? <span onClick={()=>onButtonRegister()} className="fw-500 cursor-pointer" style={{color:'blue'}}>Đăng ký ngay!</span></div>||<div className="mt-16" >Bạn đã có tài khoản? <span onClick={()=>onButtonLogin()} className="fw-500 cursor-pointer" style={{color:'blue'}}>Đăng nhập ngay!</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(authActions, dispatch) });

export default connect(selectAuth, mapDispatchToProps)(AuthLayout);
