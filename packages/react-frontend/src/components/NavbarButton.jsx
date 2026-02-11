function NavbarButton({ onClick }){
    return (
        <button 
            onClick={onClick}
            style={styles.button}
        >
            <div style={styles.line}></div>
            <div style={styles.line}></div>
            <div style={styles.line}></div>
        </button>
    );
}

const styles = {
    button: {
        marginTop: "6px",
        width: "60px",
        height: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "12px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
    },

    line: {
        width: "100%",
        height: "6px",
        backgroundColor: "black",
        borderRadius: "2px",
    },
};

export default NavbarButton;