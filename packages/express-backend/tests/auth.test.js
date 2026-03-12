import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";

import User from "../models/user.js";
import userServices from "../models/user-services.js";
import { createQueryBuilder } from "./helpers/query-builder.js";

import {
  authenticateToken,
  authenticateModerator
} from "../routes/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { error } from "node:console";
import dotenv from "dotenv";
dotenv.config();
const saltRounds = 10;

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
});
