import React from "react";

function QuestOpenButton({ onClick }){
    return (
        <button 
            aria-label="open quests"
            onClick={onClick}
            style={styles.button}
        >
            <p style={styles.text}>Quests</p>
        </button>
    );
}

const styles = {
    button: {
        position: "absolute",
        bottom: "15vh",
        left: "50vw",
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

export default QuestOpenButton;