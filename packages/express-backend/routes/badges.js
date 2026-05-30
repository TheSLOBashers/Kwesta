import express from "express";
import multer from "multer";
import fs from "fs";
import Badge from "../models/badges.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/store", async (req, res) => {
  try { // Only return badges that are not flagged as unavailable in the store, not just badges with showInStore set to true, but also badges that don't have showInStore set at all (for backwards compatibility)
    const badges = await Badge.find({ showInStore: { $ne: false } }, "name cost");
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/upload/:name/:cost/:description", upload.single("image"), async (req, res) => {
  try {
    const badge = new Badge({
      name: req.params.name,
      cost: parseInt(req.params.cost),
      contentType: req.file.mimetype,
      icon: fs.readFileSync(req.file.path),
      description: req.params.description
    });

    await badge.save();

    fs.unlinkSync(req.file.path);

    res.json({ message: "Badge uploaded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const badge = await Badge.findOne({ name: req.params.name });
    if (!badge) {
      return res.status(404).send("Not found");
    }
    res.set("Content-Type", badge.contentType);
    res.send(badge.icon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/description/:name", async (req, res) => {
  try {
    const badge = await Badge.findOne({ name: req.params.name });
    if (!badge) {
      return res.status(404).send("Not found");
    }
    res.json({ description: badge.description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const badges = await Badge.find({}, "name cost");
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;