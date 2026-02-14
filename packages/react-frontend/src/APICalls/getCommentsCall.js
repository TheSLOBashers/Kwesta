const getCommentsCall = async () => {
    try {
        const response = await fetch("http://localhost:8000/comments");
        if(!response.ok) {
            throw new Error("Failed to fetch comments");
        }

        const data = await response.json();

        return data.map(c => ({
            id: c.id,
            user: c.user,
            text: c.text,
        }));
    } catch (err) {
        console.error("Error fetching comments:", err);
        return [];
    }
};

export default getCommentsCall;