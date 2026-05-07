import { Navigate, Outlet } from "react-router-dom";

const MonitoringRoute = () => {
  const isAdmin = Boolean(localStorage.getItem("admin")) && localStorage.getItem("admin"); 
  const isAuthenticated = Boolean(
    localStorage.getItem("authToken")
  ); 
  // or however you're storing auth
  return isAdmin && isAuthenticated ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default MonitoringRoute;
