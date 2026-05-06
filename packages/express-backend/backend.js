// backend.js

// Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { register } from 'prom-client';
import promBundle from "express-prom-bundle";

// Routes
import { default as users } from "./routes/users.js";
import { default as comments } from "./routes/comments.js";
import { default as quests } from "./routes/quests.js";
import { default as events } from "./routes/events.js";
import { default as auth } from "./routes/auth.js";
import { default as statistics } from "./routes/statistics.js";

// App setup
dotenv.config();
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
//collectDefaultMetrics(); -- don't need this since promBundle already collects default metrics

// Prometheus metrics middleware

const metricsMiddleware = promBundle({
    includeMethod: true, 
    includePath: true,
    includeStatusCode: true,
    normalizePath: true, // Converts /user/123 to /user/#val
    promClient: {
        collectDefaultMetrics: {
            timeout: 1000
        }
    }
});

// Mongo setup
mongoose.set("debug", true);
const mongoUri =
  process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost:27017/KWESTA";

mongoose
  .connect(mongoUri)
  .then(() => console.log(`MongoDB connected at ${mongoUri}!`))
  .then(() => console.log("Connected DB:", mongoose.connection.name))
  .catch(error => console.log(error));

// Use Prometheus middleware
app.use(metricsMiddleware);
// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.sendStatus(400);
  }
  next(err);
});

// Basic endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Backend routing
app.use("/users", users);
app.use("/comments", comments);
app.use("/quests", quests);
app.use("/events", events);
app.use("/auth", auth);
app.use("/statistics", statistics);

// Run app
app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
