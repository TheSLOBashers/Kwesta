import React from "react";

function EventOpenButton({ onClick }){
    return (
        <button 
            aria-label="open events"
            onClick={onClick}
            style={styles.button}
        >
            <p style={styles.text}>Events</p>
        </button>
    );
}

const styles = {
    button: {
        position: "absolute",
        bottom: "0vh",
        left: "30vw",
        width: "100px",
        height: "40px",
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        background: "white",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
        alignItems: "center",
        fontFamily: "Acephimere",
    },
    text: {
        color: "#000000",
    }
};

export default EventOpenButton;