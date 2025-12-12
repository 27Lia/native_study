import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {!isAuthenticated ? (
        <Navigate to="/login" />
      ) : (
        <div>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default AuthLayout;
