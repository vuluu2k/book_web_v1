import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cartActions } from 'actions';

function ButtonCart({ cart, user_id, ...props }) {
  const {
    actions: { editCart },
  } = props;
  const [stateQuantity, setStateQuantity] = useState({
    quantity: cart.quantity,
  });
  const onChangeQuantity = event => {
    setStateQuantity({
      [event.target.name]: event.target.value,
    });
    editCart({ product_id: cart.product_id, name_option: cart.name_option, quantity: event.target.value, user_id });
  };
  const onClickUpdateQuantityUp = () => {
    setStateQuantity({
      quantity: quantity + 1,
    });
    editCart({ product_id: cart.product_id, name_option: cart.name_option, quantity: quantity + 1, user_id });
  };
  const onClickUpdateQuantityDown = () => {
    if (quantity === 1) {
      return;
    }
    setStateQuantity({
      quantity: quantity - 1,
    });
    editCart({ product_id: cart.product_id, name_option: cart.name_option, quantity: quantity - 1, user_id });
  };

  const { quantity } = stateQuantity;

  return (
    <div className="d-flex" style={{ border: '1px solid #ddd', maxWidth: 100, borderRadius: 8 }}>
      <Button
        icon={<MinusOutlined style={{ fontSize: 12 }} />}
        size="small"
        onClick={onClickUpdateQuantityDown}
        style={{ border: 'none', backgroundColor: 'transparent' }}
      />
      <Input
        type="text"
        id="quantityCart"
        name="quantity"
        value={quantity}
        onChange={onChangeQuantity}
        style={{ textAlign: 'center', border: 'none', backgroundColor: 'transparent' }}
        size="small"
      />
      <Button
        icon={<PlusOutlined style={{ fontSize: 12 }} />}
        size="small"
        onClick={onClickUpdateQuantityUp}
        style={{ border: 'none', backgroundColor: 'transparent' }}
      />
    </div>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...cartActions }, dispatch) });

export default connect(null, mapDispatchToProps)(ButtonCart);
