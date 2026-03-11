const likeComment = async commentId => {
  try {
    const response = await fetch(
      `http://localhost:8000/comments/like/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            "authToken"
          )}`
        }
      }
    );

    const json = await response.json();
    if (!response.ok) {
      throw new Error(
        json.message || `Error: ${response.status}`
      );
    }

    return json.comment;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

export default likeComment;
