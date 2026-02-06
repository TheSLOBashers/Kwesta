// components/Login.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

function Login(props) {

    const [userDetails, setUserDetails] = useState({
        username: "",
        password: ""
    });
    function submitForm() {
        props.handleSubmit(userDetails["username"], userDetails["password"]);
        setUserDetails({ username: "", password: "" });
    }
    function handleChange(event) {
        const { name, value } = event.target;
        if (name === "password")
            setUserDetails({ username: userDetails["username"], password: value });
        else setUserDetails({ username: value, password: userDetails["password"] });
    }

    return (
        <div>
            <h1>Login</h1>
            <p>Here is where you would login</p>
            <div>
                <form>
                    <label htmlFor="username">username</label>
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
                    <input type="button" value="Submit" onClick={submitForm} />
                </form>
            </div>
            <p>Don't have an account? <Link to="/Signup">Signup</Link></p>
        </div>
    );
}

export default Login;