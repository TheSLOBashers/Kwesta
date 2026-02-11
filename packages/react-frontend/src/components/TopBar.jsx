import { useState } from "react";
import NavbarButton from "./NavbarButton";
import OverlayNavbar from "./OverlayNavbar";

function TopBar(){
    const [isOpen, setIsOpen] = useState(false);

    return(
        <>
            <header style={styles.bar}>
                <h1 style={styles.title}>Kwesta</h1>
                <NavbarButton onClick={() => setIsOpen(!isOpen)} />
            </header>

            {isOpen && <OverlayNavbar close={() => setIsOpen(false)} />}
        </>
    );
}

const styles = {
    bar: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "70px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 100px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        zIndex: 999,
    },

    title: {
        margin: 0,
        fontSize: "3rem",
        color: "#334f74"
    },
};

export default TopBar;