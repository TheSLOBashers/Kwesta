const addCommentCall = async (commentData) => {
    try {
        const response = await fetch("http://localhost:8000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
        });
        
        const json = await response.json();
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return json;
    } catch (err) {
        console.error("Error adding comment:", err);
        return null;
    }
};

export default addCommentCall;