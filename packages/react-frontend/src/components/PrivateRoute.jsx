import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token")); 
  // or however you're storing auth

  return isAuthenticated ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ProtectedRoute;
