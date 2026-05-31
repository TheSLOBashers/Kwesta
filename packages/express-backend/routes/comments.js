import express from "express";
import commentServices from "../models/comment-services.js";
import {
  authenticateToken,
  authenticateModerator
} from "./auth.js";
import user_services from "../models/user-services.js";
const {
  authenticateUser,
  createNewUser,
  getAllNonModeratorUsers,
  getUserByUsername,
  banUser,
  unbanUser,
  getUserFlags,
  addUserFlag,
  removeUserFlag,
  upgradeToModerator,
  addPoints,
  getUserById,
  giveBadge
} = user_services;

const router = express.Router();
const {
  createComment,
  getComments,
  getCommentsByArea,
  getCommentsSinceNearby,
  getCommentById,
  deleteComment,
  removeComment,
  unremoveComment,
  addFlag,
  removeFlag,
  likeComment,
  searchComments,
  getCommentStats
} = commentServices;

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { comment, location } = req.body;

    if (
      !comment ||
      location.lat == null ||
      location.lng == null
    ) {
      return res
        .status(400)
        .json({ message: "Comment and location required" });
    }

    const createdComment = await createComment({
      author: req.user._id,
      comment,
      location
    });
    
    const THIRTY_MIN = 30 * 60 * 1000;
    const now = Date.now();

    const recentComments = await Comment.find({
      author: req.user._id,
      createdAt: { $gte: new Date(now - THIRTY_MIN) }
    });

    const REWARD_LIMIT = 3;

    if (recentComments.length < REWARD_LIMIT) {
      await addPoints(req.user._id, 10);
      await giveBadge(req.user._id, "Commenter").catch(() => {});
    }

    res.status(201).json({ comment: createdComment });
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { since } = req.query;

    let comments;

    if (since) {
      comments = await commentServices.getCommentsSince(
        new Date(since)
      );
    } else {
      comments = await getComments();
    }

    for (const comment of comments) {
      const user = await getUserById(comment.author);

      comment.authorId = comment.author;
      comment.authorName = user?.username || "Unknown";
    }

    const flags = (await getUserFlags(req.user._id)) ?? [];
    const safeFlags = flags.filter(Boolean);

    comments.forEach((comment) => {
      comment.likedByUser = (comment.likedBy || []).some(
        (likedUserId) =>
          likedUserId.toString() === req.user._id.toString()
      );

      comment.flaggedByUser = safeFlags.some(
        (flaggedComment) =>
          flaggedComment._id.toString() === comment._id.toString()
      );

      delete comment.likedBy;
    });

    res.json({ comments });
  } catch (error) {
    console.error("GET /comments FAILED:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get comments by area (for users to see comments about a location)
router.get("/area", authenticateToken, async (req, res) => {
  try {
    const { lat, lng, radius, since } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "lat and lng query parameters are required"
      });
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRadius = radius ? parseFloat(radius) : 1;

    let comments;

    if (since) {
      comments = await commentServices.getCommentsSinceNearby(
        new Date(since),
        parsedLat,
        parsedLng,
        parsedRadius
      );
    } else {
      comments = await getCommentsByArea(
        parsedLat,
        parsedLng,
        parsedRadius
      );
    }

    for (const comment of comments) {
      const user = await getUserById(comment.author);

      comment.authorId = comment.author;
      comment.authorName = user?.username || "Unknown";
    }

    const flags = (await getUserFlags(req.user._id)) ?? [];
    const safeFlags = flags.filter(Boolean);

    comments.forEach((comment) => {
      comment.likedByUser = (comment.likedBy || []).some(
        (likedUserId) =>
          likedUserId.toString() === req.user._id.toString()
      );

      comment.flaggedByUser = safeFlags.some(
        (flaggedComment) =>
          flaggedComment._id.toString() === comment._id.toString()
      );

      delete comment.likedBy;
    });

    res.json({ comments });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// fetches based on immediate location
router.get("/area/snapshot", authenticateToken, async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "lat and lng query parameters are required"
      });
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRadius = radius ? parseFloat(radius) : 1;

    const comments = await getCommentsByArea(
      parsedLat,
      parsedLng,
      parsedRadius
    );

    for (const comment of comments) {
      const user = await getUserById(comment.author);
      comment.authorId = comment.author;
      comment.authorName = user?.username || "Unknown";
    }

    const flags = (await getUserFlags(req.user._id)) ?? [];
    const safeFlags = flags.filter(Boolean);

    comments.forEach((comment) => {
      comment.likedByUser = (comment.likedBy || []).some(
        (likedUserId) =>
          likedUserId.toString() === req.user._id.toString()
      );

      comment.flaggedByUser = safeFlags.some(
        (flaggedComment) =>
          flaggedComment._id.toString() === comment._id.toString()
      );

      delete comment.likedBy;
    });

    res.json({ comments });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// fetches new comment updates
router.get("/area/updates", authenticateToken, async (req, res) => {
  try {
    const { lat, lng, radius, since } = req.query;

    if (!lat || !lng || !since) {
      return res.status(400).json({
        message: "lat, lng, and since are required"
      });
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRadius = radius ? parseFloat(radius) : 1;

    const comments = await commentServices.getCommentsSinceNearby(
      new Date(since),
      parsedLat,
      parsedLng,
      parsedRadius
    );

    for (const comment of comments) {
      const user = await getUserById(comment.author);
      comment.authorId = comment.author;
      comment.authorName = user?.username || "Unknown";
    }

    const flags = (await getUserFlags(req.user._id)) ?? [];
    const safeFlags = flags.filter(Boolean);

    comments.forEach((comment) => {
      comment.likedByUser = (comment.likedBy || []).some(
        (likedUserId) =>
          likedUserId.toString() === req.user._id.toString()
      );

      comment.flaggedByUser = safeFlags.some(
        (flaggedComment) =>
          flaggedComment._id.toString() === comment._id.toString()
      );

      delete comment.likedBy;
    });

    res.json({ comments });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Get a single comment by ID
router.get("/:id", async (req, res) => {
  try {
    const comment = await getCommentById(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found" });
    }
    res.json({ comment });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// edit comment
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { comment, location } = req.body;

    const existingComment = await getCommentById(id);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (existingComment.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedFields = {};
    if (comment !== undefined) updatedFields.comment = comment;
    if (location !== undefined) updatedFields.location = location;

    const updatedComment = await commentServices.updateComment(id, updatedFields);

    res.status(200).json({ comment: updatedComment });

  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Search and filter comments (for moderation)
router.post(
  "/search",
  authenticateModerator,
  async (req, res) => {
    try {
      const filters = {
        author: req.body.author,
        username: req.body.username,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        minFlags: req.body.minFlags,
        maxFlags: req.body.maxFlags,
        removed: req.body.removed,
        searchText: req.body.searchText,
        lat: req.body.lat,
        lng: req.body.lng,
        radius: req.body.radius,
        sortBy: req.body.sortBy,
        sortOrder: req.body.sortOrder,
        limit: req.body.limit,
        skip: req.body.skip
      };

      // Remove undefined values
      Object.keys(filters).forEach(
        (key) =>
          filters[key] === undefined && delete filters[key]
      );

      if (!filters.limit || filters.limit > 1000) {
        filters.limit = 1000; // Set a maximum limit to prevent abuse
      }

      const comments = await searchComments(filters);
      res.json({ comments, count: comments.length });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Get comment statistics (for moderation dashboard)
router.get(
  "/stats/summary",
  authenticateModerator,
  async (req, res) => {
    try {
      const stats = await getCommentStats();
      res.json(stats);
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Permanently delete a comment (moderator only)
router.delete(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const comment = await getCommentById(req.params.id);
      if (!comment) {
        return res
          .status(404)
          .json({ message: "Comment not found" });
      }

      const isOwner = comment.author._id.toString() === req.user._id.toString();
      const isModerator = req.user.permissions?.includes("moderator");

      if (!isOwner && !isModerator) {
        return res.status(403).json({message: "Unauthorized"});
      }

      const deleted = await deleteComment(req.params.id);

      res.status(200).json({
        message: "Comment deleted successfully",
        comment: deleted
      });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Remove a comment
router.put(
  "/remove/:id",
  authenticateModerator,
  async (req, res) => {
    const id = req.params["id"]; // or req.params.id
    removeComment(id)
      .then((comment) => {
        res.status(200).json({ comment });
      })
      .catch((error) => {
        return res.status(500).send("Internal Server Error");
      });
  }
);

// unremove a comment
router.put(
  "/unremove/:id",
  authenticateModerator,
  async (req, res) => {
    const id = req.params["id"]; // or req.params.id
    unremoveComment(id)
      .then((comment) => {
        res.status(200).json({ comment });
      })
      .catch((error) => {
        return res.status(500).send("Internal Server Error");
      });
  }
);

// flag a comment
router.put("/flag/:id", authenticateToken, async (req, res) => {
  const id = req.params["id"];
  try {
    const flags = await getUserFlags(req.user._id);

    const validFlags = flags.filter((flaggedComment) => flaggedComment && flaggedComment._id);
    if (
      validFlags.some(
        (flaggedComment) => flaggedComment._id.toString() === id
      )
    ) {
      return res
        .status(400)
        .json({ message: "Comment already flagged" });
    }
    await addUserFlag(req.user._id, id);
    const comment = await addFlag(id);
    res.status(200).json({ comment });
  } catch (error) {
    console.error("Error flagging comment:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// unflag a comment
router.put("/unflag/:id", authenticateToken, async (req, res) => {
    const id = req.params["id"];
    try {
      const flags = await getUserFlags(req.user._id);
      const validFlags = (flags ?? []).filter(
        (flaggedComment) => flaggedComment && flaggedComment._id
      );

      if (
        !validFlags.some(
          (flaggedComment) =>
            flaggedComment._id.toString() === id
        )
      ) {
        return res
          .status(400)
          .json({ message: "Comment not flagged" });
      }
      await user_services.removeUserFlag(req.user._id, id);
      const comment = await removeFlag(id);
      res.status(200).json({ comment });
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  }
);

router.put("/like/:id", authenticateToken, async (req, res) => {
  const id = req.params["id"];

  try {
    const existingComment = await getCommentById(id);
    if (!existingComment) {
      return res
        .status(404)
        .json({ message: "Comment not found" });
    }

    if (
      (existingComment.likedBy || []).some(
        (likedUserId) =>
          likedUserId.toString() === req.user._id.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "Comment already liked" });
    }

    const comment = await likeComment(id, req.user._id);
    await addPoints(existingComment.author, 10);
    res.status(200).json({ comment });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

export default router;
