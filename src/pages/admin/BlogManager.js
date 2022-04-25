import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Card, Upload, Button, message as messageAntd, Image, Spin } from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Admin } from 'components/layouts';
import { TableCustom } from 'components/Common';
import { blogActions } from 'actions';
import { selectBlog } from 'selectors';
import { getBase64 } from 'utils/file';
import { ComfirmModal } from 'components/Common';

function BlogManager(props) {
  const {
    actions,
    selectBlogData: { blogs, requesting, message, success },
  } = props;

  const [stateAction, setStateAction] = useState({ type: 'post', blog: {} });
  const [stateVisibleDel, setStateVisibleDel] = useState(false);
  const [stateDescription, setStateDescription] = useState({
    description: EditorState.createEmpty(),
  });

  const [stateBlog, setStateBlog] = useState({
    title: '',
    type: 'home',
    fileList: [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    description: '',
  });

  useEffect(() => {
    actions.loadListBlog({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (blogs?.length > 0) {
      if (success && !requesting) return messageAntd.success(message || 'Cập nhật thành công');
      else if (!success && !requesting) return messageAntd.error(message || 'Cập nhật thất bại');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requesting]);

  const { title, type, fileList } = stateBlog;
  const { description } = stateDescription;

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

  const onShowConfirmModalDel = item => {
    setStateVisibleDel(true);
    setStateAction({ ...stateAction, blog: item });
  };
  const onHiddenConfirmModalDel = () => setStateVisibleDel(false);

  const onChangeInput = e => {
    setStateBlog({ ...stateBlog, [e.target.name]: e.target.value });
  };

  const onChangeImage = ({ fileList: newFileList }) => {
    setStateBlog({ ...stateBlog, fileList: newFileList });
  };

  const onEditorStateChange = description => {
    setStateDescription({
      description,
    });
    setStateBlog({
      ...stateBlog,
      description: draftToHtml(convertToRaw(description.getCurrentContent())),
    });
  };

  const onClear = () => {
    setStateBlog({
      title: '',
      type: 'home',
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
      description: '',
    });
    setStateDescription({
      description: EditorState.createEmpty(),
    });
  };

  const onSubmitCreate = () => {
    if (!title || !description) {
      return messageAntd.error('Vui lòng nhập đầy đủ trước khi đăng tin');
    }
    actions.createBlog({ title, image: fileList[0].thumbUrl || fileList[0].url, type, description: stateBlog.description });
    onClear();
  };

  const onSubmitEdit = () => {
    actions.editBlog({
      blog_id: stateAction?.blog?._id,
      title,
      image: fileList[0].thumbUrl || fileList[0].url,
      type,
      description: stateBlog.description,
    });
    setStateAction({ type: 'post', blog: {} });
    onClear();
  };

  const onSubmitDelete = () => {
    actions.deleteBlog({ blog_id: stateAction?.blog?._id });
    onHiddenConfirmModalDel();
  };

  const onEdit = item => {
    setStateBlog({
      title: item.title,
      type: item.type,
      description: item.description,
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: item?.image_link || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
    });
    setStateDescription({
      description: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(item?.description).contentBlocks)),
    });
    setStateAction({ type: 'edit', blog: item });
  };

  const onSubmit = () => {
    if (stateAction.type === 'post') {
      onSubmitCreate();
    } else {
      onSubmitEdit();
    }
  };

  const onChangePost = () => {
    setStateAction({ type: 'post', blog: {} });
    onClear();
  };

  return (
    <div className="blog-manager">
      <Admin title="Quản lí tin tức">
        <Spin spinning={requesting}>
          <TableCustom title="Đăng tin tức mới">
            <div className="d-flex">
              <Upload listType="picture-card" fileList={fileList} onChange={onChangeImage} onPreview={onPreview} maxCount={1}>
                {fileList.length < 5 && '+ Tải lên'}
              </Upload>
              <div style={{ flex: 'auto' }}>
                <Input name="title" value={title} onChange={onChangeInput} placeholder="Nhập tiêu đề tin tức của bạn" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Editor
                editorState={description}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                onEditorStateChange={onEditorStateChange}
                editorStyle={{ height: 'calc(100vh - 600px)', border: '1px solid #CED4DA', borderRadius: '0.2em' }}
              />
            </div>
            <Button onClick={() => onSubmit()} type="primary" style={{ marginBottom: 16 }}>
              {(stateAction.type === 'post' && 'Đăng tin') || 'Sửa tin'}
            </Button>
            {stateAction.type === 'edit' && (
              <Button type="primary" danger style={{ marginLeft: 8 }} onClick={() => onChangePost()}>
                Chuyển sang đăng tin
              </Button>
            )}
          </TableCustom>
          <div style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: 240 }}>
            <Row justify="flex-start" gutter={16}>
              {blogs?.length > 0 &&
                blogs.map((item, idx) => (
                  <Col sm={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} key={idx}>
                    <Card
                      style={{ marginTop: 16, ...(stateAction?.blog?._id === item._id ? { backgroundColor: '#c0c4cc' } : {}) }}
                      actions={[
                        <EditOutlined key="edit" onClick={() => onEdit(item)} />,
                        <DeleteOutlined key="delete" onClick={() => onShowConfirmModalDel(item)} />,
                      ]}>
                      <div className="d-flex">
                        <div>
                          <Image src={item.image_link} width={200} />
                        </div>
                        <div className="ml-8 fw-500 text-capitalize">{item.title}</div>
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        </Spin>

        <ComfirmModal visible={stateVisibleDel} onClose={onHiddenConfirmModalDel} onSubmit={() => onSubmitDelete()} />
      </Admin>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...blogActions }, dispatch) });
const mapStateToProps = state => ({ ...selectBlog(state) });
export default connect(mapStateToProps, mapDispatchToProps)(BlogManager);
