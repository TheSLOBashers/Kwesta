// src/MyApp.jsx
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import NavBar from "./components/Navbar";
import OverlayNavbar from "./components/OverlayNavbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import loginCall from "./APICalls/loginCall";
import signupCall from "./APICalls/signupCall";
import Protected from "./components/Protected"
import ProtectedRoute from "./components/PrivateRoute";
import AuthenticationRoute from "./components/AuthenticationRoute";

import CommentOverlay from "./components/CommentOverlay";
import CommentOpenButton from "./components/CommentOpenButton";

function MyApp() {

  /*function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }*/

  /*useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, []);
  */

  const [comments, setComments] = useState([]);
  const [commentIsOpen, setCommentIsOpen] = useState(false);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setComments(json["comments"]))
      .catch((error) => { console.log(error); });
  }, []);

  const sampleComments = [
    {
      id: 1,
      user: "Jimmy",
      text: "Awesome sauce",
    },
    {
      id: 2,
      user: "Timmy",
      text: "Swag sauce",
    },
    {
      id: 3,
      user: "Paul",
      text: "Wassup",
    },
    {
      id: 4,
      user: "Alex",
      text: "Cool",
    },
  ]

  return (
    <div className="container">
      <TopBar />

      <main style={{ paddingTop: "70px" }}>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route element={<AuthenticationRoute />}>
            <Route path="/Login" element={<Login handleSubmit={loginCall}/>} />
            <Route path="/Signup" element={<Signup handleSubmit={signupCall}/>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/Protected" element={<Protected />} />
          </Route>
        </Routes>

        <NavBar />

        <CommentOpenButton onClick={() => setCommentIsOpen(!commentIsOpen)} />
        {commentIsOpen && <CommentOverlay style={{ paddingTop: "70px" }} comments={sampleComments} close={() => setCommentIsOpen(false)} />}

      </main>

    </div>
  );
}

//        <PrivateRoute component={Protected} path="/Protected" exact/>

export default MyApp;