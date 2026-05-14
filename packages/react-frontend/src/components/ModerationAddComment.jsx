import addCommentCall from "../APICalls/addCommentCall";
import { useState } from "react";

const AddComment = () => {

    const [comment, setComment] = useState("");
    const [location, setLocation] = useState({ lat: 0, lng: 0 });

    function handleChange(event) {
        if (event.target.name === "comment") {
            setComment(event.target.value);
        } else if (event.target.name === "location") {
            const [lat, lng] = event.target.value.split(",").map(Number);
            setLocation({ lat, lng });
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Add Comment</h1>
            <p>Add a new comment on this page.</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                addCommentCall({comment, location})
                    .then(() => {
                        alert("Successfully added the comment!");
                    })
                    .catch((error) => {
                        alert(`Failed to add the comment: ${error.message}`);
                    });
                setComment("");
                setLocation({ lat: 0, lng: 0 });
            }}>
                <label htmlFor="comment">Comment:</label>
                <input type="text" id="comment" name="comment" required value = {comment} onChange={handleChange}/>
                <label htmlFor="location">Location (lat,lng):</label>
                <input type="text" id="location" name="location" required value = {`${location.lat},${location.lng}`} onChange={handleChange}/>
                <button type="submit">Add Comment</button>
            </form>
        </div>
    );
}

export default AddComment;