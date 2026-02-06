import { Navigate, Outlet } from "react-router-dom";

const AuthenticationRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken")); 
  // or however you're storing auth

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default AuthenticationRoute;
