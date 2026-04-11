import express from "express";
import questServices from "../models/quest-services.js";
import {
  authenticateToken,
  authenticateModerator
} from "./auth.js";
import user_services from "../models/user-services.js";
const { addPoints, getUserById } = user_services;

const router = express.Router();
const {
  createQuest,
  getQuests,
  getQuestById,
  updateQuest,
  deleteQuest,
  removeQuest,
  unremoveQuest,
  addQuestFlag,
  removeQuestFlag,
  searchQuests,
  getQuestStats,
  joinQuest,
  unjoinQuest
} = questServices;

router.post("/", authenticateModerator, async (req, res) => {
  try {
    const quest = await createQuest({
      author: req.user._id,
      description: req.body.description,
      points: req.body.points,
      time: req.body.time,
      location: req.body.location,
      date: req.body.date
    });
    res.status(201).json(quest);
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const quests = await getQuests();

    for (const quest of quests) {
      const user = await getUserById(quest.author); 
      
      quest.authorId = quest.author;
      quest.authorName = user?.username || "Unknown";
    }

    quests.forEach(q => {
      q.joined = q.rsvpList.some(
        id => id.toString() === req.user._id.toString()
      );
    });
    res.status(201).json({ quests, userId: req.user._id });
  } catch (error) {
    res.status(500).send("Error");
  }
});

// Get a single quest by ID
router.get("/:id", async (req, res) => {
  try {
    const quest = await getQuestById(req.params.id);
    if (!quest) {
      return res
        .status(404)
        .json({ message: "Quest not found" });
    }
    res.json({ quest });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// edit quest
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { description, location, date } = req.body;

    const existingQuest = await getQuestById(id);

    if (!existingQuest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    if (existingQuest.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedFields = {};
    if (description !== undefined) updatedFields.description = description;
    if (location !== undefined) updatedFields.location = location;
    if (date !== undefined) updatedFields.date = date;

    const updatedQuest = await eventServices.updateQuest(id, updatedFields);

    res.status(200).json({ quest: updatedQuest });

  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Search and filter quests (for moderation)
router.post(
  "/search",
  authenticateModerator,
  async (req, res) => {
    try {
      const filters = {
        author: req.body.author,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        createdAfter: req.body.createdAfter,
        createdBefore: req.body.createdBefore,
        minFlags: req.body.minFlags,
        maxFlags: req.body.maxFlags,
        removed: req.body.removed,
        searchText: req.body.searchText,
        lat: req.body.lat,
        lng: req.body.lng,
        radius: req.body.radius,
        //minRsvp: req.body.minRsvp,
        //maxRsvp: req.body.maxRsvp,
        sortBy: req.body.sortBy,
        sortOrder: req.body.sortOrder,
        limit: req.body.limit,
        skip: req.body.skip
      };

      // Remove undefined values
      Object.keys(filters).forEach(
        key => filters[key] === undefined && delete filters[key]
      );

      if (!filters.limit || filters.limit > 1000) {
        filters.limit = 1000; // Set a maximum limit to prevent abuse
      }

      const quests = await searchQuests(filters);
      res.json({ quests, count: quests.length });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Get quest statistics (for moderation dashboard)
router.get(
  "/stats/summary",
  authenticateModerator,
  async (req, res) => {
    try {
      const stats = await getQuestStats();
      res.json(stats);
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Update a quest
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const quest = await updateQuest(req.params.id, req.body);
    if (!quest) {
      return res
        .status(404)
        .json({ message: "Quest not found" });
    }
    res.status(200).json({ quest });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Permanently delete a quest (moderator only)
router.delete(
  "/:id",
  authenticateModerator,
  async (req, res) => {
    try {
      const quest = await deleteQuest(req.params.id);
      if (!quest) {
        return res
          .status(404)
          .json({ message: "Quest not found" });
      }
      res
        .status(200)
        .json({ message: "Quest deleted successfully", quest });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Remove a quest (soft delete - moderator only)
router.put(
  "/remove/:id",
  authenticateModerator,
  async (req, res) => {
    try {
      const quest = await removeQuest(req.params.id);
      if (!quest) {
        return res
          .status(404)
          .json({ message: "Quest not found" });
      }
      res.status(200).json({ quest });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Unremove a quest (restore - moderator only)
router.put(
  "/unremove/:id",
  authenticateModerator,
  async (req, res) => {
    try {
      const quest = await unremoveQuest(req.params.id);
      if (!quest) {
        return res
          .status(404)
          .json({ message: "Quest not found" });
      }
      res.status(200).json({ quest });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Flag a quest
router.put("/flag/:id", authenticateToken, async (req, res) => {
  try {
    const quest = await addQuestFlag(req.params.id);
    if (!quest) {
      return res
        .status(404)
        .json({ message: "Quest not found" });
    }
    res.status(200).json({ quest });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Unflag a quest
router.put(
  "/unflag/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const quest = await removeQuestFlag(req.params.id);
      if (!quest) {
        return res
          .status(404)
          .json({ message: "Quest not found" });
      }
      res.status(200).json({ quest });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// join a quest
router.post(
  "/join/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const quest = await joinQuest(
        req.params.id,
        req.user._id
      );
      if (!quest) {
        return res
          .status(404)
          .json({ message: "Quest not found" });
      }
      await addPoints(req.user._id, 10);
      res.status(200).json({ quest });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// unjoin a quest
router.post(
  "/unjoin/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const quest = await unjoinQuest(
        req.params.id,
        req.user._id
      );
      if (!quest) {
        return res
          .status(404)
          .json({ message: "Quest not found" });
      }
      res.status(200).json({ quest });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

export default router;
