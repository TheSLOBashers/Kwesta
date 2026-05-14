import express from "express";
const router = express.Router();
import user_services from "../models/user-services.js";
import {
  authenticateToken,
  authenticateModerator
} from "./auth.js";
const {
  authenticateUser,
  createNewUser,
  getAllNonModeratorUsers,
  getPublicUsers,
  getUserProfile,
  followUser,
  unfollowUser,
  getUserByUsername,
  banUser,
  unbanUser,
  getUserFlags,
  addUserFlag,
  removeUserFlag,
  upgradeToModerator,
  getUserById,
  giveBadge,
  removeBadge,
  purchaseBadge
} = user_services;

import commentServices from "../models/comment-services.js";
import eventServices from "../models/event-services.js";
import questServices from "../models/quest-services.js";
import redemptionServices from "../models/redemption-services.js";

// routes

// Create a new user
router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    const user = await createNewUser(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === "Username already exists") {
      return res.status(409).json({ message: error.message });
    } else if (error.message === "Email already exists") {
      return res.status(409).json({ message: error.message });
    } else if (error.message.includes("email: Invalid email")) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).send("Internal Server Error");
    }
  }
});

// Fetch public users: only username and points are exposed to everyone
router.get("/", async (req, res) => {
  try {
    const users_list = await getPublicUsers();
    return res.status(200).json({ users_list });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

// Fetch public users: only username and points are exposed to everyone
router.get("/mod-view", authenticateModerator, async (req, res) => {
  try {
    const users_list = await getAllNonModeratorUsers();
    return res.status(200).json({ users_list });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await getUserProfile(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    return res.status(200).json({
      username: user.username,
      points: user.points || 0,
      permissions: user.permissions,
      badges: user.badges || [],
      followers: user.followers ?? [],
      following: user.following ?? [],
      followersCount: user.followers?.length ?? 0,
      followingCount: user.following?.length ?? 0
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/me/followers", authenticateToken, async (req, res) => {
  try {
    const user = await getUserProfile(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    return res.status(200).json({ followers: user.followers ?? [] });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/me/following", authenticateToken, async (req, res) => {
  try {
    const user = await getUserProfile(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    return res.status(200).json({ following: user.following ?? [] });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

router.put("/me/following/:id", authenticateToken, async (req, res) => {
  try {
    await followUser(req.user._id, req.params.id);
    const user = await getUserProfile(req.user._id);

    return res.status(200).json({
      following: user?.following ?? [],
      followingCount: user?.following?.length ?? 0
    });
  } catch (error) {
    if (error.message === "Users cannot follow themselves") {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).send("Internal Server Error");
  }
});

router.delete(
  "/me/following/:id",
  authenticateToken,
  async (req, res) => {
    try {
      await unfollowUser(req.user._id, req.params.id);
      const user = await getUserProfile(req.user._id);

      return res.status(200).json({
        following: user?.following ?? [],
        followingCount: user?.following?.length ?? 0
      });
    } catch (error) {
      if (error.message === "Users cannot unfollow themselves") {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).send("Internal Server Error");
    }
  }
);

// Ban a user
router.put(
  "/ban/:id",
  authenticateModerator,
  async (req, res) => {
    const id = req.params["id"]; // or req.params.id
    banUser(id)
      .then(user => {
        delete user.password;
        res.status(200).json({ user });
      })
      .catch(error => {
        return res.status(500).send("Internal Server Error");
      });
  }
);

// unban a user
router.put(
  "/unban/:id",
  authenticateModerator,
  async (req, res) => {
    const id = req.params["id"]; // or req.params.id
    unbanUser(id)
      .then(user => {
        delete user.password;
        res.status(200).json({ user });
      })
      .catch(error => {
        return res.status(500).send("Internal Server Error");
      });
  }
);

// add moderator permissions to a user, given username
router.put(
  "/moderators",
  authenticateModerator,
  async (req, res) => {
    const username = req.body.username;
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found" });
      }
      await upgradeToModerator(user._id);
      delete user.password;
      res.status(200).json({ user });
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  }
);

// get my posts
router.get("/me/posts", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const [comments, events, quests, user] = await Promise.all([
      commentServices.getCommentsByAuthor(userId),
      eventServices.getEventsByAuthor(userId),
      questServices.getQuestsByAuthor(userId),
      getUserById(userId)
    ]);

    const authorName = user?.username || "Unknown";

    const clean = item => {
      const obj = item.toObject ? item.toObject() : item;

      return {
        id: obj._id.toString(),
        authorId: obj.author?.toString?.() ?? obj.author,
        authorName,

        date: obj.date ?? obj.createdAt,
        location: obj.location,

        comment: obj.comment ?? null,
        description: obj.description ?? null,

        likes: obj.likes ?? 0,
        flag: obj.flag ?? 0
      };
    };

    res.json({
      comments: comments.map(clean),
      events: events.map(clean),
      quests: quests.map(clean)
    });
  } catch (error) {
    console.error("GET /me/posts error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get my point redemptions history
router.get(
  "/me/redemptions",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const limit = req.query.limit
        ? parseInt(req.query.limit)
        : undefined;
      const skip = req.query.skip
        ? parseInt(req.query.skip)
        : undefined;

      const redemptions = await redemptionServices.getRedemptionsByUser(
        userId,
        {
          limit,
          skip
        }
      );

      // map to a simple JSON shape
      const entries = redemptions.map(r => ({
        id: r._id?.toString?.() ?? r._id,
        rewardName: r.rewardName,
        pointsRedeemed: r.pointsRedeemed,
        redeemedAt: r.redeemedAt ?? r.createdAt,
        status: r.status
      }));

      return res.status(200).json(entries);
    } catch (error) {
      console.error("GET /me/redemptions error:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/me/redemptions",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { rewardName, pointsRedeemed } = req.body;

      if (!rewardName || pointsRedeemed === undefined) {
        return res.status(400).json({
          message: "rewardName and pointsRedeemed are required"
        });
      }

      const parsedPoints = Number(pointsRedeemed);

      if (!Number.isFinite(parsedPoints) || parsedPoints <= 0) {
        return res.status(400).json({
          message: "pointsRedeemed must be a positive number"
        });
      }

      const redemption = await redemptionServices.createRedemption(
        {
          user: userId,
          rewardName: String(rewardName),
          pointsRedeemed: Math.abs(Math.round(parsedPoints))
        }
      );

      return res.status(201).json({
        id: redemption._id?.toString?.() ?? redemption._id,
        rewardName: redemption.rewardName,
        pointsRedeemed: redemption.pointsRedeemed,
        redeemedAt:
          redemption.redeemedAt ?? redemption.createdAt,
        status: redemption.status
      });
    } catch (error) {
      console.error("POST /me/redemptions error:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/me/badges/purchase",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { badgeName, cost } = req.body;

      if (!badgeName || cost === undefined) {
        return res.status(400).json({
          message: "badgeName and cost are required"
        });
      }

      const updatedUser = await purchaseBadge(
        userId,
        String(badgeName),
        Number(cost)
      );

      return res.status(200).json({
        message: "Badge purchased successfully",
        points: updatedUser.points || 0,
        badges: updatedUser.badges || []
      });
    } catch (error) {
      if (error.message === "Insufficient funds") {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === "Badge already owned") {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/me/joinedPosts",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user._id;

      const [events, quests] = await Promise.all([
        eventServices.getEventsUserJoined(userId),
        questServices.getQuestsUserJoined(userId)
      ]);

      const clean = async item => {
        const obj = item.toObject ? item.toObject() : item;

        const user = await getUserById(obj.author);

        return {
          id: obj._id.toString(),
          type: obj.description ? "event" : "quest",

          authorId: obj.author?.toString?.() ?? obj.author,
          authorName: user?.username || "Unknown",

          date: obj.date ?? obj.createdAt,
          location: obj.location,

          description: obj.description ?? null,

          joined: true,
          likes: obj.likes ?? 0,
          flag: obj.flag ?? 0
        };
      };

      const cleanEvents = await Promise.all(events.map(clean));
      const cleanQuests = await Promise.all(quests.map(clean));

      res.json({
        events: cleanEvents,
        quests: cleanQuests
      });
    } catch (error) {
      console.error("GET /me/joinedPosts error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

/*
const express = require('express')
const router = express.Router()
import userServices from "./models/user-services.js";

const {
  getUsers,
  findUserById,
  addUser,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  deleteUser
} = userServices;

router.get("/", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  getUsers(name, job)
    .then(users => {
      res.send({ users_list: users })
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

router.get("/:id", (req, res) => {
  const id = req.params["id"];
  findUserById(id)
    .then(user => {
      if (!user){
        res.status(404).send("Resource not found.");
      } else {
        res.send(user);
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

router.post("/", (req, res) => {
  const userToAdd = req.body;
  
  addUser(userToAdd)
    .then(newUser => {
      res.status(201).send(newUser);
    })
    .catch(err => {
      res.status(400).send(err.message);
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params["id"];

  deleteUser(id)
    .then(user => {
      if(!user){
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).end();
      }
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

module.exports = router
*/
