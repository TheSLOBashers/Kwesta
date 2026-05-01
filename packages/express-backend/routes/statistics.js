import express from "express";
import {
  authenticateToken,
  authenticateModerator
} from "./auth.js";
import {getAggregatedAnalytics} from '../models/DBAnalytics-services.js';

const router = express.Router();

router.get("/mdb/NETWORK_NUM_REQUESTS", authenticateModerator, async (req, res) => {
  try {
    const measurements = await getAggregatedAnalytics("NETWORK_NUM_REQUESTS");

    res.json({ measurements });
  } catch (error) {
    console.error("GET /statistics FAILED:", error);
    res.status(500).json({ error: error.message });
  }
});

/*
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
*/

export default router;