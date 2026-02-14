import { Navigate, Outlet } from "react-router-dom";

const ModerationRoute = () => {
  const isModerator = Boolean(localStorage.getItem("moderator")) && localStorage.getItem("moderator"); 
  // or however you're storing auth
  return isModerator ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ModerationRoute;
