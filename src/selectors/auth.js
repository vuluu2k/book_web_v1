import { createSelector } from 'reselect';

const selectAuthDomain = () => state => state.auth;

const selectRegisterStatus = createSelector(selectAuthDomain(), substate => substate.statusRegister);
const selectLoginStatus = createSelector(selectAuthDomain(), substate => substate.statusLogin);
const selectAuthStatus = createSelector(selectAuthDomain(), substate => substate.auth);
const selectListAuth = createSelector(selectAuthDomain(), substate => substate.list_auth);

const selectAuth = createSelector(
  selectRegisterStatus,
  selectLoginStatus,
  selectAuthStatus,
  selectListAuth,

  (selectRegisterStatus, selectLoginStatus, selectAuthStatus, selectListAuth) => ({
    selectRegisterStatus,
    selectLoginStatus,
    selectAuthStatus,
    selectListAuth,
  })
);

export { selectRegisterStatus, selectLoginStatus, selectAuthStatus, selectListAuth };

export default selectAuth;
