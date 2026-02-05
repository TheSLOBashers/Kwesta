// components/Navbar.jsx
import { Link } from "react-router-dom";

function NavBar(){
    return (
        <nav>
            <h1>Pages:</h1>
            <ul>
                <li>
                <Link to="/">Home</Link>
                </li>
                <li>
                <Link to="/">Quests</Link>
                </li>
                <li>
                <Link to="/">About</Link>
                </li>
                <li>
                <Link to="/Login">Login</Link>
                </li>
                <li>
                <Link to="/Signup">Signup</Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;