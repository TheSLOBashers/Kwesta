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
    try {
      await props.handleSubmit(
        userDetails["username"],
        userDetails["password"],
        setError,
        setIsLoading
      );
      const isModerator =
        Boolean(localStorage.getItem("moderator")) &&
        localStorage.getItem("moderator");
      localStorage.setItem("username", userDetails.username);
      props.setUser(userDetails.username);
      setUserDetails({ username: "", password: "" });
      if (isModerator) {
        navigate("/moderation/Portal", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error.message);
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
    <div style={styles.page}>
      <h1 style={styles.title}>Login</h1>
      <p style={styles.text}>Here is where you would login</p>
      <div>
        <form>
          <label htmlFor="username" style={styles.title}>Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={userDetails.username}
            onChange={handleChange}
          />
          <label htmlFor="password" style={styles.title}>Password</label>
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
            style={styles.title}
          />
        </form>
      </div>
      <ThreeDots
        height="40"
        width="40"
        color="#000000"
        visible={isLoading}
      />
      <p style={{ color: "red", fontWeight: "bold" }}>
        {error === "" ? "" : error}
      </p>
      <p style={styles.text}>
        Don't have an account? <Link to="/Signup">Signup</Link>
      </p>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  title: {
    fontFamily: "Cocogoose",
  },
  text: {
    fontFamily: "Acephimere",
  }
}

export default Login;
