import { createSelector } from 'reselect';

const selectProductDomain = () => state => state.product;

const selectProductInformation = createSelector(selectProductDomain(), substate => substate.productInfomation);
const selectProductInformationHome = createSelector(selectProductDomain(), substate => substate.productInfomationHome);
const selectProductItem = createSelector(selectProductDomain(), substate => substate.productItem);

const selectProduct = createSelector(
  selectProductInformation,
  selectProductInformationHome,
  selectProductItem,

  (selectProductInformation, selectProductInformationHome, selectProductItem) => ({
    selectProductInformation,
    selectProductInformationHome,
    selectProductItem,
  })
);

export { selectProductInformation, selectProductInformationHome, selectProductItem };

export default selectProduct;
