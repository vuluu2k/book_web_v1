import React, { useEffect } from 'react';
import { Table, Button, Select, message as messageAntd } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RedoOutlined, LoadingOutlined, DeleteOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons';

import { Admin } from 'components/layouts';
import { packageActions } from 'actions';
import { selectPackage } from 'selectors';
import { TableCustom } from 'components/Common';

const { Option } = Select;

function PackageManager(props) {
  const {
    actions,
    selectListPackage: { viewPackage, requesting, message, success },
  } = props;

  useEffect(() => {
    actions.loadListPackage({ isAccess: ' ' });
  }, []);

  useEffect(() => {
    if (viewPackage?.length > 0) {
      if (message === 'Tải dữ liệu đơn hàng thành công') return;
      if (success && !requesting) return messageAntd.success(message || 'Cập nhật thành công');
      else if (!success && !requesting) return messageAntd.error(message || 'Cập nhật thất bại');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requesting]);

  const columns = [
    {
      title: 'Mã đơn',
      key: '_id',
      dataIndex: '_id',
      render: (_, item) => <div>{item._id}</div>,
    },
    {
      title: 'Tên khách hàng',
      key: 'full_name',
      dataIndex: 'full_name',
      render: (_, item) => <div>{item.full_name}</div>,
    },
    {
      title: 'Số điện thoại',
      key: 'phone_number',
      dataIndex: 'phone_number',
    },
    {
      title: 'Sản phẩm',
      key: 'products',
      dataIndex: 'products',
      render: (_, item) => {
        return (
          <div>
            {item.products.map((a, idx) => (
              <span key={idx}>{`${a.name}(${a.quantity}) ,`}</span>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Trạng thái',
      key: 'current_status_vi',
      dataIndex: 'current_status_vi',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      dataIndex: 'actions',
      render: (_, item) => (
        <div>
          <div>
            {!item.isAccess && (
              <Button
                onClick={() => actions.acceptPackage({ package_id: item._id })}
                className="btn-green ml-8"
                size="small"
                icon={<CheckCircleOutlined />}
              />
            )}

            {!item.isAccess && (
              <Button onClick={() => actions.deletePackage({ id: item._id })} className="btn-red ml-8" size="small" icon={<DeleteOutlined />} />
            )}
          </div>
          <div className="mt-8">
            <Button
              onClick={() => window.open(`tel:${item.phone_number}`, '_self')}
              className="btn-blue ml-8"
              size="small"
              icon={<PhoneOutlined />}
            />
            <Button onClick={() => window.open(`mailto:${item.email}`, '_self')} className="btn-orange ml-8" size="small" icon={<MailOutlined />} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Admin title="Quản lí đơn hàng">
      <TableCustom
        title="Thông tin đơn hàng"
        refesh={
          <Button
            onClick={() => actions.loadListPackage({})}
            style={{ borderRadius: 8 }}
            icon={(requesting && <LoadingOutlined />) || <RedoOutlined />}
          />
        }>
        <Select defaultValue="" style={{ width: '20%' }} onChange={e => actions.loadListPackage({ isAccess: e })}>
          <Option value="">Tất cả</Option>
          <Option value={true}>Đã xác thực</Option>
          <Option value={false}>Chưa xác thực</Option>
        </Select>
        <Table columns={columns} dataSource={viewPackage} loading={requesting} rowKey={record => record._id} scroll={{ y: 'calc(100vh - 350px)' }} />
      </TableCustom>
    </Admin>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...packageActions }, dispatch) });
const mapStateToProps = state => ({ ...selectPackage(state) });

export default connect(mapStateToProps, mapDispatchToProps)(PackageManager);
