import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userServices from '../models/user-services.js';

const { authenticateUser, getUserByUsername } = userServices;
dotenv.config();
const router = express.Router();

// routes
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    await authenticateUser(username, password);
  } catch (error) {
    if (error.message === "User not found" || error.message === "Invalid password") {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    return res.status(500).send("Internal Server Error");
  }

  const token = jwt.sign(
    { username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

router.get('/test', authenticateToken, (req, res) => {
  res.json({ message: "You are authenticated!" });
});

// middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    getUserByUsername(req.user.username)
      .then(foundUser => {
        if (!foundUser) {
          return res.status(401).json({ message: "User not found" });
        }
        req.user._id = foundUser._id;
        next();
      })
      .catch(() => {
        return res.status(500).send("Internal Server Error");
      });
  });
}

export default router;

export {
  authenticateToken
};