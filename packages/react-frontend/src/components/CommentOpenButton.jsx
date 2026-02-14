function CommentOpenButton({ onClick }){
    return (
        <button 
            onClick={onClick}
            style={styles.button}
        >
            <p style={styles.text}>Comments</p>
        </button>
    );
}

const styles = {
    button: {
        marginTop: "6px",
        width: "100px",
        height: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "12px",
        background: "white",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
        alignItems: "center",
    },
    text: {
        color: "#000000",
    }
};

export default CommentOpenButton;