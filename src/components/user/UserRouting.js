import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { authActions, categoryActions } from 'actions';
import { selectAuth, selectCategory } from 'selectors';

function UserRouting({ children, ...rest }) {
  const {
    actions: { loadUser, loadListCategory },
  } = rest;

  useEffect(
    () => {
      loadUser();
      loadListCategory();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <div>{children}</div>;
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...authActions, ...categoryActions }, dispatch) });
const mapStateToProps = state => ({ selectAuth: selectAuth(state), selectCategory: selectCategory(state) });

export default connect(mapStateToProps, mapDispatchToProps)(UserRouting);
