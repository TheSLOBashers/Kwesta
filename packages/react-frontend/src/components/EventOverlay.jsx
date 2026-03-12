import React from "react";
import { useRef, useState, useEffect } from "react";
import joinEvent from "../APICalls/joinEvent";
import unjoinEvent from "../APICalls/unjoinEvent";

function EventOverlay({ close, events = [], setEvents, onPointsChanged }){
    const carouselRef = useRef(null);
    const [active, setActive] = useState(0);

    function handleJoin(eventId) {
        joinEvent(eventId)
            .then(async () => {
                // Update the local state to reflect the change
                setEvents(prevEvents =>
                prevEvents.map(e =>
                    e.id === eventId ? { ...e, joined: true } : e
                )
                );
                if (onPointsChanged) {
                await onPointsChanged();
                }
                alert("Successfully joined event!");
            })
            .catch(error => {
                alert("Error joining event: " + error.message);
            });
    }

    function handleUnjoin(eventId) {
        unjoinEvent(eventId)
        .then(() => {
            setEvents(prevEvents =>
            prevEvents.map(e =>
                e.id === eventId ? { ...e, joined: false } : e
            )
            );
            alert("Successfully unjoined event!");
        })
        .catch(error => {
            alert("Error joining event: " + error.message);
        });
    }

    const onScroll = () => {
        const container = carouselRef.current;
        const center = container.scrollLeft + container.clientWidth / 2;

        let closest = 0;
        let min = Infinity;

        [...container.children].forEach((child, i) => {
            const c = child.offsetLeft + child.clientWidth / 2;
            const dist = Math.abs(center - c);

            if(dist < min){
                min = dist;
                closest = i;
            }
        });

        setActive(closest);
    };

    return (
        <div role="dialog" aria-label="events overlay" style={styles.backdrop} onClick={close}>
            <div style={styles.overlay}>
                <div
                    data-testid="event-slider"
                    ref={carouselRef}
                    style={styles.eventSlider}
                    onScroll={onScroll}
                    onClick={(e) => e.stopPropagation()}
                >
                    {events.map((e, i) => {
                        const eventDate = new Date(`${e.date}T${e.time}`);
                        const formattedDate = eventDate.toLocaleString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        const key = e.id || `${e.description}-${i}`;

                        const lat = e.location?.lat ?? 0;
                        const lng = e.location?.lng ?? 0;

                        return (
                            <div
                                style={{
                                    ...styles.eventCard,
                                    transform: i === active ? "scale(1)" : "scale(0.92)",
                                    transition: "transform 0.25s",
                                }}
                                key={key}
                            >
                                <h3 style={styles.author}>
                                    {e.author} - {formattedDate} - {`{${lat}, ${lng}}`}
                                </h3>
                                <p style={styles.event}>{e.description}</p>
                                {e.joined ? (
                                <button onClick={() => handleUnjoin(e.id)}>
                                    Unjoin Event
                                </button>
                                ) : (
                                <button onClick={() => handleJoin(e.id)}>
                                    Join Event
                                </button>
                                )}
                                <p>{e.joined ? "Joined" : "Not Joined"}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles = {
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 1000,  
    },
    overlay: {
        position: "absolute",
        top: "85px",
        left: 0,
        width: "100vw",
        display: "flex",
        alignItems: "flex-start", 
        justifyContent: "stretch",
        pointerEvents: "auto",
    },
    eventSlider: {
        width: "100%",
        display: "flex",
        gap: "16px",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x",

        paddingLeft: "7.5%",
        paddingRight: "7.5%",

        scrollbarWidth: "none",
        msOverflowStyle: "none",
        pointerEvents: "auto",
    },
    eventCard: {
        flex: "0 0 85%",
        width: "85%",
        height: "100%",
        background: "white",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
        scrollSnapAlign: "center",
        userSelect: "none",
        textAlign: "center",
    },
    author: {
        color: "#000000",
        margin: "0 0 8px 0",
        fontSize: "1.1rem",
        fontWeight: "600",
    },
    event: {
        color: "#000000",
        margin: 0,
        fontSize: "0.95rem",
        lineHeight: 1.4,
    },
};

export default EventOverlay;