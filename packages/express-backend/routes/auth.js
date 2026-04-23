import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import user_services from "../models/user-services.js";
const {
  authenticateUser,
  createNewUser,
  getAllNonModeratorUsers,
  getUserByUsername,
  banUser,
  unbanUser,
  getUserFlags,
  addUserFlag,
  removeUserFlag,
  upgradeToModerator,
  authenticateDevice,
  addDeviceIfNotAlready,
  blockDevice,
  getDevices
} = user_services;
dotenv.config();
const router = express.Router();

// routes
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const device_brand = req.body.device_brand;
  const device_designName = req.body.device_designName;
  const device_deviceName = req.body.device_deviceName;
  const device_deviceYearClass = req.body.device_deviceYearClass;
  const device_deviceType = req.body.device_deviceType;

  let user = null;
  let device = null;

  try {
    user = await authenticateUser(username, password);
    if (device_brand === null || device_designName === null || device_deviceName === null || device_deviceYearClass === null || device_deviceType === null) {
      throw Error("All device details must be specified");
    }
    device = device_brand + ":" + device_designName + ":" + device_deviceName + ":" + device_deviceYearClass + ":" + device_deviceType;
    await addDeviceIfNotAlready(username, device, device_brand, device_designName, device_deviceName, device_deviceYearClass, device_deviceType);
    await authenticateDevice(username, device);
  } catch (error) {
    if (error.message === "User not found" || error.message === "Invalid password") {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    else if (error.message === "Banned") {
      return res.status(401).json({ message: "Account banned" });
    }
    else if (error.message === "Device not permitted") {
      return res.status(401).json({ message: "Device not permitted" });
    }
    return res.status(500).send("Internal server error");
  }

  const token = jwt.sign(
    { username, device },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  let response = { token };

  if (user && user.permissions === "moderator") {
    response = { token, permissions: "moderator" }
  }

  res.json(response);
});

router.get('/test', authenticateToken, (req, res) => {
  res.json({ valid: true });
});

router.post('/blockDevice', authenticateToken, (req, res) => {
  const username = req.user.username;
  const device = req.body.device;

  try {
    if (device === null) {
      throw Error("Device must be specified");
    };
    blockDevice(username, device);
  }
  catch (error) {
    return res.status(500).send("Internal server error");
  }

  return res.status(201).send("Device blocked.");
})

router.get('/devices', authenticateToken, async (req, res) => {
  try {
    let devices = await getDevices(req.user.username).catch((error) => { throw Error(error.message) });
    return res.status(201).json(devices);
  }
  catch (error) {
    return res.status(500).send("Internal server error");
  }
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
        authenticateDevice(req.user.username, user.device)
          .then(() => {
            req.user._id = foundUser._id;
            next();
          })
          .catch(() => {
            return res.status(500).send("Device blocked.");
          })
      })
      .catch(() => {
        return res.status(500).send("Internal Server Error");
      });
  });
}

function authenticateModerator(req, res, next) {
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
        else if (foundUser.permissions !== "moderator") {
          return res.status(401).json({ message: "User not moderator" });
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
  authenticateToken,
  authenticateModerator
};