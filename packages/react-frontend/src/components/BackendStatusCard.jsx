import pingBackend from "../APICalls/pingBackend";
import { useEffect, useState } from "react";

function BackendStatusCard(props) {

    const [status, setStatus] = useState("Checking...");
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkBackendStatus = async () => {
            try {
                const response = await pingBackend();
                if (response && response.status === 200) {
                    setStatus("✅ Backend up!");
                } else {
                    console.log(response);
                    setStatus("❌ Backend down.");
                }
            } catch (err) {
                setStatus("❌ Backend down.");
                setError(err.message);
            }
        };
        checkBackendStatus();
    }, []);

    const cardStyle = {
        background: "#ffffff",
        borderRadius: "16px",
        margin: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
    };

    const styles = {
        dash_option: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "left",
            textAlign: "left",
            flex: 1,
            border: "4px solid #8b8b8b",
            borderRadius: "5px",
            width: props.width,
            margin: "1rem",
            background: "white",
            fontFamily: "Times New Roman",
        },
        hr: {
            width: "100%",
            border: "2px solid #8b8b8b",
            margin: "0"
        },
        item: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
            textAlign: "left",
            flex: 1,
        },
        button: {
            width: "100%",
            padding: "1rem",
            border: "none",
            background: "white",
            color: "#8b8b8b",
            fontFamily: "Times New Roman",
            textAlign: "left",
        },
        title: {
            fontFamily: "Times New Roman",
            color: "#8b8b8b",
            textAlign: "left",
            padding: "0.5rem",
        }

    }

    return (
        <div style={cardStyle}>
            <h6 style={{ fontWeight: "600", color: "#0f172a", padding: "10px", marginTop: "0.5em" }}>
                Backend Status
            </h6>

            <p style={{ color: "#475569", padding: "10px" }}>
                {status}
            </p>
            {error && (
                <p style={{ color: "#dc2626", fontWeight: "600", padding: "10px" }}>
                    Error: {error}
                </p>
            )}

        </div>);
}

export default BackendStatusCard;
