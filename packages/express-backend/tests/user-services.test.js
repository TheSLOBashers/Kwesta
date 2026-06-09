import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";

import bcrypt from "bcrypt";

import User from "../models/user.js";
import Badge from "../models/badges.js";
import userServices from "../models/user-services.js";
import { createQueryBuilder } from "./helpers/query-builder.js";

afterEach(() => {
  mock.restoreAll();
});

describe("user-services", () => {
  it("getUserByUsername proxies to User.findOne", async () => {
    const expectedUser = { _id: "user-1", username: "khush" };
    const findOneMock = mock.method(
      User,
      "findOne",
      async () => expectedUser
    );

    const result = await userServices.getUserByUsername(
      "khush"
    );

    assert.deepEqual(result, expectedUser);
    assert.deepEqual(findOneMock.mock.calls[0].arguments, [
      { username: "khush" }
    ]);
  });

  it("createNewUser hashes the password and saves when username and email are unique", async () => {
    mock.method(
      bcrypt,
      "hash",
      async password => `hashed:${password}`
    );
    let saveCallCount = 0;
    let savedUser;

    mock.method(User, "findOne", async query => {
      if (query.username === "new-user") {
        return null;
      }
      if (query.email === "new@example.com") {
        return null;
      }
      return null;
    });
    mock.method(User.prototype, "save", async function save() {
      saveCallCount += 1;
      savedUser = {
        username: this.username,
        email: this.email,
        password: this.password
      };

      return { _id: "user-2", ...savedUser };
    });

    const result = await userServices.createNewUser(
      "new-user",
      "new@example.com",
      "secret"
    );

    assert.equal(saveCallCount, 1);
    assert.deepEqual(savedUser, {
      username: "new-user",
      email: "new@example.com",
      password: "hashed:secret"
    });
    assert.equal(result._id, "user-2");
  });

  it("createNewUser rejects duplicate usernames", async () => {
    mock.method(
      bcrypt,
      "hash",
      async password => `hashed:${password}`
    );
    mock.method(User, "findOne", async query => {
      if (query.username === "taken-user") {
        return { _id: "user-3" };
      }
      return null;
    });

    await assert.rejects(
      () =>
        userServices.createNewUser(
          "taken-user",
          "unique@example.com",
          "secret"
        ),
      /Username already exists/
    );
  });

  it("createNewUser rejects duplicate emails", async () => {
    mock.method(
      bcrypt,
      "hash",
      async password => `hashed:${password}`
    );
    mock.method(User, "findOne", async query => {
      if (query.username === "fresh-user") {
        return null;
      }
      if (query.email === "taken@example.com") {
        return { _id: "user-4" };
      }
      return null;
    });

    await assert.rejects(
      () =>
        userServices.createNewUser(
          "fresh-user",
          "taken@example.com",
          "secret"
        ),
      /Email already exists/
    );
  });

  it("authenticateUser returns the user when the password matches", async () => {
    const user = {
      _id: "user-5",
      username: "khush",
      password: "hashed-password",
      permissions: "regular"
    };

    mock.method(User, "findOne", async () => user);
    mock.method(bcrypt, "compare", async () => true);

    const result = await userServices.authenticateUser(
      "khush",
      "secret"
    );

    assert.deepEqual(result, user);
  });

  it("authenticateUser rejects missing users", async () => {
    mock.method(User, "findOne", async () => null);

    await assert.rejects(
      () => userServices.authenticateUser("ghost", "secret"),
      /User not found/
    );
  });

  it("authenticateUser rejects invalid passwords", async () => {
    mock.method(User, "findOne", async () => ({
      password: "hash"
    }));
    mock.method(bcrypt, "compare", async () => false);

    await assert.rejects(
      () => userServices.authenticateUser("khush", "wrong"),
      /Invalid password/
    );
  });

  it("authenticateUser rejects banned users when permissions are banned", async () => {
    mock.method(User, "findOne", async () => ({
      password: "hash",
      permissions: "banned"
    }));
    mock.method(bcrypt, "compare", async () => true);

    await assert.rejects(
      () => userServices.authenticateUser("khush", "secret"),
      /Banned/
    );
  });

  it("getAllNonModeratorUsers excludes moderators and hides passwords", async () => {
    const expectedUsers = [
      { _id: "user-6", username: "member" }
    ];
    const { builder, calls } = createQueryBuilder(
      expectedUsers,
      "select"
    );
    const findMock = mock.method(User, "find", () => builder);

    const result = await userServices.getAllNonModeratorUsers();

    assert.deepEqual(result, expectedUsers);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      { permissions: { $nin: ["moderator", "admin"] } }
    ]);
    assert.deepEqual(calls, [
      { method: "select", args: ["-password"] }
    ]);
  });

  it("getPublicUsers exposes only username and points for non-moderators", async () => {
    const expectedUsers = [
      { _id: "user-public", username: "member", points: 20 }
    ];
    const { builder, calls } = createQueryBuilder(
      expectedUsers,
      "select"
    );
    const findMock = mock.method(User, "find", () => builder);

    const result = await userServices.getPublicUsers();

    assert.deepEqual(result, expectedUsers);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      { permissions: { $nin: ["moderator", "admin"] } }
    ]);
    assert.deepEqual(calls, [
      { method: "select", args: ["username points rankedPoints"] }
    ]);
  });

  it("banUser sets permissions to Banned", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => ({ permissions: "Banned" })
    );

    const result = await userServices.banUser("user-7");

    assert.deepEqual(result, { permissions: "Banned" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-7",
      { permissions: "Banned" },
      { new: true }
    ]);
  });

  it("unbanUser restores regular permissions", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => ({ permissions: "regular" })
    );

    const result = await userServices.unbanUser("user-8");

    assert.deepEqual(result, { permissions: "regular" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-8",
      { permissions: "regular" },
      { new: true }
    ]);
  });

  it("getUserFlags returns populated flagged comments", async () => {
    const expectedFlags = [
      { _id: "comment-1" },
      { _id: "comment-2" }
    ];
    const { builder, calls } = createQueryBuilder(
      {
        flagList: [
          { comment: expectedFlags[0] },
          { comment: expectedFlags[1] }
        ]
      },
      "populate"
    );
    const findByIdMock = mock.method(
      User,
      "findById",
      () => builder
    );

    const result = await userServices.getUserFlags("user-9");

    assert.deepEqual(result, expectedFlags);
    assert.deepEqual(findByIdMock.mock.calls[0].arguments, [
      "user-9"
    ]);
    assert.deepEqual(calls, [
      { method: "populate", args: ["flagList.comment"] }
    ]);
  });

  it("addUserFlag adds a comment to the user's flag list", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => ({ _id: "user-10" })
    );

    const result = await userServices.addUserFlag(
      "user-10",
      "comment-3"
    );

    assert.deepEqual(result, { _id: "user-10" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-10",
      { $addToSet: { flagList: { comment: "comment-3" } } },
      { new: true }
    ]);
  });

  it("removeUserFlag removes a comment from the user's flag list", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => ({ _id: "user-11" })
    );

    const result = await userServices.removeUserFlag(
      "user-11",
      "comment-3"
    );

    assert.deepEqual(result, { _id: "user-11" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-11",
      { $pull: { flagList: { comment: "comment-3" } } },
      { new: true }
    ]);
  });

  it("upgradeToModerator sets moderator permissions", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => ({ permissions: "moderator" })
    );

    const result = await userServices.upgradeToModerator(
      "user-12"
    );

    assert.deepEqual(result, { permissions: "moderator" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-12",
      { permissions: "moderator" },
      { new: true }
    ]);
  });

  it("addPoints increments the user's points and rankedPoints when the requested amount is positive", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => ({ points: 30 })
    );

    const result = await userServices.addPoints("user-13", 15);

    assert.deepEqual(result, { points: 30 });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-13",
      { $inc: { points: 15, rankedPoints: 15 } },
      { new: true }
    ]);
  });

  it("addPoints does not decrement rankedPoints when subtracting points", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => ({ points: 20 })
    );

    const result = await userServices.addPoints("user-13", -10);

    assert.deepEqual(result, { points: 20 });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-13",
      { $inc: { points: -10, rankedPoints: 0 } },
      { new: true }
    ]);
  });

  it("getUserProfile selects social profile fields and populates users", async () => {
    const expectedUser = {
      _id: "user-14",
      username: "khush",
      followers: [],
      following: []
    };
    const calls = [];
    const builder = {
      select(...args) {
        calls.push({ method: "select", args });
        return builder;
      },
      populate(...args) {
        calls.push({ method: "populate", args });
        return calls.length === 3 ? expectedUser : builder;
      }
    };
    const findByIdMock = mock.method(
      User,
      "findById",
      () => builder
    );

    const result = await userServices.getUserProfile("user-14");

    assert.deepEqual(result, expectedUser);
    assert.deepEqual(findByIdMock.mock.calls[0].arguments, [
      "user-14"
    ]);
    assert.deepEqual(calls, [
      {
        method: "select",
        args: ["username points rankedPoints permissions badges followers following"]
      },
      { method: "populate", args: ["followers", "username points"] },
      { method: "populate", args: ["following", "username points"] }
    ]);
  });

  it("followUser adds the target to following and current user to followers", async () => {
    mock.method(User, "findById", async () => ({
      _id: "target-user"
    }));
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async userId => ({ _id: userId })
    );

    const result = await userServices.followUser(
      "current-user",
      "target-user"
    );

    assert.deepEqual(result, { _id: "current-user" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "current-user",
      { $addToSet: { following: "target-user" } },
      { new: true }
    ]);
    assert.deepEqual(updateMock.mock.calls[1].arguments, [
      "target-user",
      { $addToSet: { followers: "current-user" } },
      { new: true }
    ]);
  });

  it("followUser rejects attempts to follow yourself", async () => {
    await assert.rejects(
      () => userServices.followUser("same-user", "same-user"),
      /Users cannot follow themselves/
    );
  });

  it("followUser rejects missing target users", async () => {
    mock.method(User, "findById", async () => null);

    await assert.rejects(
      () => userServices.followUser("current-user", "missing-user"),
      /User not found/
    );
  });

  it("unfollowUser removes the target from following and current user from followers", async () => {
    mock.method(User, "findById", async () => ({
      _id: "target-user"
    }));
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async userId => ({ _id: userId })
    );

    const result = await userServices.unfollowUser(
      "current-user",
      "target-user"
    );

    assert.deepEqual(result, { _id: "current-user" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "current-user",
      { $pull: { following: "target-user" } },
      { new: true }
    ]);
    assert.deepEqual(updateMock.mock.calls[1].arguments, [
      "target-user",
      { $pull: { followers: "current-user" } },
      { new: true }
    ]);
  });

  it("unfollowUser rejects attempts to unfollow yourself", async () => {
    await assert.rejects(
      () => userServices.unfollowUser("same-user", "same-user"),
      /Users cannot unfollow themselves/
    );
  });

  it("unfollowUser rejects missing target users", async () => {
    mock.method(User, "findById", async () => null);

    await assert.rejects(
      () => userServices.unfollowUser("current-user", "missing-user"),
      /User not found/
    );
  });

  it("authenticateDevice returns permitted matching devices", async () => {
    mock.method(User, "findOne", async () => ({
      devices: [
        { device: "ios:simulator", allowed: false },
        { device: "android:emulator", allowed: true }
      ]
    }));

    const result = await userServices.authenticateDevice(
      "khush",
      "android:emulator"
    );

    assert.equal(result, 1);
  });

  it("authenticateDevice rejects missing users and blocked devices", async () => {
    mock.method(User, "findOne", async usernameQuery => {
      if (usernameQuery.username === "ghost") {
        return null;
      }
      return {
        devices: [{ device: "android:emulator", allowed: false }]
      };
    });

    await assert.rejects(
      () => userServices.authenticateDevice("ghost", "android:emulator"),
      /User not found/
    );
    await assert.rejects(
      () => userServices.authenticateDevice("khush", "android:emulator"),
      /Device not permitted/
    );
  });

  it("getDevices returns user devices and rejects missing users", async () => {
    mock.method(User, "findOne", async query => {
      if (query.username === "khush") {
        return { devices: [{ device: "android:emulator" }] };
      }
      return null;
    });

    const result = await userServices.getDevices("khush");

    assert.deepEqual(result, [{ device: "android:emulator" }]);
    await assert.rejects(
      () => userServices.getDevices("ghost"),
      /No user found/
    );
  });

  it("addDeviceIfNotAlready adds unseen devices and returns existing devices unchanged", async () => {
    const findMock = mock.method(User, "find", async query => {
      if (query["devices.device"] === "known-device") {
        return [{ _id: "user-device" }];
      }
      return [];
    });
    const updateMock = mock.method(
      User,
      "findOneAndUpdate",
      async () => ({ _id: "user-device" })
    );

    const added = await userServices.addDeviceIfNotAlready(
      "khush",
      "new-device",
      "brand",
      "design",
      "name",
      2026,
      "phone"
    );
    const existing = await userServices.addDeviceIfNotAlready(
      "khush",
      "known-device"
    );

    assert.deepEqual(added, { _id: "user-device" });
    assert.equal(existing, "known-device");
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      { username: "khush", "devices.device": "new-device" }
    ]);
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      { username: "khush" },
      {
        $addToSet: {
          devices: {
            device: "new-device",
            allowed: true,
            device_brand: "brand",
            device_designName: "design",
            device_deviceName: "name",
            device_deviceYearClass: 2026,
            device_deviceType: "phone"
          }
        }
      }
    ]);
  });

  it("blockDevice blocks matching devices and rejects missing devices", async () => {
    const blockedUser = { _id: "user-device", devices: [] };
    const updateMock = mock.method(
      User,
      "findOneAndUpdate",
      async query =>
        query["devices.device"] === "known-device" ? blockedUser : null
    );

    const result = await userServices.blockDevice(
      "khush",
      "known-device"
    );

    assert.deepEqual(result, blockedUser);
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      { username: "khush", "devices.device": "known-device" },
      { $set: { "devices.$.allowed": false } },
      { new: true }
    ]);
    await assert.rejects(
      () => userServices.blockDevice("khush", "missing-device"),
      /No user \/ device found/
    );
  });

  it("getUserById selects usernames and returns null on lookup errors", async () => {
    const expectedUser = { _id: "user-15", username: "khush" };
    const { builder, calls } = createQueryBuilder(
      expectedUser,
      "select"
    );
    mock.method(User, "findById", id => {
      if (id === "bad-id") {
        throw new Error("Cast failed");
      }
      return builder;
    });
    const consoleMock = mock.method(console, "error", () => {});

    const result = await userServices.getUserById("user-15");
    const failed = await userServices.getUserById("bad-id");

    assert.deepEqual(result, expectedUser);
    assert.equal(failed, null);
    assert.deepEqual(calls, [
      { method: "select", args: ["username"] }
    ]);
    assert.equal(consoleMock.mock.calls.length, 1);
  });

  it("giveBadge and removeBadge update badge ownership", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async (userId, update) => ({ _id: userId, update })
    );

    await userServices.giveBadge("user-16", "kwester");
    await userServices.removeBadge("user-16", "kwester");

    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-16",
      { $addToSet: { badges: "kwester" } },
      { new: true }
    ]);
    assert.deepEqual(updateMock.mock.calls[1].arguments, [
      "user-16",
      { $pull: { badges: "kwester" } },
      { new: true }
    ]);
  });

  it("purchaseBadge spends rounded points and stores trimmed badge names", async () => {
    const user = {
      points: 50,
      badges: [],
      save: mock.fn(async () => user)
    };
    mock.method(User, "findById", async () => user);

    const result = await userServices.purchaseBadge(
      "user-17",
      " explorer ",
      12.4
    );

    assert.equal(result.points, 38);
    assert.deepEqual(result.badges, ["explorer"]);
    assert.equal(user.save.mock.calls.length, 1);
  });

  it("purchaseBadge validates inputs and user state", async () => {
    await assert.rejects(
      () => userServices.purchaseBadge("user-17", "", 10),
      /Invalid badge name/
    );
    await assert.rejects(
      () => userServices.purchaseBadge("user-17", "kwester", 0),
      /Invalid badge cost/
    );

    mock.method(User, "findById", async userId => {
      if (userId === "missing") {
        return null;
      }
      if (userId === "poor") {
        return { points: 1, badges: [] };
      }
      return { points: 50, badges: ["kwester"] };
    });

    await assert.rejects(
      () => userServices.purchaseBadge("missing", "kwester", 10),
      /User not found/
    );
    await assert.rejects(
      () => userServices.purchaseBadge("poor", "kwester", 10),
      /Insufficient points/
    );
    await assert.rejects(
      () => userServices.purchaseBadge("owner", "kwester", 10),
      /Badge already owned/
    );
  });

  it("getUserBadges returns empty lists and badge details", async () => {
    const badgeDetails = [
      { name: "kwester", description: "First login", cost: 10 }
    ];
    mock.method(User, "findById", async userId => {
      if (userId === "missing") {
        return null;
      }
      if (userId === "empty") {
        return { badges: [] };
      }
      return { badges: ["kwester"] };
    });
    const { builder, calls } = createQueryBuilder(
      badgeDetails,
      "select"
    );
    const badgeFindMock = mock.method(Badge, "find", () => builder);

    const empty = await userServices.getUserBadges("empty");
    const result = await userServices.getUserBadges("owner");

    assert.deepEqual(empty, []);
    assert.deepEqual(result, badgeDetails);
    assert.deepEqual(badgeFindMock.mock.calls[0].arguments, [
      { name: { $in: ["kwester"] } }
    ]);
    assert.deepEqual(calls, [
      { method: "select", args: ["name description cost"] }
    ]);
    await assert.rejects(
      () => userServices.getUserBadges("missing"),
      /User not found/
    );
  });
});
