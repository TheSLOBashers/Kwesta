import { Navigate, Outlet } from "react-router-dom";

const ModerationRoute = () => {
  const isModerator = Boolean(localStorage.getItem("moderator")) && localStorage.getItem("moderator"); 
  const isAuthenticated = Boolean(
    localStorage.getItem("authToken")
  ); 
  // or however you're storing auth
  return isModerator && isAuthenticated ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ModerationRoute;
