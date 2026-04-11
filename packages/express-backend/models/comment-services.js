import Comment from "./comment.js";

function createComment(commentData) {
  const newComment = new Comment(commentData);
  return newComment.save();
}

function getComments() {
  return Comment.find({ removed: false })
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .lean();
}

/**
 * @param {number} lat - Center latitude
 * @param {number} lng - Center longitude
 * @param {number} radius - Radius in kilometers (default 5km)
 */
function getCommentsByArea(lat, lng, radius = 5) {
  const radiusInDegrees = radius / 111;

  return Comment.find({
    removed: false,
    "location.lat": {
      $gte: lat - radiusInDegrees,
      $lte: lat + radiusInDegrees
    },
    "location.lng": {
      $gte: lng - radiusInDegrees,
      $lte: lng + radiusInDegrees
    }
  })
    .populate("author", "username")
    .sort({ createdAt: -1 });
}

function getCommentById(commentId) {
  return Comment.findById(commentId).populate(
    "author",
    "username"
  );
}

async function deleteComment(commentId) {
  return Comment.findByIdAndDelete(commentId);
}

async function removeComment(commentId) {
  return Comment.findByIdAndUpdate(
    commentId,
    { removed: true },
    { new: true }
  );
}

async function unremoveComment(commentId) {
  return Comment.findByIdAndUpdate(
    commentId,
    { removed: false },
    { new: true }
  );
}

async function addFlag(commentId) {
  return Comment.findByIdAndUpdate(
    commentId,
    { $inc: { flag: 1 } },
    { new: true }
  );
}

async function removeFlag(commentId) {
  return Comment.findByIdAndUpdate(
    commentId,
    { $inc: { flag: -1 } },
    { new: true }
  );
}

async function likeComment(commentId, userId) {
  return Comment.findOneAndUpdate(
    {
      _id: commentId,
      likedBy: { $ne: userId }
    },
    {
      $addToSet: { likedBy: userId },
      $inc: { likes: 1 }
    },
    { new: true }
  ).populate("author", "username");
}

async function updateComment(id, updatedFields) {
  return Comment.findByIdAndUpdate(
    id,
    { $set: updatedFields },
    { new: true }
  );
}

export async function getCommentsByAuthor(userId) {
  return Comment.find({ author: userId }).sort({ createdAt: -1 });
}

/**
 * @param {Object} filters - Filter parameters
 * @param {string} filters.author - Filter by author ID
 * @param {Date} filters.startDate - Filter comments created after this date
 * @param {Date} filters.endDate - Filter comments created before this date
 * @param {number} filters.minFlags - Minimum flag count
 * @param {number} filters.maxFlags - Maximum flag count
 * @param {boolean} filters.removed - Filter by removed status
 * @param {string} filters.searchText - Search text in comment content
 * @param {number} filters.lat - Latitude for location-based search
 * @param {number} filters.lng - Longitude for location-based search
 * @param {number} filters.radius - Radius in kilometers for location search
 * @param {string} filters.sortBy - Field to sort by (createdAt, flag, date)
 * @param {string} filters.sortOrder - Sort order (asc, desc)
 * @param {number} filters.limit - Maximum number of results
 * @param {number} filters.skip - Number of results to skip (pagination)
 */
async function searchComments(filters = {}) {
  const query = {};

  // Filter by author
  if (filters.author) {
    query.author = filters.author;
  }

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  // Filter by flag count
  if (
    filters.minFlags !== undefined ||
    filters.maxFlags !== undefined
  ) {
    query.flag = {};
    if (filters.minFlags !== undefined) {
      query.flag.$gte = filters.minFlags;
    }
    if (filters.maxFlags !== undefined) {
      query.flag.$lte = filters.maxFlags;
    }
  }

  // Filter by removed status
  if (filters.removed !== undefined) {
    query.removed = filters.removed;
  }

  // Search text in comment content
  if (filters.searchText) {
    query.comment = {
      $regex: filters.searchText,
      $options: "i"
    };
  }

  // Location-based filtering (within radius)
  if (
    filters.lat !== undefined &&
    filters.lng !== undefined &&
    filters.radius
  ) {
    const radiusInDegrees = filters.radius / 111; // Approximate conversion
    query["location.lat"] = {
      $gte: filters.lat - radiusInDegrees,
      $lte: filters.lat + radiusInDegrees
    };
    query["location.lng"] = {
      $gte: filters.lng - radiusInDegrees,
      $lte: filters.lng + radiusInDegrees
    };
  }

  // Build sort options
  const sortField = filters.sortBy || "createdAt";
  const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  // Build query with pagination
  let queryBuilder = Comment.find(query)
    .populate("author", "username")
    .sort(sort);

  if (filters.skip) {
    queryBuilder = queryBuilder.skip(filters.skip);
  }

  if (filters.limit) {
    queryBuilder = queryBuilder.limit(filters.limit);
  }

  return queryBuilder.exec();
}

async function getCommentStats() {
  const totalComments = await Comment.countDocuments();
  const flaggedComments = await Comment.countDocuments({
    flag: { $gt: 0 }
  });
  const removedComments = await Comment.countDocuments({
    removed: true
  });

  return {
    total: totalComments,
    flagged: flaggedComments,
    removed: removedComments,
    active: totalComments - removedComments
  };
}

export default {
  createComment,
  getComments,
  getCommentsByArea,
  getCommentById,
  deleteComment,
  removeComment,
  unremoveComment,
  addFlag,
  removeFlag,
  likeComment,
  searchComments,
  getCommentStats,
  updateComment,
  getCommentsByAuthor
};
