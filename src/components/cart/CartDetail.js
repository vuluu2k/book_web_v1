import React from 'react';
import { connect } from 'react-redux';
import { CloseCircleOutlined } from '@ant-design/icons';
import { bindActionCreators } from 'redux';

import { selectCart } from 'selectors';
import { cartActions } from 'actions';
import { moneyMask } from 'utils/number';
import { selectAuth } from 'selectors';
import { ButtonCart } from 'components/cart';

function CartDetail(props) {
  const {
    actions: { deleteCart },
    selectCartInformation: { products },
    selectAuthStatus,
    screen,
  } = props;

  const renderItem = item => {
    return (
      <div className="box-shadow p-16 mb-16 cart-detail" style={{ borderRadius: 16 }}>
        <div className="d-flex">
          <div>
            <img src={item.image_link} alt={item.name} width={160} height={160} />
          </div>
          <div className="ml-8 w-100">
            <div className="d-flex justify-content-between w-100 fw-700 fz-16">
              {item.name} ({item.name_option})
              <div>
                <CloseCircleOutlined
                  className="cursor-pointer"
                  onClick={() => deleteCart({ product_id: item.product_id, name_option: item.name_option, user_id: selectAuthStatus?.user?._id })}
                />
              </div>
            </div>
            <div className="text-red fw-700 fz-16">{moneyMask(item.value_option)}</div>
            <div className="d-flex align-items-center">
              <div className="fw-500">Chọn số lượng:</div>
              <div className="ml-4">
                <ButtonCart cart={item} user_id={selectAuthStatus?.user?._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (screen === 'page') {
    return <>{products?.length > 0 && products.map((item, idx) => <div key={idx}>{renderItem(item)}</div>)}</>;
  }

  return (
    <>
      {(products?.length > 0 &&
        products.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 8, backgroundColor: '#f0f0f0', padding: 4 }}>
            <div className="d-flex w-100">
              <div>
                <img src={item.image_link} alt={item.name_option} width="80" height="80" />
              </div>
              <div className="ml-4 w-100">
                <div className="d-flex justify-content-between fw-500 w-100">
                  <div>
                    {item.name} x {item.quantity}
                  </div>
                  <div>
                    <CloseCircleOutlined
                      className="cursor-pointer"
                      onClick={() => deleteCart({ product_id: item.product_id, name_option: item.name_option, user_id: selectAuthStatus?.user?._id })}
                    />
                  </div>
                </div>
                <div>{item.name_option}</div>
                <div className="fw-500" style={{ color: '#D70018 ' }}>
                  {moneyMask(item.value_option)}
                </div>
              </div>
            </div>
          </div>
        ))) || <div className="h-100 d-flex align-items-center w-100 justify-content-center">Chưa có sản phẩm nào trong giỏ hàng</div>}
    </>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...cartActions }, dispatch) });
const mapStateToProps = state => ({ ...selectCart(state), ...selectAuth(state) });

export default connect(mapStateToProps, mapDispatchToProps)(CartDetail);
