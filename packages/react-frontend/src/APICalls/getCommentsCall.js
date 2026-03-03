const getCommentsCall = async () => {
    try {
        const response = await fetch("http://localhost:8000/comments");
        if(!response.ok) {
            throw new Error("Failed to fetch comments");
        }

        const data = await response.json();

        const commentsArray = data.comments || [];

        return commentsArray.map(c => ({
            id: c._id,
            author: c.author?.username || c.author,
            date: c.date,
            comment: c.comment,
            location: c.location,
            flag: c.flag,
        }));
    } catch (err) {
        console.error("Error fetching comments:", err);
        return [];
    }
};

export default getCommentsCall;