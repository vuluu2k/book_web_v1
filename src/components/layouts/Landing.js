import React from 'react';
import { Navigate } from 'react-router-dom';
import { USER } from 'constants';

export default function Landing() {
  const loaclUserInformation = localStorage.getItem(USER);
  const userInformation = JSON.parse(loaclUserInformation);
  if (userInformation && userInformation.user.role !== 0) {
    return <Navigate to="/dashboard" />;
  }
  return <Navigate to="/home" />;
}
