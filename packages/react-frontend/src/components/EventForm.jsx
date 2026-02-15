import { useState, useEffect, useRef } from "react";

function EventForm({ onSubmit, onClose, username }) {
    const formRef = useRef(null);
    const [description, setDescription] = useState("");

    const [location, setLocation] = useState({ lat: null, lng: null });

    const now = new Date();
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const time = now.toLocaleDateString([], { hour: '2-digit', minute: "2-digit"});

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ author: username, description, date, time, location});
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
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.submitButton}>Add Event</button>
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
    }
}

export default EventForm;