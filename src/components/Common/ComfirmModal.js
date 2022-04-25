import React from 'react';
import { Modal, Button } from 'antd';

export default function ComfirmModal(props) {
  const { title, visible, onClose, content, item, onSubmit } = props;
  return (
    <Modal
      title={title || 'Thông báo xác nhận!'}
      visible={visible}
      onCancel={onClose}
      footer={
        <>
          <Button onClick={onClose} type="primary">
            Quay lại
          </Button>
          <Button onClick={onSubmit} type="primary" danger>
            Xác nhận
          </Button>
        </>
      }>
      {content || <div className="d-flex fw-500 w-100 justify-content-center">Bạn có chắc chắn muốn xóa {item || ''}?</div>}
    </Modal>
  );
}
