import Comment from "./comment.js";

function createComment(commentData) {
  const newComment = new Comment(commentData);
  return newComment.save();
}

function getComments() {
  return Comment.find().sort({ createdAt: -1 });
}

export default {
  createComment,
  getComments
};
