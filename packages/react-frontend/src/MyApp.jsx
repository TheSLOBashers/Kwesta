// src/MyApp.jsx
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import NavBar from "./components/Navbar";
//import OverlayNavbar from "./components/OverlayNavbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import loginCall from "./APICalls/loginCall";
import signupCall from "./APICalls/signupCall";
import Protected from "./components/Protected"
import ProtectedRoute from "./components/PrivateRoute";
import AuthenticationRoute from "./components/AuthenticationRoute";
import ModerationRoute from "./components/ModerationRoute";
import ModerationPortal from "./components/ModerationPortal";
import ModerateUsers from "./components/ModerateUsers";
import ModerateComments from "./components/ModerateComments"
import Comments from "./components/Comments"
import AddModerator from "./components/AddModerator";

function MyApp() {

  const [user, setUser] = useState(null);

  return (
    <div className="container">
      <TopBar />

      <main style={{ paddingTop: "70px" }}>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route element={<AuthenticationRoute />}>
            <Route path="/Login" element={<Login handleSubmit={loginCall} setUser={setUser}/>} />
            <Route path="/Signup" element={<Signup handleSubmit={signupCall}/>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/Protected" element={<Protected />} />
            <Route path="/Comments" element = {<Comments user={user} />} />
          </Route>
          <Route element={<ModerationRoute />}>
            <Route path="/moderation/Portal" element={<ModerationPortal />} />
            <Route path="/moderation/users" element={<ModerateUsers />} />
            <Route path="/moderation/comments" element={<ModerateComments />} />
            <Route path="/moderation/add-moderator" element={<AddModerator />} />
          </Route>
        </Routes>

      </main>

      <NavBar />

    </div>
  );
}

//        <PrivateRoute component={Protected} path="/Protected" exact/>

export default MyApp;