import React from "react";

function CommentOpenButton({ onClick }){
    return (
        <button 
            aria-label="open comments"
            onClick={onClick}
            style={styles.button}
        >
            <p style={styles.text}>Comments</p>
        </button>
    );
}

const styles = {
    button: {
        position: "absolute",
        bottom: "15vh",
        left: "10vw",
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

export default CommentOpenButton;