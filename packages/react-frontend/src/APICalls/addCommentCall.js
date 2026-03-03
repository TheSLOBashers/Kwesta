const addCommentCall = async (commentData) => {
    try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(commentData),
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        return json.comment;
    } catch (err) {
        console.error("Error adding comment:", err);
        return null;
    }
};

export default addCommentCall;