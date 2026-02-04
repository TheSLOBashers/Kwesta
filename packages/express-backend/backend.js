// backend.js

// Imports
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import { default as users } from './routes/users.js';
import { default as auth } from './routes/auth.js';

// App setup
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

// Mongo setup
mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/KWESTA")
  .then(() => console.log("MongoDB connected!")) 
  .catch((error) => console.log(error));

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
app.use('/auth', auth);

// Run app
app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});