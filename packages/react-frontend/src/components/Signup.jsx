// components/Login.jsx
import { Link } from "react-router-dom";

function Signup(){
    return (
        <div>
            <h1>Signup</h1>
            <p>Here is where you would signup</p>
            <p>Already have an account? <Link to="/Login">Login</Link></p>
        </div>
    );
}

export default Signup;