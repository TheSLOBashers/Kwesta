import { Link } from "react-router-dom";

function OverlayNavbar({ close }){
    return (
        <div style={styles.overlay} onClick={close}>
            <div
                style={styles.box}
                onClick={(e) => e.stopPropagation()}
            >
                <nav>
                    <ul style={styles.menuList}>
                        <li style={styles.menuItem}>
                        <Link to="/" style={styles.link} onClick={close}>Home</Link>
                        </li>
                        <li style={styles.menuItem}>
                        <Link to="/" style={styles.link} onClick={close}>Quests</Link>
                        </li>
                        <li style={styles.menuItem}>
                        <Link to="/" style={styles.link} onClick={close}>About</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
    },
    box: {
        backgroundColor: "#d4d4d4",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        minWidth: "300px",
    },
    menuList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        textAlign: "center",
    },
    menuItem: {
        margin: "50px 0",
    },
    link: {
        display: "block",
        padding: "2px 50px",
        borderRadius: "4px",
        backgroundColor: "#a5a5a5",
        color: "black",
        fontSize: "2rem",
        textDecoration: "none",
        textAlign: "center",
        minWidth: "260px",
    },
};

export default OverlayNavbar;