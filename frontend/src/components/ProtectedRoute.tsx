import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{ children}</>;
};

export default ProtectedRoute;
