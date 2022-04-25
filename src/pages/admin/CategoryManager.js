import React, { useState } from 'react';
import { Table, Button, Modal, Input, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Admin } from 'components/layouts';
import { TableCustom, ComfirmModal } from 'components/Common';
import { categoryActions } from 'actions';
import { selectCategory } from 'selectors';

function CategoryManager(props) {
  const [state, setState] = useState({
    visibleCreate: false,
    visibleEdit: false,
    visibleDelete: false,
    name: '',
    sub_name: '',
    sub_name_array: [],
    id: undefined,
  });

  const { visibleCreate, visibleEdit, visibleDelete, name, sub_name, sub_name_array, id } = state;
  const { selectCategoryInformation, actions } = props;
  const { categorys } = selectCategoryInformation;

  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleAddSubName = () => {
    if (sub_name === '') {
      message.error('Thêm danh mục chưa được nhập gì cả nhé v:');
      return;
    }
    setState({ ...state, sub_name_array: sub_name_array.concat([sub_name]), sub_name: '' });
  };
  const handleCloseSubName = item => {
    const filter = sub_name_array.filter(a => a !== item);
    setState({ ...state, sub_name_array: filter });
  };

  const onShowCreate = () => setState({ ...state, visibleCreate: true });
  const onHideCreate = () => {
    setState({ ...state, visibleCreate: false });
    onClear();
  };

  const onShowDelete = () => setState({ ...state, visibleDelete: true });
  const onHideDelete = () => setState({ ...state, visibleDelete: false });

  const onShowEdit = item => setState({ ...state, visibleEdit: true, name: item.name_vi, sub_name_array: item.sub_name, id: item._id });
  const onHideEdit = () => {
    setState({ ...state, visibleEdit: false });
    onClear();
  };

  const onClear = () => {
    setState({ name: '', sub_name: '', sub_name_array: [], id: undefined });
  };

  const onSubmitCreate = () => {
    actions.createCategory({ name: name, name_vi: name, sub_name: sub_name_array });
    onHideCreate();
  };

  const onSubmitEdit = () => {
    actions.editCategory({ id: id, name: name, name_vi: name, sub_name: sub_name_array });
    onHideEdit();
  };

  const onSubmitDelete = id => {
    actions.deleteCategory({ id });
    onHideDelete();
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      dataIndex: 'stt',
      render: (_, item, index) => <div>{index + 1} </div>,
    },
    {
      title: 'Tên danh mục',
      key: 'name',
      dataIndex: 'name',
      render: (_, item) => <div>{item.name_vi}</div>,
    },
    {
      title: 'Số lượng danh mục con',
      key: 'length',
      align: 'center',
      dataIndex: 'length',
      render: (_, item) => <div>{item.sub_name.length}</div>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      dataIndex: 'actions',
      render: (_, item) => (
        <div>
          <Button className="btn-green" size="small" icon={<EditOutlined />} onClick={() => onShowEdit(item)} />
          <Button className="btn-red ml-8" size="small" icon={<DeleteOutlined />} onClick={() => onShowDelete()} />
          <ComfirmModal visible={visibleDelete} onClose={() => onHideDelete()} onSubmit={() => onSubmitDelete(item._id)} />
        </div>
      ),
    },
  ];

  return (
    <Admin title="Danh mục">
      <TableCustom title="Thông tin danh mục">
        <Button icon={<PlusOutlined />} className="mb-8 btn-blue" onClick={() => onShowCreate()}>
          Thêm danh mục
        </Button>
        <Table className="data-custom" columns={columns} dataSource={categorys} rowKey={record => record._id} size="small" />
      </TableCustom>
      <Modal
        wrapClassName="modal-add-category"
        title="Thêm danh mục"
        visible={visibleCreate}
        onCancel={() => onHideCreate()}
        footer={
          <>
            <Button className="btn-orange" onClick={() => onHideCreate()}>
              Quay lại
            </Button>
            <Button className="btn-blue" onClick={() => onSubmitCreate()}>
              Thêm danh mục
            </Button>
          </>
        }>
        <Input placeholder="Nhập tên danh mục" name="name" value={name} onChange={onChange} />
        <div className="d-flex mt-8 mb-8">
          <Input placeholder="Thêm tên danh mục con" name="sub_name" value={sub_name} onChange={onChange} onPressEnter={handleAddSubName} />
          <Button className="btn-blue ml-8" icon={<PlusOutlined />} onClick={handleAddSubName} />
        </div>
        <Row gutter={8}>
          {sub_name_array.map((item, index) => (
            <Col span={8} key={index}>
              <div
                className="d-flex justify-content-between"
                style={{ padding: '4px 8px', backgroundColor: '#d6e4ff', marginBottom: 8, borderRadius: 8 }}>
                <div>{item}</div>
                <div>
                  <CloseCircleOutlined onClick={() => handleCloseSubName(item)} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Modal>

      <Modal
        wrapClassName="modal-add-category"
        title={`Sửa danh mục ${name}`}
        visible={visibleEdit}
        onCancel={() => onHideEdit()}
        footer={
          <>
            <Button className="btn-orange" onClick={() => onHideEdit()}>
              Quay lại
            </Button>
            <Button className="btn-blue" onClick={() => onSubmitEdit()}>
              Lưu danh mục
            </Button>
          </>
        }>
        <Input placeholder="Nhập tên danh mục" name="name" value={name} onChange={onChange} />
        <div className="d-flex mt-8 mb-8">
          <Input placeholder="Thêm tên danh mục con" name="sub_name" value={sub_name} onChange={onChange} onPressEnter={handleAddSubName} />
          <Button className="btn-blue ml-8" icon={<PlusOutlined />} onClick={handleAddSubName} />
        </div>
        <Row gutter={8}>
          {sub_name_array.map((item, index) => (
            <Col span={8} key={index}>
              <div
                className="d-flex justify-content-between"
                style={{ padding: '4px 8px', backgroundColor: '#d6e4ff', marginBottom: 8, borderRadius: 8 }}>
                <div>{item}</div>
                <div>
                  <CloseCircleOutlined onClick={() => handleCloseSubName(item)} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Modal>
    </Admin>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...categoryActions }, dispatch) });
const mapStateToProps = state => ({
  ...selectCategory(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryManager);
