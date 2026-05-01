// components/Navbar.jsx
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <nav style={styles.nav}>
            <h1 style={styles.title}>Kwesta</h1>
            <div style={styles.links}>
                <div style={styles.item}>
                    <h5 style={styles.title}>Kwesta</h5>
                    <ul style={styles.list}>
                        <li>
                            <Link style={styles.link} to="/">Home</Link>
                        </li>
                        <li>
                            <Link style={styles.link} to="/About">About</Link>
                        </li>
                    </ul>
                </div>

                <div style={styles.item}>
                    <h5 style={styles.title}>Authentication</h5>
                    <ul style={styles.list}>
                        <li>
                            <Link style={styles.link} to="/Login">Login</Link>
                        </li>
                        <li>
                            <Link style={styles.link} to="/Signup">Signup</Link>
                        </li>
                    </ul>
                </div>

                <div style={styles.item}>
                    <h5 style={styles.title}>Moderation</h5>
                    <ul style={styles.list}>
                        <li>
                            <Link style={styles.link} to="/moderation/Portal">Portal</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <p style={styles.text}>© 2026 Slo Bashers - All rights reserved</p>
            <p style={styles.text}>A project started by students at Cal Poly SLO!</p>
        </nav>
    );
}

const styles = {
    links: {
        fontFamily: "Acephimere",
        display: "flex",
        flexDirection: "row",
        flex: 1,
        padding: "0 1rem",
    },
    list: {
        fontFamily: "Acephimere",
        color: "#fff",
        listStyleType: "none",
        margin: "0 0rem",
    },
    item: {
        margin: "0 7em",
        
        flex: 1,
    },
    link: {
        color: "#fff",
    },
    text: {
        fontFamily: "Times New Roman",
        margin: "0.5rem 0",
    },
    nav: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#212121",
        color: "#fff",
        fontFamily: "Acephimere"
    },
    title: {
        fontFamily: "Acephimere",
    }
}

export default NavBar;