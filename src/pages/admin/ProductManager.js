import React, { useEffect, useState } from 'react';
import { Table, Image, Button, Tooltip, Cascader, Tag, message as messageAntd, Input, Select } from 'antd';
import { RedoOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Admin } from 'components/layouts';
import { TableCustom } from 'components/Common';
import { ProductAddModal } from 'components/product';
import { productActions } from 'actions';
import { selectProduct, selectCategory } from 'selectors';

const { Search } = Input;
const { Option } = Select;

const filterName = [
  { key: 'name', name: 'Tên sản phẩm' },
  { key: 'category', name: 'Danh mục cha' },
  { key: 'sub_category', name: 'Danh mục con' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'product_id', name: 'Mã sản phẩm' },
];

function ProductManager(props) {
  const [state, setState] = useState({ visibleAdd: false, visibleProduct: false, productItem: {} });
  const [stateOptionSearch, setStateOptionSearch] = useState('name');

  const {
    actions: { loadListProduct, createProduct, editProduct, deleteProduct },
    selectProductInformation: { products, requesting, dataSearch, success, message },
    selectCategoryInformation: { categorys },
  } = props;

  const { visibleAdd, visibleProduct, productItem } = state;

  const onShowAdd = () => setState({ ...state, visibleAdd: true });
  const onHidenAdd = () => setState({ ...state, visibleAdd: false, visibleProduct: false });

  useEffect(() => {
    loadListProduct({});
  }, []);

  useEffect(() => {
    if (products?.length > 0) {
      if (message === 'Thành công tải lên danh sách') return;
      if (success && !requesting) return messageAntd.success(message || 'Cập nhật thành công');
      else if (!success && !requesting) return messageAntd.error(message || 'Cập nhật thất bại');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requesting]);

  const options = [
    {
      value: 'category',
      label: 'Danh mục',
      children: categorys.map(item => {
        return {
          value: item._id,
          label: item.name,
          children: item.sub_name.map(sub_item => {
            return {
              value: sub_item,
              label: sub_item,
            };
          }),
        };
      }),
    },
    {
      value: 'status',
      label: 'Trạng thái',
      children: [
        {
          value: 'Mới',
          label: 'Mới',
        },
        {
          value: 'Like New',
          label: 'Like New',
        },
        {
          value: 'OTA',
          label: 'OTA',
        },
      ],
    },
  ];

  const columns = [
    {
      title: 'Mã',
      key: '_id',
      dataIndex: '_id',
      render: (_, item) => <div>{item._id}</div>,
    },
    {
      title: 'Ảnh sản phẩm',
      key: 'length',
      dataIndex: 'length',
      render: (_, item) => (
        <div>
          <Image width={90} src={item.image_link} />
        </div>
      ),
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Danh mục',
      key: 'category',
      dataIndex: 'category',
      render: (_, item) => {
        const category = categorys.find(c => c._id === item.category);
        return <div>{category?.name_vi}</div>;
      },
    },
    {
      title: 'Danh mục con',
      key: 'sub_category',
      dataIndex: 'sub_category',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      align: 'center',
      dataIndex: 'quantity',
    },
  ];

  const handleFilterProduct = e => {
    if (e?.length > 0 && e[0] === 'category') loadListProduct({ ...dataSearch, category: e[e.length - 2], sub_category: e[e.length - 1] });
    if (e?.length > 0 && e[0] === 'status') loadListProduct({ ...dataSearch, status: e[e.length - 1] });
  };

  const filterNameEntoVi = key => {
    const finder = filterName.find(item => item.key === key);
    return finder.name;
  };

  const filterNameCategory = id => {
    const category = categorys.find(item => item._id === id);
    return category.name_vi;
  };

  return (
    <Admin title="Quản lí sản phẩm">
      <TableCustom
        title="Danh sách sản phẩm"
        refesh={
          <Button
            onClick={() => loadListProduct({ ...dataSearch })}
            style={{ borderRadius: 8 }}
            icon={(requesting && <LoadingOutlined />) || <RedoOutlined />}
          />
        }
        search={
          <div className="d-flex">
            <Select
              defaultValue="name"
              style={{ textTransform: 'capitalize' }}
              value={stateOptionSearch}
              onChange={e => {
                setStateOptionSearch(e);
              }}>
              <Option value="name">Theo Tên</Option>
              <Option value="id">Theo Mã</Option>
            </Select>
            <Search
              placeholder={`Nhập ${stateOptionSearch === 'name' ? 'tên' : 'mã'} sản phẩm muốn tìm kiếm`}
              style={{ width: 400 }}
              onChange={e => {
                if (stateOptionSearch === 'name') loadListProduct({ ...dataSearch, name: e.target.value });
                else loadListProduct({ ...dataSearch, product_id: e.target.value });
              }}
              onSearch={e => {
                if (stateOptionSearch === 'name') loadListProduct({ ...dataSearch, name: e });
                else loadListProduct({ ...dataSearch, product_id: e });
              }}
              allowClear
            />
          </div>
        }>
        <div className="d-flex mb-16">
          <Cascader options={options} value={['Lọc nâng cao']} onChange={e => handleFilterProduct(e)} maxTagCount="responsive" />

          <div className="d-flex ml-8">
            {Object.keys(dataSearch).map(
              item =>
                dataSearch[item] &&
                dataSearch[item] !== 'undefined' &&
                !['page_size', 'page_number', 'page_entries', 'page_totals'].includes(item) && (
                  <Tag
                    className="d-flex align-items-center justify-content-center"
                    onClose={() => loadListProduct({ ...dataSearch, [item]: undefined })}
                    style={{ height: 32 }}
                    closable
                    color="processing">
                    <span>{filterNameEntoVi(item)}</span>: {(item === 'category' && filterNameCategory(dataSearch[item])) || dataSearch[item]}
                  </Tag>
                )
            )}
          </div>
        </div>

        <Table
          className="data-custom"
          columns={columns}
          loading={requesting}
          scroll={{ y: 'calc(100vh - 350px)' }}
          dataSource={products}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setState({ ...state, productItem: record, visibleProduct: true });
              },
            };
          }}
          rowKey={record => record._id}
          size="small"
          pagination={{ position: ['bottomLeft'] }}
        />
      </TableCustom>

      <div style={{ position: 'fixed', bottom: 20, right: 16 }}>
        <Tooltip placement="left" title="Thêm sản phẩm">
          <Button shape="circle" icon={<PlusOutlined />} size="large" style={{ backgroundColor: '#1890ff', color: '#fff' }} onClick={onShowAdd} />
        </Tooltip>
      </div>
      {visibleAdd && <ProductAddModal visible={visibleAdd} onClose={onHidenAdd} categorys={categorys} createProduct={createProduct} />}

      {visibleProduct && (
        <ProductAddModal
          visible={visibleProduct}
          onClose={onHidenAdd}
          categorys={categorys}
          productItem={productItem}
          editProduct={editProduct}
          deleteProduct={deleteProduct}
          modalName="detail"
        />
      )}
    </Admin>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...productActions }, dispatch) });
const mapStateToProps = state => ({ ...selectProduct(state), ...selectCategory(state) });

export default connect(mapStateToProps, mapDispatchToProps)(ProductManager);
