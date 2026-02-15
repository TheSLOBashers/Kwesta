// src/MyApp.jsx
import { useState, useEffect } from "react";
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

import CommentOverlay from "./components/CommentOverlay";
import CommentOpenButton from "./components/CommentOpenButton";
import getCommentsCall from "./APICalls/getCommentsCall";

import AddButtonOverlay from "./components/AddButtonOverlay";

function MyApp() {

  const [comments, setComments] = useState([]);
  const [commentIsOpen, setCommentIsOpen] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const data = await getCommentsCall();
      setComments(data);
      setLoading(false);
    };

    fetchComments();
  }, []);

  const sampleComments = [
    {
      id: 1,
      author: "Jimmy",
      date: "2/13/26",
      time: "2:00PM",
      comment: "Awesome sauce",
      location: {lat:500, lng:500},
    },
    {
      id: 2,
      author: "Timmy",
      date: "2/12/26",
      time: "4:14PM",
      comment: "Swag sauce",
      location: {lat:200, lng:90},
    },
    {
      id: 3,
      author: "Paul",
      date: "2/14/26",
      time: "1:02AM",
      comment: "Wassup",
      location: {lat:100, lng:700},
    },
    {
      id: 4,
      author: "Alex",
      date: "2/13/26",
      time: "6:41PM",
      comment: "Cool",
      location: {lat:2, lng:3},
    },
  ]

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
          </Route>
          <Route element={<ModerationRoute />}>
            <Route path="/moderation/Portal" element={<ModerationPortal />} />
          </Route>
        </Routes>

        <NavBar />

        <>
          {loading && <div>Loading comments...</div>}
          <CommentOpenButton onClick={() => setCommentIsOpen(!commentIsOpen)} />

          {/* Replace 'sampleComments' with 'comments' when backend is finished */}
          {commentIsOpen && <CommentOverlay comments={sampleComments} close={() => setCommentIsOpen(false)} />}
        </>

        <AddButtonOverlay username={user}/>

      </main>

    </div>
  );
}

//        <PrivateRoute component={Protected} path="/Protected" exact/>

export default MyApp;