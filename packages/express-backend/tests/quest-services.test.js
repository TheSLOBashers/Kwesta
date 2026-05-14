import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";

import Quest from "../models/quest.js";
import questServices from "../models/quest-services.js";
import { createQueryBuilder } from "./helpers/query-builder.js";

afterEach(() => {
  mock.restoreAll();
});

describe("quest-services", () => {
  it("createQuest saves a new quest document", async () => {
    const questData = {
      author: "507f1f77bcf86cd799439011",
      date: "2026-03-15",
      description: "Beach cleanup",
      location: { lat: 35.1, lng: -120.6 }
    };
    let savedQuest;

    mock.method(Quest.prototype, "save", async function save() {
      savedQuest = {
        author: String(this.author),
        date: this.date,
        description: this.description,
        location: this.location.toObject()
      };

      return { _id: "quest-1", ...savedQuest };
    });

    const result = await questServices.createQuest(questData);

    assert.deepEqual(savedQuest, questData);
    assert.equal(result._id, "quest-1");
  });

  it("getQuests populates author usernames and sorts newest first", async () => {
    const expectedQuests = [{ _id: "quest-2" }];
    const { builder, calls } = createQueryBuilder(
      expectedQuests,
      "lean"
    );
    const findMock = mock.method(Quest, "find", () => builder);

    const result = await questServices.getQuests();

    assert.deepEqual(result, expectedQuests);
    assert.deepEqual(findMock.mock.calls[0].arguments, []);
    assert.deepEqual(calls, [
      { method: "populate", args: ["author", "username"] },
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "lean", args: [] }
    ]);
  });

  it("getQuestById looks up the quest by id", async () => {
    const quest = { _id: "quest-3" };
    const findByIdMock = mock.method(
      Quest,
      "findById",
      async () => quest
    );

    const result = await questServices.getQuestById("quest-3");

    assert.deepEqual(result, quest);
    assert.deepEqual(findByIdMock.mock.calls[0].arguments, [
      "quest-3"
    ]);
  });

  it("updateQuest forwards the update payload", async () => {
    const updateMock = mock.method(
      Quest,
      "findByIdAndUpdate",
      async () => ({ _id: "quest-4", removed: false })
    );

    const result = await questServices.updateQuest("quest-4", {
      description: "Updated"
    });

    assert.deepEqual(result, {
      _id: "quest-4",
      removed: false
    });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "quest-4",
      { $set: { description: "Updated" } },
      { new: true }
    ]);
  });

  it("deleteQuest deletes by id", async () => {
    const deleteMock = mock.method(
      Quest,
      "findByIdAndDelete",
      async () => ({ _id: "quest-5" })
    );

    const result = await questServices.deleteQuest("quest-5");

    assert.deepEqual(result, { _id: "quest-5" });
    assert.deepEqual(deleteMock.mock.calls[0].arguments, [
      "quest-5"
    ]);
  });

  it("removeQuest marks the quest as removed", async () => {
    const updateMock = mock.method(
      Quest,
      "findByIdAndUpdate",
      async () => ({ removed: true })
    );

    const result = await questServices.removeQuest("quest-6");

    assert.deepEqual(result, { removed: true });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "quest-6",
      { removed: true },
      { new: true }
    ]);
  });

  it("unremoveQuest clears the removed flag", async () => {
    const updateMock = mock.method(
      Quest,
      "findByIdAndUpdate",
      async () => ({ removed: false })
    );

    const result = await questServices.unremoveQuest("quest-7");

    assert.deepEqual(result, { removed: false });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "quest-7",
      { removed: false },
      { new: true }
    ]);
  });

  it("addQuestFlag increments the flag count", async () => {
    const updateMock = mock.method(
      Quest,
      "findByIdAndUpdate",
      async () => ({ flag: 3 })
    );

    const result = await questServices.addQuestFlag("quest-8");

    assert.deepEqual(result, { flag: 3 });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "quest-8",
      { $inc: { flag: 1 } },
      { new: true }
    ]);
  });

  it("removeQuestFlag decrements the flag count", async () => {
    const updateMock = mock.method(
      Quest,
      "findByIdAndUpdate",
      async () => ({ flag: 1 })
    );

    const result = await questServices.removeQuestFlag(
      "quest-9"
    );

    assert.deepEqual(result, { flag: 1 });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "quest-9",
      { $inc: { flag: -1 } },
      { new: true }
    ]);
  });

  it("searchQuests builds filters for author, dates, flags, text, location, and pagination", async () => {
    const expectedQuests = [{ _id: "quest-10" }];
    const { builder, calls } = createQueryBuilder(
      expectedQuests,
      "exec"
    );
    const findMock = mock.method(Quest, "find", () => builder);

    const filters = {
      author: "khush",
      startDate: "2026-03-01",
      endDate: "2026-03-20",
      createdAfter: "2026-02-15T00:00:00.000Z",
      createdBefore: "2026-03-10T00:00:00.000Z",
      minFlags: 2,
      maxFlags: 5,
      removed: false,
      searchText: "cleanup",
      lat: 35,
      lng: -120,
      radius: 8,
      sortBy: "date",
      sortOrder: "desc",
      skip: 2,
      limit: 4
    };

    const result = await questServices.searchQuests(filters);
    const radiusInDegrees = 8 / 111;

    assert.deepEqual(result, expectedQuests);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        author: { $regex: "khush", $options: "i" },
        date: { $gte: "2026-03-01", $lte: "2026-03-20" },
        createdAt: {
          $gte: new Date(filters.createdAfter),
          $lte: new Date(filters.createdBefore)
        },
        flag: { $gte: 2, $lte: 5 },
        removed: false,
        description: { $regex: "cleanup", $options: "i" },
        "location.lat": {
          $gte: 35 - radiusInDegrees,
          $lte: 35 + radiusInDegrees
        },
        "location.lng": {
          $gte: -120 - radiusInDegrees,
          $lte: -120 + radiusInDegrees
        }
      }
    ]);
    assert.deepEqual(calls, [
      { method: "sort", args: [{ date: -1 }] },
      { method: "skip", args: [2] },
      { method: "limit", args: [4] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchQuests supports startDate-only with maxFlags-only filtering", async () => {
    const expectedQuests = [{ _id: "quest-13" }];
    const { builder, calls } = createQueryBuilder(
      expectedQuests,
      "exec"
    );
    const findMock = mock.method(Quest, "find", () => builder);

    const result = await questServices.searchQuests({
      startDate: "2026-04-01",
      maxFlags: 4
    });

    assert.deepEqual(result, expectedQuests);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        date: { $gte: "2026-04-01" },
        flag: { $lte: 4 }
      }
    ]);
    assert.deepEqual(calls, [
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchQuests supports endDate-only filtering", async () => {
    const expectedQuests = [{ _id: "quest-14" }];
    const { builder, calls } = createQueryBuilder(
      expectedQuests,
      "exec"
    );
    const findMock = mock.method(Quest, "find", () => builder);

    const result = await questServices.searchQuests({
      endDate: "2026-04-30"
    });

    assert.deepEqual(result, expectedQuests);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        date: { $lte: "2026-04-30" }
      }
    ]);
    assert.deepEqual(calls, [
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchQuests supports createdBefore-only filtering", async () => {
    const expectedQuests = [{ _id: "quest-15" }];
    const { builder, calls } = createQueryBuilder(
      expectedQuests,
      "exec"
    );
    const findMock = mock.method(Quest, "find", () => builder);

    const result = await questServices.searchQuests({
      createdBefore: "2026-04-15T00:00:00.000Z"
    });

    assert.deepEqual(result, expectedQuests);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        createdAt: { $lte: new Date("2026-04-15T00:00:00.000Z") }
      }
    ]);
    assert.deepEqual(calls, [
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchQuests does not apply location filter when radius is missing", async () => {
    const expectedQuests = [{ _id: "quest-16" }];
    const { builder, calls } = createQueryBuilder(
      expectedQuests,
      "exec"
    );
    const findMock = mock.method(Quest, "find", () => builder);

    const result = await questServices.searchQuests({
      lat: 35,
      lng: -120
    });

    assert.deepEqual(result, expectedQuests);
    assert.deepEqual(findMock.mock.calls[0].arguments, [{}]);
    assert.deepEqual(calls, [
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchQuests supports minFlags-only filtering", async () => {
    const expectedQuests = [{ _id: "quest-17" }];
    const { builder, calls } = createQueryBuilder(
      expectedQuests,
      "exec"
    );
    const findMock = mock.method(Quest, "find", () => builder);

    const result = await questServices.searchQuests({
      minFlags: 1
    });

    assert.deepEqual(result, expectedQuests);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        flag: { $gte: 1 }
      }
    ]);
    assert.deepEqual(calls, [
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchQuests supports ascending sort order", async () => {
    const expectedQuests = [{ _id: "quest-18" }];
    const { builder, calls } = createQueryBuilder(
      expectedQuests,
      "exec"
    );
    mock.method(Quest, "find", () => builder);

    const result = await questServices.searchQuests({
      sortBy: "date",
      sortOrder: "asc"
    });

    assert.deepEqual(result, expectedQuests);
    assert.deepEqual(calls, [
      { method: "sort", args: [{ date: 1 }] },
      { method: "exec", args: [] }
    ]);
  });

  it("getQuestStats returns totals, flagged, removed, and active counts", async () => {
    const countMock = mock.method(
      Quest,
      "countDocuments",
      async query => {
        if (!query) {
          return 20;
        }
        if (query.flag) {
          return 7;
        }
        return 6;
      }
    );

    const result = await questServices.getQuestStats();

    assert.deepEqual(result, {
      total: 20,
      flagged: 7,
      removed: 6,
      active: 14
    });
    assert.deepEqual(
      countMock.mock.calls.map(call => call.arguments),
      [[], [{ flag: { $gt: 0 } }], [{ removed: true }]]
    );
  });

  it("joinQuest adds a user to the RSVP list", async () => {
    const updateMock = mock.method(
      Quest,
      "findByIdAndUpdate",
      async () => ({ _id: "quest-11" })
    );

    const result = await questServices.joinQuest(
      "quest-11",
      "user-5"
    );

    assert.deepEqual(result, { _id: "quest-11" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "quest-11",
      { $addToSet: { rsvpList: "user-5" } },
      { new: true }
    ]);
  });

  it("unjoinQuest removes a user from the RSVP list", async () => {
    const updateMock = mock.method(
      Quest,
      "findByIdAndUpdate",
      async () => ({ _id: "quest-12" })
    );

    const result = await questServices.unjoinQuest(
      "quest-12",
      "user-5"
    );

    assert.deepEqual(result, { _id: "quest-12" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "quest-12",
      { $pull: { rsvpList: "user-5" } },
      { new: true }
    ]);
  });
});
