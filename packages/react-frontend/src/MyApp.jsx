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
import AuthenticationRoute from "./components/AuthenticationRoute";
import ModerationRoute from "./components/ModerationRoute";
import ModerationPortal from "./components/ModerationPortal";
import ModerateUsers from "./components/ModerateUsers";
import ModerateComments from "./components/ModerateComments";
import ModerateQuests from "./components/ModerateQuests";
import AddModerator from "./components/AddModerator";
import AddQuest from "./components/AddQuest";
import AddComment from "./components/ModerationAddComment";
import AboutPage from "./components/AboutPage";
import EntryPage from "./components/EntryPage";

function MyApp() {
  const [user, setUser] = useState(
    () => localStorage.getItem("username") || null
  );

  return (
    // <TopBar userPoints={userPoints} />
    <div className="top-container">

      <main>
        <Routes>
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
          <Route path="/About" element={<AboutPage />} />
          <Route path="/" element={<EntryPage />} />
        </Routes>
      </main>

      <NavBar />
    </div>
  );
}

//        <PrivateRoute component={Protected} path="/Protected" exact/>

export default MyApp;
