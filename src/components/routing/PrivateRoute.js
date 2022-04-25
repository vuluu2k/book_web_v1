import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { USER } from 'constants';

const PrivateRoute = () => {
  const localUser = localStorage.getItem(USER);
  const User = (localUser && JSON.parse(localUser)) || null;
  if (User && User.user.role === 0) {
    return <Navigate to="/" />;
  }
  return User ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
