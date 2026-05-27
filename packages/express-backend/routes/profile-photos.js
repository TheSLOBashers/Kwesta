import express from "express";
import multer from "multer";
import ProfilePhoto from "../models/profile-photo.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.body.username) {
      return res.status(400).json({ error: "Missing username" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Missing image file" });
    }

    const profilePhoto = await ProfilePhoto.create({
      username: req.body.username,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      image: req.file.buffer,
      size: req.file.size
    });

    res.status(201).json({ id: profilePhoto._id });
  } catch (error) {
    console.error("Error saving profile photo:", error);
    if (error.code === 11000) {
      return res.status(409).json({ error: "Username already has a profile photo" });
    }
    res.status(500).json({ error: "Unable to save profile photo" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const profilePhoto = await ProfilePhoto.findOne({ username: req.params.username });
    if (!profilePhoto) {
      return res.status(404).json({ error: "Profile photo not found" });
    }

    res.set("Content-Type", profilePhoto.contentType || "application/octet-stream");
    res.send(profilePhoto.image);
  } catch (error) {
    console.error("Error retrieving profile photo:", error);
    res.status(500).json({ error: "Unable to retrieve profile photo" });
  }
});

router.delete("/:username", async (req, res) => {
  try {
    const deleted = await ProfilePhoto.findOneAndDelete({ username: req.params.username });
    if (!deleted) {
      return res.status(404).json({ error: "Profile photo not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    res.status(500).json({ error: "Unable to delete profile photo" });
  }
});

export default router;
