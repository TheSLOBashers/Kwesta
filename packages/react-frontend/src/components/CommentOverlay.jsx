import { useRef, useState } from "react";

function CommentOverlay({ close, comments = [] }){
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
        <div style={styles.backdrop} onClick={close}> 
            <div style={styles.overlay}>
                <div
                    ref={carouselRef}
                    style={styles.commentSlider}
                    onScroll={onScroll}
                    onClick={(e) => e.stopPropagation()}
                >
                    {comments.map((c, i) => (
                        <div 
                            style={{
                                ...styles.commentCard,
                                transform:
                                    i === active ? "scale(1)" : "scale(0.92)",
                                    transition: "transform 0.25s",
                            }}
                            key={c.id}
                        >
                            <h3 style={styles.user}>{c.user}</h3>
                            <p style={styles.text}>{c.text}</p>
                        </div>
                    ))}
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
    commentSlider: {
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
    commentCard: {
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
    user: {
        color: "#000000",
        margin: "0 0 8px 0",
        fontSize: "1.1rem",
        fontWeight: "600",
    },
    text: {
        color: "#000000",
        margin: 0,
        fontSize: "0.95rem",
        lineHeight: 1.4,
    },
};

export default CommentOverlay;