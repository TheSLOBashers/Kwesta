import express from "express";
import eventServices from "../models/event-services.js";
import {
  authenticateToken,
  authenticateModerator
} from "./auth.js";
import user_services from "../models/user-services.js";
const { addPoints } = user_services;

const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  removeEvent,
  unremoveEvent,
  addEventFlag,
  removeEventFlag,
  searchEvents,
  getEventStats
} = eventServices;

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { description, date, time, location } = req.body;

    const event = await createEvent({
      author: req.user._id,
      description,
      date,
      time,
      location
    });
    await addPoints(req.user._id, 10);
    res.status(201).json(event);
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await getEvents();
    res.json({ events: events });
  } catch (error) {
    res.status(500).send("Error");
  }
});

// Get a single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found" });
    }
    res.json({ event });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Search and filter events (for moderation)
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
        minRsvp: req.body.minRsvp,
        maxRsvp: req.body.maxRsvp,
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

      const events = await searchEvents(filters);
      res.json({ events, count: events.length });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Get event statistics (for moderation dashboard)
router.get(
  "/stats/summary",
  authenticateModerator,
  async (req, res) => {
    try {
      const stats = await getEventStats();
      res.json(stats);
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Update a event
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const event = await updateEvent(req.params.id, req.body);
    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Permanently delete a event (moderator only)
router.delete(
  "/:id",
  authenticateModerator,
  async (req, res) => {
    try {
      const event = await deleteEvent(req.params.id);
      if (!event) {
        return res
          .status(404)
          .json({ message: "Event not found" });
      }
      res
        .status(200)
        .json({ message: "Event deleted successfully", event });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Remove a event (soft delete - moderator only)
router.put(
  "/remove/:id",
  authenticateModerator,
  async (req, res) => {
    try {
      const event = await removeEvent(req.params.id);
      if (!event) {
        return res
          .status(404)
          .json({ message: "Event not found" });
      }
      res.status(200).json({ event });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Unremove a event (restore - moderator only)
router.put(
  "/unremove/:id",
  authenticateModerator,
  async (req, res) => {
    try {
      const event = await unremoveEvent(req.params.id);
      if (!event) {
        return res
          .status(404)
          .json({ message: "Event not found" });
      }
      res.status(200).json({ event });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

// Flag a event
router.put("/flag/:id", authenticateToken, async (req, res) => {
  try {
    const event = await addEventFlag(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Unflag a event
router.put(
  "/unflag/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const event = await removeEventFlag(req.params.id);
      if (!event) {
        return res
          .status(404)
          .json({ message: "Event not found" });
      }
      res.status(200).json({ event });
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

export default router;
