import React, { useState, useEffect } from 'react';
import { Input, Checkbox, Form, message as messageAntd } from 'antd';
import { Navigate } from 'react-router-dom';

export default function Login(props) {
  const [state, setState] = useState({ username: '', password: '' });
  const { username, password } = state;
  const {
    actions: { login },
    selectLoginStatus: { message },
    selectAuthStatus: { isAuthenticated, requesting, success },
  } = props;

  useEffect(() => {
    notification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const notification = () => {
    if (success && !requesting) {
      return messageAntd.success(message || 'Đăng ký thành công');
    } else if (!success && !requesting && message !== '') return messageAntd.error(message || 'Đăng ký thất bại');
    return;
  };

  const onClear = () => setState({ username: '', password: '' });

  const onSubmit = () => {
    if (!username || !password || username === '' || password === '') {
      messageAntd.error('Bạn chưa nhập tài khoản mật khẩu');
    }
    login({ username, password });
    onClear();
  };

  if (isAuthenticated) return <Navigate to="/product-manager" />;

  return (
    <div>
      <Form name="basic" initialValues={{ remember: false }} autoComplete="off">
        <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}>
          <Input placeholder="Tài khoản" name="username" value={username} onChange={onChange} />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password placeholder="Mật khẩu" name="password" value={password} onChange={onChange} />
        </Form.Item>

        {/* <Form.Item name="remember" valuePropName="checked">
          <Checkbox className="d-flex mt-8">Nhớ mật khẩu</Checkbox>
        </Form.Item> */}

        <div className="btn-switch on" style={{ margin: '16px 12px 0' }} onClick={() => onSubmit()}>
          Đăng nhập
        </div>
      </Form>
    </div>
  );
}
