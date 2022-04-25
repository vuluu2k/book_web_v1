import React, { useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RedoOutlined, LoadingOutlined, DeleteOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

import { Admin } from 'components/layouts';
import { TableCustom } from 'components/Common';
import { selectAuth } from 'selectors';
import { authActions } from 'actions';

const { Search } = Input;

function AccountManager(props) {
  const {
    actions,
    selectListAuth: { message, success, requesting, auths },
  } = props;

  useEffect(() => {
    actions.loadListUser({});
  }, []);

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      dataIndex: 'stt',
      render: (_, item, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên tài khoản',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Họ tên',
      key: 'full_name',
      align: 'center',
      dataIndex: 'full_name',
    },
    {
      title: 'Số điện thoại',
      key: 'phone_number',
      dataIndex: 'phone_number',
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      dataIndex: 'actions',
      render: (_, item) => (
        <div>
          <Button onClick={() => window.open(`tel:${item.phone_number}`, '_self')} className="btn-blue ml-8" size="small" icon={<PhoneOutlined />} />
          <Button onClick={() => window.open(`mailto:${item.email}`, '_self')} className="btn-orange ml-8" size="small" icon={<MailOutlined />} />
          <Button onClick={() => actions.deleteUser({ id: item._id })} className="btn-red ml-8" size="small" icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];

  return (
    <Admin title="Quản lý tài khoản">
      <TableCustom
        title="Tài khoản khách hàng"
        refesh={
          <Button
            onClick={() => actions.loadListUser({})}
            style={{ borderRadius: 8 }}
            icon={(requesting && <LoadingOutlined />) || <RedoOutlined />}
          />
        }
        search={
          <Search
            placeholder={`Nhập tên tài khoản`}
            style={{ width: 400 }}
            onChange={e => actions.loadListUser({ name: e.target.value })}
            onSearch={e => actions.loadListUser({ name: e })}
            allowClear
          />
        }>
        <Table className="data-custom" dataSource={auths} columns={columns} loading={requesting} rowKey={record => record._id} />
      </TableCustom>
    </Admin>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...authActions }, dispatch) });
const mapStateToProps = state => ({ ...selectAuth(state) });

export default connect(mapStateToProps, mapDispatchToProps)(AccountManager);
