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
  return User.findByIdAndUpdate(userId, updateData, {
    new: true
  });
}

// Specific functions for api routes

// Create a new user with only username, email, and password
async function createNewUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(
    password,
    saltRounds
  );
  const userData = {
    username,
    email,
    password: hashedPassword
  };

  const existingUsername = await getUserByUsername(
    userData.username
  );
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

    return bcrypt
      .compare(password, user.password)
      .then(match => {
        if (!match) {
          throw new Error("Invalid password");
        } else if (user.permissions === "banned") {
          throw new Error("Banned");
        }
        return user;
      });
  });
}

async function authenticateDevice(username, device) {
  return getUserByUsername(username)
    .then(user => {
      if (!user) {
        throw new Error("User not found");
      }

      const found = [];
      for (let i = 0; i < user.devices.length; i++) {
        if (
          user.devices[i].device == device &&
          user.devices[i].allowed
        ) {
          found.push(user.devices[i]);
        }
      }

      if (!(found.length > 0)) {
        throw Error("Device not permitted");
      }

      return found.length;
    })
    .catch(error => {
      throw Error(error.message);
    });
}

async function getAllNonModeratorUsers() {
  return await User.find({
    permissions: { $nin: ['moderator', 'admin'] }
  }).select("-password");
}

// Public view: only expose username and points for non-moderator users
async function getPublicUsers() {
  return await User.find({
    permissions: { $nin: ['moderator', 'admin'] }
  }).select("username points");
}

async function banUser(userId) {
  return User.findByIdAndUpdate(
    userId,
    { permissions: "Banned" },
    { new: true }
  );
}

async function unbanUser(userId) {
  return User.findByIdAndUpdate(
    userId,
    { permissions: "regular" },
    { new: true }
  );
}

async function getUserFlags(userId) {
  const user = await User.findById(userId).populate(
    "flagList.comment"
  );
  return user.flagList.map(flag => flag.comment);
}

async function addUserFlag(userId, commentId) {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { flagList: { comment: commentId } } },
    { new: true }
  );
}

async function removeUserFlag(userId, commentId) {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { flagList: { comment: commentId } } },
    { new: true }
  );
}

async function upgradeToModerator(userId) {
  return User.findByIdAndUpdate(
    userId,
    { permissions: "moderator" },
    { new: true }
  );
}

async function addPoints(userId, amount = 10) {
  return User.findByIdAndUpdate(
    userId,
    { $inc: { points: amount } },
    { new: true }
  );
}

async function getDevices(username) {
  return getUserByUsername(username).then(user => {
    if (!user) {
      throw Error("No user found.");
    }
    return user.devices;
  });
}

async function getDevice(username, device) {
  return User.find({
    username: username,
    "devices.device": device
  });
}

async function addDevice(
  username,
  device,
  device_brand = null,
  device_designName = null,
  device_deviceName = null,
  device_deviceYearClass = null,
  device_deviceType = null
) {
  return User.findOneAndUpdate(
    { username: username },
    {
      $addToSet: {
        devices: {
          device: device,
          allowed: true,
          device_brand,
          device_designName,
          device_deviceName,
          device_deviceYearClass,
          device_deviceType
        }
      }
    }
  );
}

async function addDeviceIfNotAlready(
  username,
  device,
  device_brand = null,
  device_designName = null,
  device_deviceName = null,
  device_deviceYearClass = null,
  device_deviceType = null
) {
  return getDevice(username, device).then(devices => {
    if (devices.length <= 0) {
      return addDevice(
        username,
        device,
        device_brand,
        device_designName,
        device_deviceName,
        device_deviceYearClass,
        device_deviceType
      );
    }
    return device;
  });
}

async function blockDevice(username, device) {
  return User.findOneAndUpdate(
    { username: username, "devices.device": device },
    { $set: { "devices.$.allowed": false } },
    { new: true }
  )
    .then(user => {
      if (!user) {
        throw Error("No user / device found.");
      }
      return user;
    })
    .catch(error => {
      throw Error(error.message);
    });
}

const getUserById = async id => {
  try {
    return await User.findById(id).select("username");
  } catch (err) {
    console.error("Error in getUserById:", err.message);
    return null;
  }
};

// ---------- User badge code ----------
async function giveBadge(userId, badgeTitle) {
  return User.findByIdAndUpdate(
    userId,
    { $addToSet: { badges: badgeTitle } },
    { new: true }
  );
}

async function removeBadge(userId, badgeTitle) {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { badges: badgeTitle } },
    { new: true }
  );
}

async function purchaseBadge(userId, badgeName, cost) {
  if (!badgeName || typeof badgeName !== "string") {
    throw new Error("Invalid badge name");
  }

  const parsedCost = Number(cost);

  if (!Number.isFinite(parsedCost) || parsedCost <= 0) {
    throw new Error("Invalid badge cost");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if ((user.points || 0) < parsedCost) {
    throw new Error("Insufficient points");
  }

  if ((user.badges || []).includes(badgeName.trim())) {
    throw new Error("Badge already owned");
  }

  user.points -= Math.round(parsedCost);
  user.badges.push(badgeName.trim());

  await user.save();

  return user;
}

export default {
  authenticateUser,
  createNewUser,
  getAllNonModeratorUsers,
  getPublicUsers,
  getUserByUsername,
  banUser,
  unbanUser,
  getUserFlags,
  addUserFlag,
  removeUserFlag,
  upgradeToModerator,
  addPoints,
  getUserById,
  authenticateDevice,
  addDeviceIfNotAlready,
  blockDevice,
  getDevices,
  giveBadge,
  removeBadge,
  purchaseBadge
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
