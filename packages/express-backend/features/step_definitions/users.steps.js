import assert from "node:assert/strict";
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { mock } from "node:test";
import supertest from "supertest";

import appModule from "../../AppModule.js";
import User from "../../models/user.js";

const { app } = appModule;

Before(function () {
  this.request = supertest(app);
  this.signupRequest = null;
  this.response = null;
});

After(function () {
  mock.restoreAll();
});

Given("the backend has public users", function () {
  const publicUsers = [
    { username: "alice", points: 20 },
    { username: "bob", points: 10 },
  ];

  mock.method(User, "find", () => ({
    select: async (fields) => {
      assert.equal(fields, "username points");
      return publicUsers;
    },
  }));
});

When("I request the public users list", async function () {
  this.response = await this.request.get("/users");
});

Then("the response status should be {int}", function (statusCode) {
  assert.equal(this.response.status, statusCode);
});

Then("the response should include public user names and points", function () {
  assert.deepEqual(this.response.body, {
    users_list: [
      { username: "alice", points: 20 },
      { username: "bob", points: 10 },
    ],
  });
});

Given("a new user signup request", function () {
  this.signupRequest = {
    username: "acceptance-user",
    email: "acceptance-user@example.com",
    password: "Acceptance123!",
  };

  mock.method(User, "findOne", async () => null);
  mock.method(User.prototype, "save", async function () {
    this._id = "507f1f77bcf86cd799439011";
    this.points = this.points ?? 0;
    this.permissions = this.permissions ?? "regular";
    this.password = "hashed-password-hidden-from-feature";
    return this;
  });
});

When("I submit the signup request", async function () {
  this.response = await this.request.post("/users").send(this.signupRequest);
});

Then("the response should include the created username and email", function () {
  assert.equal(this.response.body.username, this.signupRequest.username);
  assert.equal(this.response.body.email, this.signupRequest.email);
  assert.equal(this.response.body.permissions, "regular");
});
