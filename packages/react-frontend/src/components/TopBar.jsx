import React from "react";
import { useState } from "react";
import NavbarButton from "./NavbarButton";
import OverlayNavbar from "./OverlayNavbar";

function TopBar({ userPoints }) {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = Boolean(
    localStorage.getItem("authToken")
  );

  return (
    <>
      <header style={styles.bar}>
        <h1 style={styles.title}>Kwesta</h1>
        <div style={styles.rightSection}>
          <div style={styles.pointsSection}>
            <span style={styles.pointsLabel}>User Points:</span>
            <span style={styles.pointsValue}>
              {isAuthenticated ? userPoints : 0}
            </span>
          </div>
          <NavbarButton onClick={() => setIsOpen(!isOpen)} />
        </div>
      </header>

      {isOpen && (
        <OverlayNavbar close={() => setIsOpen(false)} />
      )}
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
    backgroundColor: "rgb(213, 215, 206)",
    //backgroundColor: "linear-gradient(90deg,rgba(213, 215, 206, 1) 0%, rgba(198, 219, 160, 1) 51%, rgba(52, 54, 46, 0.75) 100%);",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 100px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    zIndex: 999
  },

  title: {
    margin: 0,
    fontSize: "3rem",
    color: "#223040",
    fontFamily: "MeltSwashes",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px"
  },
  pointsSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#223040",
    fontWeight: "600"
  },
  pointsLabel: {
    fontSize: "1rem",
    fontFamily: "Acephimere",
  },
  pointsValue: {
    fontSize: "1.1rem"
  }
};

export default TopBar;
