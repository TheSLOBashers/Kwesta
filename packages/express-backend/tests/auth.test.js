import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";

import User from "../models/user.js";
import userServices from "../models/user-services.js";

import express from "express";
import supertest from "supertest";
import authRouter, {
  authenticateAdmin,
  authenticateToken,
  authenticateModerator
} from "../routes/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { error } from "node:console";
import dotenv from "dotenv";
dotenv.config();
const saltRounds = 10;
process.env.ACCESS_TOKEN_SECRET ||= "test-secret";

function createAuthApp() {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRouter);
  return app;
}

function createToken(payload = {}) {
  return jwt.sign(
    {
      username: "testuser",
      device: "brand:design:name:2026:phone",
      ...payload
    },
    process.env.ACCESS_TOKEN_SECRET
  );
}

async function waitForMiddleware() {
  await new Promise(resolve => setImmediate(resolve));
}

function createMockResponse() {
  const res = {
    statusCode: null,
    body: null,
    sent: null,
    sendStatusCode: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    send(body) {
      this.sent = body;
      return this;
    },
    sendStatus(code) {
      this.sendStatusCode = code;
      return this;
    }
  };
  return res;
}

//process.env.JWT_SECRET = "test-secret";

afterEach(() => {
  mock.restoreAll();
});

describe("auth", () => {
  it("Testing JWTs regular users", async () => {
    const testSecret = "testsecret";
    const testUsername = "testuser";
    const testPassword = "testpassword";
    const hashedPassword = await bcrypt.hash(
      testPassword,
      saltRounds
    );
    const expectedUser = {
      _id: "user-1",
      username: "testuser",
      password: hashedPassword
    };
    const findOneMock = mock.method(
      User,
      "findOne",
      async () => expectedUser
    );

    let user = await userServices.authenticateUser(
      testUsername,
      testPassword
    );

    const token = jwt.sign(
      { username: user.username },
      testSecret,
      { expiresIn: "4h" }
    );

    let response = { token };

    if (user && user.permissions === "moderator") {
      response = { token, permissions: "moderator" };
    }

    assert.strictEqual(response.token, token);
    assert.strictEqual(response.permissions, undefined);
  });

  it("Testing JWTs moderators", async () => {
    const testSecret = "testsecret";
    const testUsername = "testuser";
    const testPassword = "testpassword";
    const hashedPassword = await bcrypt.hash(
      testPassword,
      saltRounds
    );
    const expectedUser = {
      _id: "user-1",
      username: "testuser",
      password: hashedPassword,
      permissions: "moderator"
    };
    const findOneMock = mock.method(
      User,
      "findOne",
      async () => expectedUser
    );

    let user = await userServices.authenticateUser(
      testUsername,
      testPassword
    );

    const token = jwt.sign(
      { username: user.username },
      testSecret,
      { expiresIn: "4h" }
    );

    let response = { token };

    if (user && user.permissions === "moderator") {
      response = { token, permissions: "moderator" };
    }

    assert.strictEqual(response.token, token);
    assert.strictEqual(response.permissions, "moderator");
  });



  /*
  it("Testing JWT authorization for regular users", async () => {
    let passed = false;

    const testSecret = process.env.ACCESS_TOKEN_SECRET;
    const testUsername = "testuser";
    const testPassword = "testpassword";
    const hashedPassword = await bcrypt.hash(
      testPassword,
      saltRounds
    );
    const expectedUser = {
      _id: "user-1",
      username: "testuser",
      password: hashedPassword,
    };
    const findOneMock = mock.method(
      User,
      "findOne",
      async () => expectedUser
    );

    let user = await userServices.authenticateUser(
      testUsername,
      testPassword
    );

    const token = jwt.sign(
      { username: user.username },
      testSecret,
      { expiresIn: "4h" }
    );

    function mockNext() {
      passed = true;
    }

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const res = {
      status: (msg) => (
        error(msg),
        {
          json: (msg) => {
            error(msg);
          },
          send: (msg) => {
            error(msg);
          }
        }
      ),
      json: (msg) => {
        error(msg);
      },
      sendStatus: (msg) => {
        error(msg);
      }
    };

    await authenticateToken(req, res, mockNext);

    assert.strictEqual(passed, true);
  });
*/
  it("Testing JWT authorization for moderators", async () => {
    let passed = false;

    const testSecret = process.env.ACCESS_TOKEN_SECRET;
    const testUsername = "testuser";
    const testPassword = "testpassword";
    const hashedPassword = await bcrypt.hash(
      testPassword,
      saltRounds
    );
    const expectedUser = {
      _id: "user-1",
      username: "testuser",
      password: hashedPassword,
      permissions: "moderator"
    };
    const findOneMock = mock.method(
      User,
      "findOne",
      async () => expectedUser
    );

    let user = await userServices.authenticateUser(
      testUsername,
      testPassword
    );

    const token = jwt.sign(
      { username: user.username },
      testSecret,
      { expiresIn: "4h" }
    );

    function mockNext() {
      passed = true;
    }

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const res = {
      status: (msg) => (
        error(msg),
        {
          json: (msg) => {
            error(msg);
          },
          send: (msg) => {
            error(msg);
          }
        }
      ),
      json: (msg) => {
        error(msg);
      },
      sendStatus: (msg) => {
        error(msg);
      }
    };

    await authenticateModerator(req, res, mockNext);

    assert.strictEqual(passed, true);
  });

  it("login returns a token and records a permitted device", async () => {
    const app = createAuthApp();
    const hashedPassword = await bcrypt.hash("testpassword", saltRounds);
    const user = {
      _id: "user-login",
      username: "testuser",
      password: hashedPassword,
      permissions: "regular",
      devices: [
        {
          device: "brand:design:name:2026:phone",
          allowed: true
        }
      ]
    };
    const findOneMock = mock.method(User, "findOne", async () => user);
    const findMock = mock.method(User, "find", async () => []);
    const updateMock = mock.method(
      User,
      "findOneAndUpdate",
      async () => user
    );
    const badgeMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => user
    );

    const response = await supertest(app).post("/auth/login").send({
      username: "testuser",
      password: "testpassword",
      device_brand: "brand",
      device_designName: "design",
      device_deviceName: "name",
      device_deviceYearClass: "2026",
      device_deviceType: "phone"
    });

    assert.equal(response.status, 200);
    assert.ok(response.body.token);
    assert.equal(response.body.permissions, undefined);
    assert.equal(findOneMock.mock.calls.length, 2);
    assert.equal(findMock.mock.calls.length, 1);
    assert.equal(updateMock.mock.calls.length, 1);
    assert.deepEqual(badgeMock.mock.calls[0].arguments, [
      "user-login",
      { $addToSet: { badges: "kwester" } },
      { new: true }
    ]);
  });

  it("login includes moderator and admin permissions in successful responses", async () => {
    const app = createAuthApp();
    const hashedPassword = await bcrypt.hash("testpassword", saltRounds);
    const usersByName = {
      moderator: {
        _id: "moderator-id",
        username: "moderator",
        password: hashedPassword,
        permissions: "moderator",
        devices: [{ device: "brand:design:name:2026:phone", allowed: true }]
      },
      admin: {
        _id: "admin-id",
        username: "admin",
        password: hashedPassword,
        permissions: "admin",
        devices: [{ device: "brand:design:name:2026:phone", allowed: true }]
      }
    };
    mock.method(User, "findOne", async query => usersByName[query.username]);
    mock.method(User, "find", async () => [{ _id: "existing-device" }]);
    mock.method(User, "findByIdAndUpdate", async () => ({}));

    const moderatorResponse = await supertest(app).post("/auth/login").send({
      username: "moderator",
      password: "testpassword",
      device_brand: "brand",
      device_designName: "design",
      device_deviceName: "name",
      device_deviceYearClass: "2026",
      device_deviceType: "phone"
    });
    const adminResponse = await supertest(app).post("/auth/login").send({
      username: "admin",
      password: "testpassword",
      device_brand: "brand",
      device_designName: "design",
      device_deviceName: "name",
      device_deviceYearClass: "2026",
      device_deviceType: "phone"
    });

    assert.equal(moderatorResponse.status, 200);
    assert.equal(moderatorResponse.body.permissions, "moderator");
    assert.equal(adminResponse.status, 200);
    assert.equal(adminResponse.body.permissions, "admin");
  });

  it("login maps known authentication errors to client responses", async () => {
    const app = createAuthApp();
    const hashedPassword = await bcrypt.hash("testpassword", saltRounds);
    const usersByName = {
      wrongPassword: {
        username: "wrongPassword",
        password: hashedPassword,
        devices: [{ device: "brand:design:name:2026:phone", allowed: true }]
      },
      banned: {
        username: "banned",
        password: hashedPassword,
        permissions: "banned",
        devices: [{ device: "brand:design:name:2026:phone", allowed: true }]
      },
      blockedDevice: {
        username: "blockedDevice",
        password: hashedPassword,
        devices: [{ device: "brand:design:name:2026:phone", allowed: false }]
      }
    };
    mock.method(User, "findOne", async query => usersByName[query.username]);
    mock.method(User, "find", async () => [{ _id: "existing-device" }]);

    const missingUser = await supertest(app).post("/auth/login").send({
      username: "missing",
      password: "testpassword",
      device_brand: "brand",
      device_designName: "design",
      device_deviceName: "name",
      device_deviceYearClass: "2026",
      device_deviceType: "phone"
    });
    const invalidPassword = await supertest(app).post("/auth/login").send({
      username: "wrongPassword",
      password: "wrong",
      device_brand: "brand",
      device_designName: "design",
      device_deviceName: "name",
      device_deviceYearClass: "2026",
      device_deviceType: "phone"
    });
    const banned = await supertest(app).post("/auth/login").send({
      username: "banned",
      password: "testpassword",
      device_brand: "brand",
      device_designName: "design",
      device_deviceName: "name",
      device_deviceYearClass: "2026",
      device_deviceType: "phone"
    });
    const blockedDevice = await supertest(app).post("/auth/login").send({
      username: "blockedDevice",
      password: "testpassword",
      device_brand: "brand",
      device_designName: "design",
      device_deviceName: "name",
      device_deviceYearClass: "2026",
      device_deviceType: "phone"
    });
    const missingDeviceDetails = await supertest(app).post("/auth/login").send({
      username: "wrongPassword",
      password: "testpassword",
      device_brand: null,
      device_designName: "design",
      device_deviceName: "name",
      device_deviceYearClass: "2026",
      device_deviceType: "phone"
    });

    assert.equal(missingUser.status, 401);
    assert.deepEqual(missingUser.body, {
      message: "Invalid username or password"
    });
    assert.equal(invalidPassword.status, 401);
    assert.deepEqual(invalidPassword.body, {
      message: "Invalid username or password"
    });
    assert.equal(banned.status, 401);
    assert.deepEqual(banned.body, { message: "Account banned" });
    assert.equal(blockedDevice.status, 401);
    assert.deepEqual(blockedDevice.body, {
      message: "Device not permitted"
    });
    assert.equal(missingDeviceDetails.status, 500);
    assert.equal(missingDeviceDetails.text, "Internal server error");
  });

  it("authenticated device routes expose and block devices", async () => {
    const app = createAuthApp();
    const token = createToken();
    const user = {
      _id: "user-device",
      username: "testuser",
      devices: [{ device: "brand:design:name:2026:phone", allowed: true }]
    };
    const findOneMock = mock.method(User, "findOne", async () => user);
    const blockMock = mock.method(
      User,
      "findOneAndUpdate",
      async () => user
    );

    const devicesResponse = await supertest(app)
      .get("/auth/devices")
      .set("Authorization", `Bearer ${token}`);
    const blockResponse = await supertest(app)
      .post("/auth/blockDevice")
      .set("Authorization", `Bearer ${token}`)
      .send({ device: "brand:design:name:2026:phone" });
    const badBlockResponse = await supertest(app)
      .post("/auth/blockDevice")
      .set("Authorization", `Bearer ${token}`)
      .send({ device: null });

    assert.equal(devicesResponse.status, 201);
    assert.deepEqual(devicesResponse.body, user.devices);
    assert.equal(blockResponse.status, 201);
    assert.equal(blockResponse.text, "Device blocked.");
    assert.equal(badBlockResponse.status, 500);
    assert.equal(findOneMock.mock.calls.length, 7);
    assert.equal(blockMock.mock.calls.length, 1);
  });

  it("auth test route returns valid for authenticated users", async () => {
    const app = createAuthApp();
    const token = createToken();
    mock.method(User, "findOne", async () => ({
      _id: "user-test-route",
      username: "testuser",
      devices: [{ device: "brand:design:name:2026:phone", allowed: true }]
    }));

    const response = await supertest(app)
      .get("/auth/test")
      .set("Authorization", `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { valid: true });
  });

  it("devices route returns 500 when devices cannot be loaded", async () => {
    const app = createAuthApp();
    const token = createToken();
    let callCount = 0;
    mock.method(User, "findOne", async () => {
      callCount += 1;
      if (callCount <= 2) {
        return {
          _id: "user-devices-error",
          username: "testuser",
          devices: [
            { device: "brand:design:name:2026:phone", allowed: true }
          ]
        };
      }
      return null;
    });

    const response = await supertest(app)
      .get("/auth/devices")
      .set("Authorization", `Bearer ${token}`);

    assert.equal(response.status, 500);
    assert.equal(response.text, "Internal server error");
  });

  it("authenticateToken rejects missing, invalid, unknown-user, and blocked-device requests", async () => {
    let nextCalled = false;
    const validReq = {
      headers: { authorization: `Bearer ${createToken()}` }
    };
    const missingReq = { headers: {} };
    const invalidReq = {
      headers: { authorization: "Bearer invalid-token" }
    };

    let res = createMockResponse();
    authenticateToken(missingReq, res, () => {});
    assert.equal(res.sendStatusCode, 401);

    res = createMockResponse();
    authenticateToken(invalidReq, res, () => {});
    assert.equal(res.sendStatusCode, 403);

    mock.method(User, "findOne", async () => null);
    res = createMockResponse();
    authenticateToken(validReq, res, () => {});
    await waitForMiddleware();
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: "User not found" });

    mock.restoreAll();
    mock.method(User, "findOne", async () => ({
      _id: "user-token",
      devices: [{ device: "brand:design:name:2026:phone", allowed: false }]
    }));
    res = createMockResponse();
    authenticateToken(validReq, res, () => {
      nextCalled = true;
    });
    await waitForMiddleware();
    assert.equal(res.statusCode, 500);
    assert.equal(res.sent, "Device blocked.");
    assert.equal(nextCalled, false);

    mock.restoreAll();
    mock.method(User, "findOne", async () => {
      throw new Error("database unavailable");
    });
    res = createMockResponse();
    authenticateToken(validReq, res, () => {
      nextCalled = true;
    });
    await waitForMiddleware();
    assert.equal(res.statusCode, 500);
    assert.equal(res.sent, "Internal Server Error");
  });

  it("authenticateToken accepts valid users with permitted devices", async () => {
    let nextCalled = false;
    const req = {
      headers: { authorization: `Bearer ${createToken()}` }
    };
    const res = createMockResponse();
    mock.method(User, "findOne", async () => ({
      _id: "user-token",
      devices: [{ device: "brand:design:name:2026:phone", allowed: true }]
    }));

    authenticateToken(req, res, () => {
      nextCalled = true;
    });
    await waitForMiddleware();

    assert.equal(nextCalled, true);
    assert.equal(req.user._id, "user-token");
  });

  it("authenticateModerator rejects non-moderators and missing users", async () => {
    const req = {
      headers: { authorization: `Bearer ${createToken()}` }
    };
    mock.method(User, "findOne", async () => null);
    let res = createMockResponse();

    authenticateModerator(req, res, () => {});
    await waitForMiddleware();
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: "User not found" });

    mock.restoreAll();
    mock.method(User, "findOne", async () => ({
      _id: "regular-id",
      permissions: "regular"
    }));
    res = createMockResponse();
    authenticateModerator(req, res, () => {});
    await waitForMiddleware();
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, {
      message: "User not moderator or admin"
    });

    mock.restoreAll();
    mock.method(User, "findOne", async () => {
      throw new Error("database unavailable");
    });
    res = createMockResponse();
    authenticateModerator(req, res, () => {});
    await waitForMiddleware();
    assert.equal(res.statusCode, 500);
    assert.equal(res.sent, "Internal Server Error");
  });

  it("authenticateModerator rejects missing and invalid tokens", () => {
    let res = createMockResponse();
    authenticateModerator({ headers: {} }, res, () => {});
    assert.equal(res.sendStatusCode, 401);

    res = createMockResponse();
    authenticateModerator(
      { headers: { authorization: "Bearer invalid-token" } },
      res,
      () => {}
    );
    assert.equal(res.sendStatusCode, 403);
  });

  it("authenticateAdmin allows admins and rejects other authenticated users", async () => {
    const req = {
      headers: { authorization: `Bearer ${createToken()}` }
    };
    let nextCalled = false;
    mock.method(User, "findOne", async () => ({
      _id: "regular-id",
      permissions: "moderator"
    }));
    let res = createMockResponse();

    authenticateAdmin(req, res, () => {});
    await waitForMiddleware();
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: "User not admin" });

    mock.restoreAll();
    mock.method(User, "findOne", async () => ({
      _id: "admin-id",
      permissions: "admin"
    }));
    res = createMockResponse();
    authenticateAdmin(req, res, () => {
      nextCalled = true;
    });
    await waitForMiddleware();

    assert.equal(nextCalled, true);
    assert.equal(req.user._id, "admin-id");

    mock.restoreAll();
    mock.method(User, "findOne", async () => null);
    res = createMockResponse();
    authenticateAdmin(req, res, () => {});
    await waitForMiddleware();
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: "User not found" });

    mock.restoreAll();
    mock.method(User, "findOne", async () => {
      throw new Error("database unavailable");
    });
    res = createMockResponse();
    authenticateAdmin(req, res, () => {});
    await waitForMiddleware();
    assert.equal(res.statusCode, 500);
    assert.equal(res.sent, "Internal Server Error");
  });

  it("authenticateAdmin rejects missing and invalid tokens", () => {
    let res = createMockResponse();
    authenticateAdmin({ headers: {} }, res, () => {});
    assert.equal(res.sendStatusCode, 401);

    res = createMockResponse();
    authenticateAdmin(
      { headers: { authorization: "Bearer invalid-token" } },
      res,
      () => {}
    );
    assert.equal(res.sendStatusCode, 403);
  });
});
