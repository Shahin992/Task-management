import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { user, hydrated } = useSelector((state) => state.auth);

  if (!hydrated) {
    return null;
  }

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/user'} replace />;
  }

  return children;
};

export default PublicRoute;
