import express from "express";
import questServices from "../models/quest-services.js";

const router = express.Router();
const { createQuest, getQuests } = questServices;

router.post("/", async (req, res) => {
  try {
    const quest = await createQuest(req.body);
    res.status(201).json(quest);
  } catch (error) {
    return res.status(500).send("Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const quests = await getQuests();
    res.json(quests);
  } catch (error) {
    res.status(500).send("Error");
  }
});

export default router;
