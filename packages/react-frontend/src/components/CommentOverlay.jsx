import React from "react";
import { useRef, useState, useEffect } from "react";
import flagComment from "../APICalls/flagComment";
import likeComment from "../APICalls/likeComment";
import unflagComment from "../APICalls/unflagComment";

function CommentOverlay({
  close,
  comments,
  setComments,
  onPointsChanged,
  onSelectComment
}) {
  const carouselRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!onSelectComment) return;
    onSelectComment(comments[active] ?? null);
  }, [active, comments, onSelectComment]);

  function handleLike(commentId) {
    likeComment(commentId)
      .then(async () => {
        setComments(prevComments =>
          prevComments.map(c =>
            c.id === commentId
              ? {
                  ...c,
                  likes: (c.likes || 0) + 1,
                  likedByUser: true
                }
              : c
          )
        );
        if (onPointsChanged) {
          await onPointsChanged();
        }
      })
      .catch(error => {
        alert("Error liking comment: " + error.message);
      });
  }

  function handleFlag(CId) {
    flagComment(CId)
      .then(() => {
        // Update the local state to reflect the change
        setComments(prevComments =>
          prevComments.map(c =>
            c.id === CId ? { ...c, flaggedByUser: true } : c
          )
        );
        alert("Successfully flagged comment!");
      })
      .catch(error => {
        alert("Error flagging comment: " + error.message);
      });
  }

  function handleUnflag(CId) {
    unflagComment(CId)
      .then(() => {
        setComments(prevComments =>
          prevComments.map(c =>
            c.id === CId ? { ...c, flaggedByUser: false } : c
          )
        );
        alert("Successfully unflagged comment!");
      })
      .catch(error => {
        alert("Error unflagging comment: " + error.message);
      });
  }

  const onScroll = () => {
    const container = carouselRef.current;
    const center =
      container.scrollLeft + container.clientWidth / 2;

    let closest = 0;
    let min = Infinity;

    [...container.children].forEach((child, i) => {
      const c = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(center - c);

      if (dist < min) {
        min = dist;
        closest = i;
      }
    });

    setActive(closest);
  };

  return (
    <div
      role="dialog"
      aria-label="comments overlay"
      style={styles.backdrop}
      onClick={close}
    >
      <div style={styles.overlay}>
        <div
          data-testid="comment-slider"
          ref={carouselRef}
          style={styles.commentSlider}
          onScroll={onScroll}
          onClick={e => e.stopPropagation()}
        >
          {comments.map((c, i) => {
            const formattedDate = new Date(
              c.date
            ).toLocaleString([], {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            const key = c.id || `${c.comment}-${i}`;

            return (
              <div
                style={{
                  ...styles.commentCard,
                  transform:
                    i === active ? "scale(1)" : "scale(0.92)",
                  transition: "transform 0.25s"
                }}
                key={key}
              >
                <h3 style={styles.author}>
                  {c.author} - {formattedDate} -{" "}
                  {`{${c.location.lat}, ${c.location.lng}}`}
                </h3>
                <p style={styles.comment}>{c.comment}</p>
                <p style={styles.meta}>Likes: {c.likes || 0}</p>
                <button
                  onClick={() => handleLike(c.id)}
                  disabled={Boolean(c.likedByUser)}
                >
                  {c.likedByUser ? "Liked" : "Like Comment"}
                </button>
                {c.flaggedByUser ? (
                  <button onClick={() => handleUnflag(c.id)}>
                    Unflag Comment
                  </button>
                ) : (
                  <button onClick={() => handleFlag(c.id)}>
                    Flag Comment
                  </button>
                )}
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
    zIndex: 1000
  },
  overlay: {
    position: "absolute",
    top: "85px",
    left: 0,
    width: "100vw",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "stretch",
    pointerEvents: "auto"
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
    pointerEvents: "auto"
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
    textAlign: "center"
  },
  author: {
    color: "#000000",
    margin: "0 0 8px 0",
    fontSize: "1.1rem",
    fontWeight: "600"
  },
  comment: {
    color: "#000000",
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: 1.4
  },
  meta: {
    color: "#000000",
    margin: "12px 0",
    fontSize: "0.95rem",
    fontWeight: "600"
  }
};

export default CommentOverlay;
