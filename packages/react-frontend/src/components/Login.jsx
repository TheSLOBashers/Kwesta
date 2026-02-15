// components/Login.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

function Login(props) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: ""
  });
  async function submitForm() {
    setUserDetails({ username: "", password: "" });
    try {
        await props.handleSubmit(
            userDetails["username"],
            userDetails["password"],
            setError,
            setIsLoading
        );

        setUser(userDetails["username"]);
        navigate("/", { replace: true });
    }
    catch (error) {
        console.log(error.msg);
    }
  }
  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "password")
      setUserDetails({
        username: userDetails["username"],
        password: value
      });
    else
      setUserDetails({
        username: value,
        password: userDetails["password"]
      });
  }

  return (
    <div>
      <h1>Login</h1>
      <p>Here is where you would login</p>
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
      <ThreeDots
        height="40"
        width="40"
        color="#000000"
        visible={isLoading}
      />
      <p style={{ color: "red", fontWeight: "bold" }} >{error === "" ? "" : error}</p>
      <p>
        Don't have an account? <Link to="/Signup">Signup</Link>
      </p>
    </div>
  );
}

export default Login;
