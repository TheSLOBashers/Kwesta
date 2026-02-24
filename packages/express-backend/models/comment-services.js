import Comment from "./comment.js";

function createComment(commentData) {
  const newComment = new Comment(commentData);
  return newComment.save();
}

function getComments() {
  return Comment.find().sort({ createdAt: -1 });
}

async function removeComment(commentId) {
  return Comment.findByIdAndUpdate(commentId, {removed: true}, { new: true });
}

async function unremoveComment(commentId) {
  return Comment.findByIdAndUpdate(commentId, {removed: false}, { new: true });
}

export default {
  createComment,
  getComments,
  removeComment,
  unremoveComment
};
