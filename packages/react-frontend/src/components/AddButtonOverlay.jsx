import React from "react";
import { useState, useEffect, useRef } from "react";
import { act } from "react";
import AddButton from "./AddButton";

import CommentForm from "./CommentForm";
import EventForm from "./EventForm";
import QuestForm from "./QuestForm";

function AddButtonOverlay({ username = "Anonymous", onAddComment, onAddEvent, onAddQuest, clickedLocation, setShowClickMarkers }) {

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

    useEffect(() => {
        if (formType === "event" || formType === "quest") {
            setShowClickMarkers(true);
        }
        else {
            setShowClickMarkers(false)
        }

    }, [formType])

    return (
        <div
            ref={containerRef}
            style={styles.container}
        >
            <AddButton onClick={() => setOpen(!open)} />
            <button
                aria-label="add comment"
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
                aria-label="add event"
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
            {Boolean(localStorage.getItem("moderator")) && localStorage.getItem("moderator") ?
                <button
                    aria-label="add quest"
                    style={{
                        ...styles.menuButton,
                        ...styles.questButton,
                        opacity: open ? 1 : 0,
                        transform: open
                            ? "translate(0%, -210%) scale(1.2)"
                            : "translate(0, 0) scale(0)",
                        pointerEvents: open ? "auto" : "none",
                    }}
                    onClick={() => {
                        setFormType("quest");
                        setOpen(false);
                    }}
                >
                    Q
                </button>
                :
                null
            }

            {formType === "comment" && (
                <CommentForm
                    onSubmit={async (commentData) => {
                        await onAddComment(commentData);
                        act(() => {
                            setFormType(null);
                        });
                    }}
                    onClose={() => setFormType(null)}
                    username={username}
                />
            )}

            {formType === "event" && (
                <EventForm
                    onSubmit={async (eventData) => {
                        await onAddEvent(eventData);
                        act(() => {
                            setFormType(null);
                        });
                    }}
                    onClose={() => setFormType(null)}
                    username={username}
                    clickedLocation={clickedLocation}
                />
            )}

            {formType === "quest" && (
                <QuestForm
                    onSubmit={async (questData) => {
                        await onAddQuest(questData);
                        act(() => {
                            setFormType(null);
                        });
                    }}
                    onClose={() => setFormType(null)}
                    username={username}
                    clickedLocation={clickedLocation}
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
    questButton: {
        background: "#f3c221",
    },
};

export default AddButtonOverlay;