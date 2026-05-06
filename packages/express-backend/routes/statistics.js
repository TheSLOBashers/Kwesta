import express from "express";
import {
  authenticateToken,
  authenticateModerator,
  authenticateAdmin
} from "./auth.js";
import {getAggregatedAnalytics, getAggregatedAnalyticsInRange} from '../models/DBAnalytics-services.js';

const router = express.Router();

router.post("/mdb/:id", authenticateAdmin, async (req, res) => {
  try {

    const analyticName = req.params.id;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    console.log(`Received request for analytic ${analyticName} with startDate=${startDate} and endDate=${endDate}`);

    let measurements;
    if (startDate && endDate) {
      measurements = await getAggregatedAnalyticsInRange(analyticName, startDate, endDate);
    } else if (startDate) {
      measurements = await getAggregatedAnalyticsInRange(analyticName, startDate, new Date());
    } else if (endDate) {
      measurements = await getAggregatedAnalyticsInRange(analyticName, new Date('2026-01-01T00:00:00Z'), endDate);
    } else {
      measurements = await getAggregatedAnalytics(analyticName);
    }

    // filter out measurements with null timestamps or values
    measurements = measurements.filter(m => m.timeStamp && m.value !== null);

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