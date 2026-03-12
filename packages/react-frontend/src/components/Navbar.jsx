// components/Navbar.jsx
import { Link } from "react-router-dom";

function NavBar(){
    return (
        <nav>
            <h1 style={styles.link}>Pages:</h1>
            <ul style={styles.link}>
                <li>
                <Link to="/">Home</Link>
                </li>
                <li>
                <Link to="/">Quests</Link>
                </li>
                <li>
                <Link to="/About">About</Link>
                </li>
                <li>
                <Link to="/Login">Login</Link>
                </li>
                <li>
                <Link to="/Signup">Signup</Link>
                </li>
                <li>
                    <Link to="/map">Map Page</Link>
                </li>
            </ul>
        </nav>
    );
}

const styles = {
    link: {
        fontFamily: "Acephimere"
    }
}

export default NavBar;