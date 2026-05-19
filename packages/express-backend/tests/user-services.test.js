import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";

import bcrypt from "bcrypt";

import User from "../models/user.js";
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

  it("addPoints increments the user's points by the requested amount", async () => {
    const updateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => ({ points: 30 })
    );

    const result = await userServices.addPoints("user-13", 15);

    assert.deepEqual(result, { points: 30 });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "user-13",
      { $inc: { points: 15 } },
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
        args: ["username points permissions badges followers following"]
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
});
