// backend.js

// Imports
import express from "express";
import cors from "cors";

// Routes
const users = require('./routes/users.js');

// App setup
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

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

// Backend routing
app.use('/users', users);

// Run app
app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});