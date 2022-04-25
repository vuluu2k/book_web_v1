import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Input, Select, Upload, message as messageAntd } from 'antd';
import { CloseCircleOutlined, RollbackOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TableCustom } from 'components/Common';
import { getBase64 } from 'utils/file';
import { moneyMask } from 'utils/number';
import { ComfirmModal } from 'components/Common';
import { selectProduct } from 'selectors';
import validator from 'validator';

const { Option } = Select;

function ProductAddModal(props) {
  const { visible, onClose, categorys, createProduct, editProduct, productItem, deleteProduct, modalName } = props;
  const [stateDescription, setStateDescription] = useState({
    description: productItem?.description
      ? EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(productItem?.description).contentBlocks))
      : EditorState.createEmpty(),
  });

  const [state, setState] = useState({
    name: productItem?.name || '',
    category: productItem?.category || '',
    sub_category: productItem?.sub_category || '',
    status: productItem?.status || 'Mới',
    value: productItem?.value || 0,
    quantity: productItem?.quantity || 0,
    options: productItem?.options || [],
    name_option: '',
    value_option: '',
    profile: productItem?.profile || {
      screen_size: '',
      screen_technology: '',
      camera_font: '',
      camera_back: '',
      chipset: '',
      ram_capacity: 0,
      rom_capacity: 0,
      baterry: 0,
      sim_card: '',
      os: '',
      screen_pixel: '',
      weight: 0,
      bluetooth: '',
      scan_frequency: '',
    },
    fileList: [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    sub_categorys: [],
    visibleDel: false,
    description: '',
  });

  useEffect(() => {
    setState({
      name: productItem?.name || '',
      category: productItem?.category || '',
      sub_category: productItem?.sub_category || '',
      status: productItem?.status || 'Mới',
      value: productItem?.value || 0,
      quantity: productItem?.quantity || 0,
      options: productItem?.options || [],
      name_option: '',
      value_option: '',
      profile: productItem?.profile || {
        screen_size: '',
        screen_technology: '',
        camera_font: '',
        camera_back: '',
        chipset: '',
        ram_capacity: 0,
        rom_capacity: 0,
        baterry: 0,
        sim_card: '',
        os: '',
        screen_pixel: '',
        weight: 0,
        bluetooth: '',
        scan_frequency: '',
      },
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: productItem?.image_link || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
      sub_categorys: [],
    });
  }, [productItem]);

  const {
    name,
    category,
    sub_category,
    status,
    value,
    quantity,
    options,
    profile,
    name_option,
    value_option,
    fileList,
    profile: {
      screen_size,
      screen_technology,
      camera_font,
      camera_back,
      chipset,
      ram_capacity,
      rom_capacity,
      baterry,
      sim_card,
      os,
      screen_pixel,
      weight,
      bluetooth,
      scan_frequency,
    },
    sub_categorys,
    visibleDel,
  } = state;

  const { description } = stateDescription;

  const onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onChangeObj = e => {
    setState({ ...state, profile: { ...profile, [e.target.name]: e.target.value } });
  };

  const onEditorStateChange = description => {
    setStateDescription({
      description,
    });
    setState({
      ...state,
      description: draftToHtml(convertToRaw(description.getCurrentContent())),
    });
  };

  const onAddOption = () => {
    setState({ ...state, options: options.concat([{ name_option: name_option, value_option: value_option }]), name_option: '', value_option: '' });
  };

  const closeAddOption = item => {
    const option_filter = options.filter(option => option !== item);
    setState({ ...state, options: option_filter });
  };

  const onChangeSelect = (e, option) => {
    setState({ ...state, [option.name]: e });
    if (option.name === 'category') {
      const { sub_name } = categorys.find(item => item._id === e);
      setState({ ...state, [option.name]: e, sub_categorys: sub_name });
    }
  };

  const onChangeImage = ({ fileList: newFileList }) => {
    setState({ ...state, fileList: newFileList });
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await getBase64(file);
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const validate = () =>{
    if (validator.isEmpty(String(name))||
        validator.isEmpty(String(category))||
        validator.isEmpty(String(sub_categorys))||
        validator.equals(String(value),'0')||
        validator.equals(String(quantity),'0')||
        validator.isEmpty(String(profile.screen_pixel))||
        validator.isEmpty(String(profile.screen_technology))||
        validator.isEmpty(String(profile.screen_size))||
        validator.isEmpty(String(profile.camera_font))||
        validator.isEmpty(String(profile.camera_back))||
        validator.isEmpty(String(profile.chipset))||
        validator.isEmpty(String(profile.sim_card))||
        validator.isEmpty(String(profile.os))||
        validator.isEmpty(String(profile.bluetooth))||
        validator.equals(String(profile.ram_capacity),'0')||
        validator.equals(String(profile.rom_capacity,'0'))||
        validator.equals(String(profile.baterry,'0'))||
        validator.equals(String(profile.weight,'0'))||
        validator.isEmpty(String(profile.frequency))
    ){
      messageAntd.error('Bạn chưa nhập đủ trường dữ liệu')
      return false;
    }
    if (!validator.isNumeric(value)) {
       messageAntd.error('Nhập lại giá trị sản phẩm(kiểu số)')
      return false;
    }
    if (!validator.isNumeric(quantity)) {
       messageAntd.error('Nhập lại số lượng sản phẩm(kiểu số)')
      return false;
       
    }
    return true;
  }

  const onSubmitCreate = () => {
    if(validate()){
      createProduct({
        name,
        value,
        image: fileList[0].thumbUrl || fileList[0].url,
        status,
        quantity,
        category,
        sub_category,
        options,
        profile,
        description: state.description,
      });
      onClose();
      onClear();
    }
  };

  const onSubmitEdit = () => {
    if (validate()){
      editProduct({
        id: productItem?._id,
        name,
        value,
        image: fileList[0].thumbUrl || fileList[0].url,
        status,
        quantity,
        category,
        sub_category,
        options,
        profile,
        description: state.description,
      });
      onClose();
      onClear();
    }
  };

  const onShowConfirmModalDel = () => setState({ ...state, visibleDel: true });
  const onHiddenConfirmModalDel = () => setState({ ...state, visibleDel: false });

  const onSubmitDel = () => {
    deleteProduct({ id: productItem._id });
    onHiddenConfirmModalDel();
    onClose();
    onClear();
  };

  const onClear = () => {
    setState({
      name: '',
      category: '',
      sub_category: '',
      status: 'Mới',
      value: 0,
      quantity: 1,
      options: [],
      name_option: '',
      value_option: '',
      profile: {
        screen_size: '',
        screen_technology: '',
        camera_font: '',
        camera_back: '',
        chipset: '',
        ram_capacity: 0,
        rom_capacity: 0,
        baterry: 0,
        sim_card: '',
        os: '',
        screen_pixel: '',
        weight: 0,
        bluetooth: '',
        scan_frequency: '',
      },
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
      sub_categorys: [],
      description: '',
    });
    setStateDescription({
      description: Editor.createEmpty(),
    });
  };
  const styleTable = { padding: '4px 16px' };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onClose}
        title="THÊM SẢN PHẨM MỚI"
        width="95%"
        style={{ top: 20 }}
        footer={
          <>
            <Button icon={<RollbackOutlined />} className="btn-orange" onClick={onClose}>
              Quay lại
            </Button>
            {(modalName === 'detail' && (
              <>
                <Button className="btn-red" icon={<DeleteOutlined />} onClick={() => onShowConfirmModalDel()}>
                  Xóa sản phẩm
                </Button>
                <Button className="btn-green" icon={<EditOutlined />} onClick={() => onSubmitEdit()}>
                  Sửa sản sản phẩm
                </Button>
              </>
            )) || (
              <Button className="btn-blue" icon={<PlusOutlined />} onClick={() => onSubmitCreate()}>
                Thêm sản phẩm
              </Button>
            )}
          </>
        }>
        <div>
          <Row gutter={8} style={{ overflow: 'auto scroll', maxHeight: 'calc(100vh - 200px)' }}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <TableCustom title="Thông tin cơ bản sản phẩm" style={styleTable}>
                  <div className="text" style={{ marginTop: 0 }}>
                    Tên sản phẩm
                  </div>
                  <Input placeholder="Nhập tên sản phẩm" name="name" value={name} onChange={onChange} />
                  <div className="text">Ảnh sản phẩm</div>
                  <Upload listType="picture-card" fileList={fileList} onChange={onChangeImage} onPreview={onPreview} maxCount={1}>
                    {fileList.length < 5 && '+ Tải lên'}
                  </Upload>
                  <div className="text">Giá trị sản phẩm</div>
                  <Input placeholder="Nhập giá trị sản phẩm" name="value" value={value} onChange={onChange} />
                  <div className="text">Số lượng</div>
                  <Input placeholder="Nhập giá trị sản phẩm" name="quantity" value={quantity} onChange={onChange} />
                  <div className="text">Trạng thái</div>
                  <Select value={status} onChange={onChangeSelect} style={{ width: '100%', marginBottom: 16 }}>
                    <Option value="Mới" name="status">
                      Mới
                    </Option>
                    <Option value="Like New" name="status">
                      Like New
                    </Option>
                    <Option value="OTA" name="status">
                      OTA
                    </Option>
                  </Select>
                </TableCustom>
              </div>

              <div style={{ marginBottom: 16 }}>
                <TableCustom title="Danh mục" style={styleTable}>
                  <div className="text" style={{ marginTop: 0 }}>
                    Danh mục cha
                  </div>
                  <Select fieldNames="category" value={category} onChange={onChangeSelect} style={{ width: '100%', marginBottom: 16 }}>
                    {categorys.map(item => (
                      <Option key={item._id} value={item._id} name="category">
                        {item.name_vi}
                      </Option>
                    ))}
                  </Select>
                  <div>Danh mục con</div>
                  <Select value={sub_category} onChange={onChangeSelect} style={{ width: '100%', marginBottom: 16 }}>
                    {sub_categorys.map((item, idx) => (
                      <Option key={idx} value={item} name="sub_category">
                        {item}
                      </Option>
                    ))}
                  </Select>
                </TableCustom>
              </div>
              <div>
                <TableCustom title="Các cấu hình khác" style={styleTable}>
                  <div className="text" style={{ marginTop: 0 }}>
                    Tên cấu hình
                  </div>
                  <Input placeholder="Nhập tên cấu hình" name="name_option" value={name_option} onChange={onChange} />
                  <div>Giá trị</div>
                  <Input placeholder="Nhập giá trị" name="value_option" value={value_option} onChange={onChange} style={{ marginBottom: 8 }} />
                  <Button onClick={onAddOption} type="primary" block>
                    Thêm
                  </Button>

                  <Row gutter={15} style={{ marginBottom: 16, marginTop: 8 }}>
                    {options.map((item, idx) => (
                      <Col key={idx} span={8} style={{ marginBottom: 4 }}>
                        <div
                          className="d-flex align-items-center justify-content-between"
                          style={{ backgroundColor: '#ff2653', color: '#fff', padding: '4px 16px', borderRadius: 8 }}>
                          <div className="d-flex align-items-center justify-content-center flex-column">
                            <div className="fw-500">{item.name_option}</div>
                            <div>{moneyMask(item.value_option || 0)}</div>
                          </div>
                          <CloseCircleOutlined onClick={() => closeAddOption(item)} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </TableCustom>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <TableCustom title="Thông số sản phẩm" style={styleTable}>
                  <div className="text" style={{ marginTop: 0 }}>
                    Kích thước màn hình
                  </div>
                  <Input placeholder="Nhập kích thước màn hình" name="screen_size" value={screen_size} onChange={onChangeObj} />
                  <div className="text">Công nghệ màn hình</div>
                  <Input placeholder="Nhập công nghệ màn hình" name="screen_technology" value={screen_technology} onChange={onChangeObj} />
                  <div className="text">Camera</div>
                  <Input placeholder="Camera trước" name="camera_font" value={camera_font} onChange={onChangeObj} style={{ marginBottom: 4 }} />
                  <Input placeholder="Camera sau" name="camera_back" value={camera_back} onChange={onChangeObj} />
                  <div className="text">Chipset</div>
                  <Input placeholder="Chipset" name="chipset" value={chipset} onChange={onChangeObj} />
                  <div className="text">Ram</div>
                  <Input placeholder="Dung lượng ram" name="ram_capacity" value={ram_capacity} onChange={onChangeObj} />
                  <div className="text">Rom</div>
                  <Input placeholder="Dung lượng bộ nhớ trong" name="rom_capacity" value={rom_capacity} onChange={onChangeObj} />
                  <div className="text">Dung lượng pin</div>
                  <Input placeholder="Dung lượng pin" name="baterry" value={baterry} onChange={onChangeObj} />
                  <div className="text">Thẻ sim</div>
                  <Input placeholder="Thông tin thẻ sim" name="sim_card" value={sim_card} onChange={onChangeObj} />
                  <div className="text">Hệ điều hành</div>
                  <Input placeholder="Nhập hệ điều hành" name="os" value={os} onChange={onChangeObj} />
                  <div className="text">Độ phân giải màn hình</div>
                  <Input placeholder="Nhập độ phân giải màn hình" name="screen_pixel" value={screen_pixel} onChange={onChangeObj} />
                  <div className="text">Cân nặng</div>
                  <Input placeholder="Nhập cân nặng" name="weight" value={weight} onChange={onChangeObj} />
                  <div className="text">Bluetooth</div>
                  <Input placeholder="Nhập thông tin bluetooth" name="bluetooth" value={bluetooth} onChange={onChangeObj} />
                  <div className="text">Tần số quét</div>
                  <Input
                    placeholder="Nhập tần số quét"
                    name="scan_frequency"
                    value={scan_frequency}
                    onChange={onChangeObj}
                    style={{ marginBottom: 16 }}
                  />
                </TableCustom>
              </div>
            </Col>
            <Col span={24} style={{ marginTop: 16 }}>
              <TableCustom title="Mô tả sản phẩm" style={styleTable}>
                <div style={{ marginBottom: 16 }}>
                  <Editor
                    editorState={description}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    onEditorStateChange={onEditorStateChange}
                    editorStyle={{ height: '300px', border: '1px solid #CED4DA', borderRadius: '0.2em' }}
                  />
                </div>
              </TableCustom>
            </Col>
          </Row>
        </div>
      </Modal>
      <ComfirmModal visible={visibleDel} onClose={onHiddenConfirmModalDel} onSubmit={onSubmitDel} />
    </>
  );
}

const mapStateToProps = state => ({ ...selectProduct(state) });

export default connect(mapStateToProps, null)(ProductAddModal);
