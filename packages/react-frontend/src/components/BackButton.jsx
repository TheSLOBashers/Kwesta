import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function BackButton() {
    const nav = useNavigate();

    return (
        <Button onClick={() => nav(-1)} style={{ background: "#0ea5e9", border: "none", fontWeight: "1200", borderRadius: "20px", padding: "8px 16px", margin: "0", width: "fit-content", fontSize: "20px", justifyContent: "center", display: "flex", alignItems: "center", textAlign: "center" }}>
            {"←"}
        </Button>
    );
}

export default BackButton;