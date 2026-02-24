import express from "express";
import commentServices from "../models/comment-services.js";
import { authenticateToken, authenticateModerator } from "./auth.js";

const router = express.Router();
const { createComment, getComments, removeComment, unremoveComment } = commentServices;

router.post("/", authenticateToken, async (req, res) => {
  try {
    const comment = await createComment({author: req.user._id, comment: req.body.comment, location: req.body.location});
    res.status(201).json({comment});
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const comments = await getComments();
    res.json({comments: comments});
  } catch (error) {
    res.status(500).send("Error");
  }
});

// Remove a comment
router.put("/remove/:id", authenticateModerator, async (req, res) => {
  const id = req.params["id"]; // or req.params.id
  removeComment(id)
    .then((comment) => {
      res.status(200).json({comment});
    })
    .catch((error) => {
      return res.status(500).send("Internal Server Error");
    })
});

// unremove a comment
router.put("/unremove/:id", authenticateModerator, async (req, res) => {
  const id = req.params["id"]; // or req.params.id
  unremoveComment(id)
    .then((comment) => {
      res.status(200).json({comment});
    })
    .catch((error) => {
      return res.status(500).send("Internal Server Error");
    })
});

export default router;
