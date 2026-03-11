// src/MyApp.jsx
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import NavBar from "./components/Navbar";
//import OverlayNavbar from "./components/OverlayNavbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import loginCall from "./APICalls/loginCall";
import signupCall from "./APICalls/signupCall";
import getUserPointsCall from "./APICalls/getUserPointsCall";
import Protected from "./components/Protected";
import ProtectedRoute from "./components/PrivateRoute";
import AuthenticationRoute from "./components/AuthenticationRoute";
import ModerationRoute from "./components/ModerationRoute";
import ModerationPortal from "./components/ModerationPortal";
import ModerateUsers from "./components/ModerateUsers";
import ModerateComments from "./components/ModerateComments";
import ModerateQuests from "./components/ModerateQuests";
import UserFeed from "./components/UserFeed";
import AddModerator from "./components/AddModerator";
import AddQuest from "./components/AddQuest";
import MapPage from "./components/MapPage";
import AddComment from "./components/ModerationAddComment";

function MyApp() {
  const [user, setUser] = useState(
    () => localStorage.getItem("username") || null
  );
  const [userPoints, setUserPoints] = useState(0);

  const refreshUserPoints = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setUserPoints(0);
      return;
    }

    const points = await getUserPointsCall();
    setUserPoints(points);
  };

  useEffect(() => {
    refreshUserPoints();
  }, [user]);

  return (
    <div className="container">
      <TopBar userPoints={userPoints} />

      <main style={{ paddingTop: "70px" }}>
        <Routes>
          <Route
            path="/"
            element={
              <UserFeed
                user={user}
                onPointsChanged={refreshUserPoints}
              />
            }
          />
          <Route element={<AuthenticationRoute />}>
            <Route
              path="/Login"
              element={
                <Login
                  handleSubmit={loginCall}
                  setUser={setUser}
                />
              }
            />
            <Route
              path="/Signup"
              element={<Signup handleSubmit={signupCall} />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/Protected" element={<Protected />} />
            <Route
              path="/UserFeed"
              element={
                <UserFeed
                  user={user}
                  onPointsChanged={refreshUserPoints}
                />
              }
            />
          </Route>
          <Route element={<ModerationRoute />}>
            <Route
              path="/moderation/Portal"
              element={<ModerationPortal />}
            />
            <Route
              path="/moderation/users"
              element={<ModerateUsers />}
            />
            <Route
              path="/moderation/comments"
              element={<ModerateComments />}
            />
            <Route
              path="/moderation/quests"
              element={<ModerateQuests />}
            />
            <Route
              path="/moderation/add-moderator"
              element={<AddModerator />}
            />
            <Route
              path="/moderation/add-quest"
              element={<AddQuest />}
            />
            <Route
              path="/moderation/add-comment"
              element={<AddComment />}
            />
          </Route>
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>

      <NavBar />
    </div>
  );
}

//        <PrivateRoute component={Protected} path="/Protected" exact/>

export default MyApp;
