// src/MyApp.jsx
//import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import loginCall from "./APICalls/loginCall";
import Protected from "./components/Protected"
import ProtectedRoute from "./components/PrivateRoute";

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

  return (
    <div className="container">
      <NavBar />

      <Routes>
        <Route path="/" element={<h3>Welcome Home!</h3>} />
        <Route path="/Login" element={<Login handleSubmit={loginCall}/>} />
        <Route path="/Signup" element={<Signup/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/Protected" element={<Protected />} />
        </Route>
      </Routes>
    </div>
  );
}

//        <PrivateRoute component={Protected} path="/Protected" exact/>

export default MyApp;