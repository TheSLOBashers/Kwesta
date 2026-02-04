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