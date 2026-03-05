import React from "react";
import { useRef, useState, useEffect } from "react";

function QuestOverlay({ close, quests = [] }){
    const carouselRef = useRef(null);
    const [active, setActive] = useState(0);

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
                    ref={carouselRef}
                    style={styles.questSlider}
                    onScroll={onScroll}
                    onClick={(e) => e.stopPropagation()}
                >
                    {quests.map((q, i) => {
                        const questDate = new Date(`${q.date}T${q.time}`);
                        const formattedDate = questDate.toLocaleString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        const key = q.id || `${q.description}-${i}`;

                        const lat = q.location?.lat ?? 0;
                        const lng = q.location?.lng ?? 0;

                        return (
                            <div
                                style={{
                                    ...styles.questCard,
                                    transform: i === active ? "scale(1)" : "scale(0.92)",
                                    transition: "transform 0.25s",
                                }}
                                key={key}
                            >
                                <h3 style={styles.author}>
                                    {q.author} - {formattedDate} - {`{${lat}, ${lng}}`}
                                </h3>
                                <p style={styles.quest}>{q.description}</p>
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
    questSlider: {
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
    questCard: {
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
    quest: {
        color: "#000000",
        margin: 0,
        fontSize: "0.95rem",
        lineHeight: 1.4,
    },
};

export default QuestOverlay;