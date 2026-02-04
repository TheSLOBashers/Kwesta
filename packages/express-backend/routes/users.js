import express from "express";
const router = express.Router();
import user_services from '../models/user-services.js';

const { authenticateUser, createNewUser } = user_services;

// routes

// Create a new user
router.post('/', async (req, res) => {
  
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    const user = await createNewUser(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === "Username already exists") {
      return res.status(409).json({ message: error.message });
    }
    else if (error.message === "Email already exists") {
      return res.status(409).json({ message: error.message });
    }
    else {
        return res.status(500).send("Internal Server Error");
    }
  }

});

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