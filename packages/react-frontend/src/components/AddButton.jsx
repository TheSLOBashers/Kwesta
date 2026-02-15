function AddButton({ onClick }){
    return (
        <button 
            onClick={onClick}
            style={styles.button}
        >
            <p style={styles.text}>+</p>
        </button>
    );
}

const styles = {
    button: {
        position: "absolute",
        width: "60px",
        height: "60px",
        display: "flex",
        flexDirection: "column",
        background: "white",
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: 1000,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "100%",
        transition: "transform 0.2s",
    },
    text: {
        color: "#000000",
        margin: 0,
        fontSize: "3rem",
    }
};

export default AddButton;