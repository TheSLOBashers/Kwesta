import { Navigate, Outlet } from "react-router-dom";

const AuthenticationRoute = () => {
  const isAuthenticated = Boolean(
    localStorage.getItem("authToken")
  );
  const isModerator =
    Boolean(localStorage.getItem("moderator")) &&
    localStorage.getItem("moderator");

  // or however you're storing auth

  return !isAuthenticated ? (
    <Outlet />
  ) : isModerator ? (
    <Navigate to="/moderation/Portal" replace />
  ) : (
    <Navigate to="/" replace />
  );
};

export default AuthenticationRoute;
