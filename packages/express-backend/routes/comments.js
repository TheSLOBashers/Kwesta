import express from "express";
import commentServices from "../models/comment-services.js";

const router = express.Router();
const { createComment, getComments } = commentServices;

router.post("/", async (req, res) => {
  try {
    const comment = await createComment(req.body);
    res.status(201).json(comment);
  } catch (error) {
    return res.status(500).send("Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const comments = await getComments();
    res.json(comments);
  } catch (error) {
    res.status(500).send("Error");
  }
});

export default router;
