import React from "react";
import { useState, useEffect, useRef } from "react";

function QuestForm({ onSubmit, onClose, username, clickedLocation }) {
    const formRef = useRef(null);
    const [text, setText] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [points, setPoints] = useState(0);
    const [location, setLocation] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        setLocation(clickedLocation)
    }, [clickedLocation]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !text || !date || !time) return;

        const questData = {
            description: text,
            points,
            date,
            time,
            location
        }

        onSubmit(questData);
        onClose();
    };

    return (
        <div style={styles.formOverlay}>
            <form ref={formRef} style={styles.form} onSubmit={handleSubmit}>
                <button onClick={onClose} type={"button"}>
                    X
                </button>
                <input
                    placeholder="Description"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={styles.input}
                />
                <input
                    placeholder="Points"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    style={styles.input}
                />
                <input
                    data-testid="date input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={styles.calendarInput}
                />
                <input
                    data-testid="time input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={styles.calendarInput}
                />
                <button aria-label="submit event" type="submit" style={styles.submitButton}>Add Quest</button>
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
    calendarInput: {
        padding: "6px 10px",
        fontSize: "0.9rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "#333333",
        color: "#818080",
        textAlign: "center",
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

export default QuestForm;