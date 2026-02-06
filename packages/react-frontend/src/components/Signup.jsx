// components/Login.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

function Signup(props) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: ""
  });
  function submitForm() {
    props.handleSubmit(
      userDetails["username"],
      userDetails["email"],
      userDetails["password"]
    );
    setUserDetails({ username: "", email: "", password: "" });
  }
  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "password")
      setUserDetails({
        username: userDetails["username"],
        email: userDetails["email"],
        password: value
      });
    else if (name === "email")
      setUserDetails({
        username: userDetails["username"],
        email: value,
        password: userDetails["password"]
      });
    else
      setUserDetails({
        username: value,
        email: userDetails["email"],
        password: userDetails["password"]
      });
  }

  return (
    <div>
      <h1>Signup</h1>
      <p>Here is where you would signup</p>
      <div>
        <form>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={userDetails.username}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={userDetails.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            id="password"
            value={userDetails.password}
            onChange={handleChange}
          />
          <input
            type="button"
            value="Submit"
            onClick={submitForm}
          />
        </form>
      </div>
      <p>
        Already have an account? <Link to="/Login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
