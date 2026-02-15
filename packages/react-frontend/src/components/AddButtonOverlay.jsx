import { useState, useEffect, useRef } from "react";
import AddButton from "./AddButton";
import addCommentCall from "../APICalls/addCommentCall";
import addEventCall from "../APICalls/addEventCall";

import CommentForm from "./CommentForm";
import EventForm from "./EventForm";

function AddButtonOverlay( username="Anonymous" ){
    
    const [open, setOpen] = useState(false);
    const [formType, setFormType] = useState(null);
    const containerRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleAddComment = async (author, comment, date, time, location) => {
        const commentData = {author, comment, date, time, location};
        const result = await addCommentCall(commentData);
        console.log("Added comment:", result);
    };
    const handleAddEvent = async (author, description, date, time, location) => {
        const eventData = {author, description, date, time, location};
        const result = await addEventCall(eventData);
        console.log("Added event:", result);
    };

    return (
        <div
            ref={containerRef}
            style={styles.container}
        >
            <AddButton onClick={() => setOpen(!open)}/>
            <button 
                style={{
                ...styles.menuButton, 
                ...styles.commentButton,
                opacity: open ? 1 : 0,
                transform: open
                    ? "translate(-120%, -120%) scale(1.2)"
                    : "translate(0, 0) scale(0)",
                    pointerEvents: open ? "auto" : "none",
                }}
                onClick={() => {
                    setFormType("comment");
                    setOpen(false);
                }}
            >
                C
            </button>
            <button 
                style={{
                ...styles.menuButton, 
                ...styles.eventButton,
                opacity: open ? 1 : 0,
                transform: open
                    ? "translate(120%, -120%) scale(1.2)"
                    : "translate(0, 0) scale(0)",
                    pointerEvents: open ? "auto" : "none",
                }}
                onClick={() => {
                    setFormType("event");
                    setOpen(false);
                }}
            >
                E
            </button>

            {formType === "comment" && (
                <CommentForm
                    onSubmit={handleAddComment}
                    onClose={() => setFormType(null)}
                    username={username}
                />
            )}

            {formType === "event" && (
                <EventForm
                    onSubmit={handleAddEvent}
                    onClose={() => setFormType(null)}
                    username={username}
                />
            )}

        </div>
    );
}

const styles = {
    container: {
        position: "fixed",
        bottom: "20vh",
        right: "15vw",
        zIndex: 1000,
    },
    menuButton: {
        position: "absolute",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        top: "50%",
        left: "50%",
        transformOrigin: "center",
    },
    commentButton: {
        background: "#4CAF50",
    },
    eventButton: {
        background: "#2196F3",
    },
};

export default AddButtonOverlay;