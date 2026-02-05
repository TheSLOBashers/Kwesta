// components/Login.jsx
import { Link } from "react-router-dom";

function Login(){
    return (
        <div>
            <h1>Login</h1>
            <p>Here is where you would login</p>
            <p>Don't have an account? <Link to="/Signup">Signup</Link></p>
        </div>
    );
}

export default Login;