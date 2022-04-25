import { createSelector } from 'reselect';

const selectCategoryDomain = () => state => state.category;

const selectCategoryInformation = createSelector(selectCategoryDomain(), substate => substate.categoryInfomation);

const selectCategory = createSelector(
  selectCategoryInformation,

  selectCategoryInformation => ({
    selectCategoryInformation,
  })
);

export { selectCategoryInformation };

export default selectCategory;
