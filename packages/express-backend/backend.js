// backend.js
import express from "express";
import cors from "cors";
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

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
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

app.get("/users/:id", (req, res) => {
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

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  
  addUser(userToAdd)
    .then(newUser => {
      res.status(201).send(newUser);
    })
    .catch(err => {
      res.status(400).send(err.message);
    });
});

app.delete("/users/:id", (req, res) => {
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

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});