import User from "./user.js";
import bcrypt from "bcrypt";

// constant values
const saltRounds = 10;

// Basic functions for user services
function getUserByUsername(username) {
  return User.findOne({ username: username });
}

function getUserByEmail(email) {
  return User.findOne({ email: email });
}

function createUser(userData) {
  const newUser = new User(userData);
  return newUser.save();
}

function updateUser(userId, updateData) {
  return User.findByIdAndUpdate(userId, updateData, { new: true });
}

// Specific functions for api routes

// Create a new user with only username, email, and password
async function createNewUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userData = { username, email, password: hashedPassword };

  const existingUsername = await getUserByUsername(userData.username);
  const existingEmail = await getUserByEmail(userData.email);

  if (existingUsername && existingUsername._id) {
    throw new Error("Username already exists");
  } else if (existingEmail && existingEmail._id) {
    throw new Error("Email already exists");
  } else {
    return createUser(userData);
  }
}

async function authenticateUser(username, password) {
  return getUserByUsername(username).then(user => {
    if (!user) {
      throw new Error("User not found");
    }

    return bcrypt.compare(password, user.password).then(match => {
      if (!match) {
        throw new Error("Invalid password");
      }
      return user;
    });
  });
}

export default {
  authenticateUser,
  createNewUser
};

/*
module.exports = {
  registerUser,
  authenticateUser,
  getUserByUsername
};

import userModel from "./user.js";

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  } else {
    promise = findUserByNameAndJob(name, job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function findUserByNameAndJob(name, job){
    return userModel.find({ name: name, job: job });
}

function deleteUser(id){
    return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  deleteUser
};
*/