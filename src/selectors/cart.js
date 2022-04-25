import { createSelector } from 'reselect';

const selectCartDomain = () => state => state.cart;

const selectCartInformation = createSelector(selectCartDomain(), substate => substate.cartInfomation);
const selectVisibleCart = createSelector(selectCartDomain(), substate => substate.visibleCart);

const selectCart = createSelector(
  selectCartInformation,
  selectVisibleCart,

  (selectCartInformation, selectVisibleCart) => ({
    selectCartInformation,
    selectVisibleCart,
  })
);

export { selectCartInformation, selectVisibleCart };

export default selectCart;
