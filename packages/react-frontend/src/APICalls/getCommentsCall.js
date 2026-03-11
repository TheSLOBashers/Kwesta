const getCommentsCall = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/comments",
      {
        method: "GET", // Specify the method
        headers: {
          "Content-Type": "application/json", // Indicate the content type
          Authorization: `Bearer ${localStorage.getItem(
            "authToken"
          )}`
        }
      }
    );
    if (!response.ok) {
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
      likes: c.likes || 0,
      flag: c.flag,
      likedByUser: c.likedByUser || false,
      flaggedByUser: c.flaggedByUser || false
    }));
  } catch (err) {
    console.error("Error fetching comments:", err);
    return [];
  }
};

export default getCommentsCall;
