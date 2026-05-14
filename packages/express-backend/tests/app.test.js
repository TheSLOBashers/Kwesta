
import assert from "node:assert/strict";
import { afterEach, describe, it, mock, beforeEach } from "node:test";
//import appModule from "../backend.js";
//import supertest from "supertest";
//const {app, dbconn} = appModule;
 
import appModule from "../AppModule.js";
import supertest from "supertest";
const {app, connectToMongo, disconnectFromMongo} = appModule;

beforeEach(async () => {
  await connectToMongo(); 
});

afterEach(async () => {
  await disconnectFromMongo();
});

describe("app", () => {

  it("Testing app endpoint", async () => {
    const request = supertest(app);
    const response = await request.get("/");
    assert.strictEqual(response.status, 200);
    await disconnectFromMongo();
  });

  it("Testing auth endpoint", async () => {
    const request = supertest(app);
    const response_login = await request.post("/auth/login").send({
      username: "test-data",
      password: "test-data",
      device_brand: "??",
      device_designName: "??",
      device_deviceName: "Emulatorv3",
      device_deviceYearClass: "??",
      device_deviceType: ""
    });
    assert.strictEqual(response_login.status, 200);
    assert.ok(response_login.body.token);
    const request_test = await request.get("/auth/test").set("Authorization", `Bearer ${response_login.body.token}`);
    assert.strictEqual(request_test.status, 200);
    const request_devices = await request.get("/auth/devices").set("Authorization", `Bearer ${response_login.body.token}`);
    assert.strictEqual(request_test.status, 200);
    await disconnectFromMongo();
  });

  it("Testing auth endpoint - moderator", async () => {
    const request = supertest(app);
    const response_login = await request.post("/auth/login").send({
      username: "admin",
      password: "admin",
      device_brand: "??",
      device_designName: "??",
      device_deviceName: "Emulatorv3",
      device_deviceYearClass: "??",
      device_deviceType: ""
    });
    assert.strictEqual(response_login.status, 200);
    assert.ok(response_login.body.token);
    assert.ok(response_login.body.permissions);
  });

  it("Testing comments endpoint - admin", async () => {
    const request = supertest(app);
    const response = await request.get("/comments/6a04096d04cf70b39fc8dd3d");
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.comment.author.username, "test-data");
    assert.strictEqual(response.body.comment.comment, "test-data");
    assert.strictEqual(response.body.comment.location.lat, 0);
    assert.strictEqual(response.body.comment.location.lng, 0);
    const response_login = await request.post("/auth/login").send({
      username: "admin",
      password: "admin",
      device_brand: "??",
      device_designName: "??",
      device_deviceName: "Emulatorv3",
      device_deviceYearClass: "??",
      device_deviceType: ""
    });
    assert.strictEqual(response_login.status, 200);
    const response_new = await request.post("/comments").send({
      comment: "test-data-comment",
      location: {lat: 0, lng: 0}
    }).set("Authorization", `Bearer ${response_login.body.token}`);
    assert.strictEqual(response_new.status, 201);
    const response_del = await request.delete(`/comments/${response_new.body.comment._id}`).set("Authorization", `Bearer ${response_login.body.token}`);
    assert.strictEqual(response_del.status, 200);
    await disconnectFromMongo();
  });

  it("Testing comments endpoint", async () => {
    const request = supertest(app);
    const response = await request.get("/comments/6a04096d04cf70b39fc8dd3d");
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.comment.author.username, "test-data");
    assert.strictEqual(response.body.comment.comment, "test-data");
    assert.strictEqual(response.body.comment.location.lat, 0);
    assert.strictEqual(response.body.comment.location.lng, 0);
    await disconnectFromMongo();
  });

  it("Testing events endpoint", async () => {
    const request = supertest(app);
    const response = await request.get("/events/6a040ba6bf5a78bf0e401ac4");
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.event.description, "test-data");
    assert.strictEqual(response.body.event.location.lat, 0);
    assert.strictEqual(response.body.event.location.lng, 0);
    await disconnectFromMongo();
  });

  it("Testing quests endpoint", async () => {
    const request = supertest(app);
    const response = await request.get("/quests/6a040be3bf5a78bf0e401ac7");
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.quest.description, "test-data");
    assert.strictEqual(response.body.quest.location.lat, 0);
    assert.strictEqual(response.body.quest.location.lng, 0);
    await disconnectFromMongo();
  });

});
