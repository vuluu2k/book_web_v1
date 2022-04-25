import { createSelector } from 'reselect';

const selectPackageDomain = () => state => state.package;

const selectListPackage = createSelector(selectPackageDomain(), substate => substate.list_package);
const selectCheckPackage = createSelector(selectPackageDomain(), substate => substate.check_package);
const selectListTurnover = createSelector(selectPackageDomain(), substate => substate.list_turnover);

const selectPackage = createSelector(
  selectListPackage,
  selectCheckPackage,
  selectListTurnover,

  (selectListPackage, selectCheckPackage, selectListTurnover) => ({
    selectListPackage,
    selectCheckPackage,
    selectListTurnover,
  })
);

export { selectListPackage, selectCheckPackage, selectListTurnover };

export default selectPackage;
