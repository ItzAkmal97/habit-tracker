import { Navigate } from "react-router";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isLoggedIn,
}) => {
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
