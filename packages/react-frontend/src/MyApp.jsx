// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./components/About";

function MyApp() {
  //const [characters, setCharacters] = useState([]);

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
        <Route path="/Login" element={<Login/>} />
        <Route path="/Signup" element={<Signup/>} />
        <Route path="/About" element={<About/>} />
        {/*<Route
          path="/users-table"
          element={
            <Table
              characterData={characters}
              removeCharacter={removeOneCharacter}
            />
          }
        />
        <Route path="/form" element={<Form handleSubmit={updateList} />} />
        */}
      </Routes>
    </div>
  );
}
export default MyApp;