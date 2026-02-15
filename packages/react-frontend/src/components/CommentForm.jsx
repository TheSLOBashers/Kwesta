import { useState, useEffect, useRef } from "react";

function CommentForm({ onSubmit, onClose, username }) {
    const formRef = useRef(null);
    const [text, setText] = useState("");
    const [location, setLocation] = useState({ lat: null, lng: null });

    const now = new Date();
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const time = now.toLocaleDateString([], { hour: '2-digit', minute: "2-digit"});

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log("Error getting location:", error);
                    setLocation({ lat: 0, lng: 0 });
                }
            );
        } else {
            console.log("Geolocation not supported");
            setLocation({ lat: 0, lng: 0 });
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ author: username, text, date, time, location });
        onClose();
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div style={styles.formOverlay}>
            <form ref={formRef} style={styles.form} onSubmit={handleSubmit}>
                <input 
                    placeholder="Comment"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.submitButton}>Add Comment</button>
            </form>
        </div>
    );
}

const styles = {
    formOverlay: {
        position: "fixed",
        bottom: "80px",
        right: "10vw",
        background: "rgba(255,255,255,0.95)",
        padding: "12px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 1001,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    input: {
        padding: "6px 10px",
        fontSize: "0.9rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    submitButton: {
        padding: "8px",
        background: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
}

export default CommentForm;