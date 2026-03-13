import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";

import Event from "../models/event.js";
import eventServices from "../models/event-services.js";
import { createQueryBuilder } from "./helpers/query-builder.js";

afterEach(() => {
  mock.restoreAll();
});

describe("event-services", () => {
  it("createEvent saves a new event document", async () => {
    const eventData = {
      author: "507f1f77bcf86cd799439011",
      date: "2026-03-20",
      time: "18:00",
      description: "Club meeting",
      location: { lat: 35.28, lng: -120.66 }
    };

    let savedEvent;

    mock.method(Event.prototype, "save", async function save() {
      savedEvent = {
        author: String(this.author),
        date: this.date,
        time: this.time,
        description: this.description,
        location: this.location.toObject()
      };

      return this;
    });

    mock.method(
      Event.prototype,
      "populate",
      async function populate() {
        return this;
      }
    );

    const result = await eventServices.createEvent(eventData);

    assert.deepEqual(savedEvent, eventData);
    assert.ok(result._id); // just verify an id exists
  });

  it("getEvents sorts events newest first", async () => {
    const expectedEvents = [{ _id: "event-2" }];

    const { builder, calls } = createQueryBuilder(
      expectedEvents,
      "lean"
    );

    const findMock = mock.method(Event, "find", () => builder);

    const result = await eventServices.getEvents();

    assert.deepEqual(result, expectedEvents);
    assert.deepEqual(findMock.mock.calls[0].arguments, []);
    assert.ok(
      calls.some(
        (c) =>
          c.method === "sort" &&
          JSON.stringify(c.args) ===
            JSON.stringify([{ createdAt: -1 }])
      )
    );
  });

  it("getEventById looks up the event by id", async () => {
    const event = { _id: "event-3" };
    const findByIdMock = mock.method(
      Event,
      "findById",
      async () => event
    );

    const result = await eventServices.getEventById("event-3");

    assert.deepEqual(result, event);
    assert.deepEqual(findByIdMock.mock.calls[0].arguments, [
      "event-3"
    ]);
  });

  it("updateEvent forwards updates with new:true", async () => {
    const updateMock = mock.method(
      Event,
      "findByIdAndUpdate",
      async () => ({ _id: "event-4" })
    );

    const result = await eventServices.updateEvent("event-4", {
      description: "Updated event"
    });

    assert.deepEqual(result, { _id: "event-4" });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "event-4",
      { description: "Updated event" },
      { new: true }
    ]);
  });

  it("deleteEvent deletes by id", async () => {
    const deleteMock = mock.method(
      Event,
      "findByIdAndDelete",
      async () => ({ _id: "event-5" })
    );

    const result = await eventServices.deleteEvent("event-5");

    assert.deepEqual(result, { _id: "event-5" });
    assert.deepEqual(deleteMock.mock.calls[0].arguments, [
      "event-5"
    ]);
  });

  it("removeEvent marks the event as removed", async () => {
    const updateMock = mock.method(
      Event,
      "findByIdAndUpdate",
      async () => ({ removed: true })
    );

    const result = await eventServices.removeEvent("event-6");

    assert.deepEqual(result, { removed: true });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "event-6",
      { removed: true },
      { new: true }
    ]);
  });

  it("unremoveEvent clears the removed flag", async () => {
    const updateMock = mock.method(
      Event,
      "findByIdAndUpdate",
      async () => ({ removed: false })
    );

    const result = await eventServices.unremoveEvent("event-7");

    assert.deepEqual(result, { removed: false });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "event-7",
      { removed: false },
      { new: true }
    ]);
  });

  it("addEventFlag increments the flag count", async () => {
    const updateMock = mock.method(
      Event,
      "findByIdAndUpdate",
      async () => ({ flag: 2 })
    );

    const result = await eventServices.addEventFlag("event-8");

    assert.deepEqual(result, { flag: 2 });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "event-8",
      { $inc: { flag: 1 } },
      { new: true }
    ]);
  });

  it("removeEventFlag decrements the flag count", async () => {
    const updateMock = mock.method(
      Event,
      "findByIdAndUpdate",
      async () => ({ flag: 1 })
    );

    const result =
      await eventServices.removeEventFlag("event-9");

    assert.deepEqual(result, { flag: 1 });
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      "event-9",
      { $inc: { flag: -1 } },
      { new: true }
    ]);
  });

  it("searchEvents builds filters for dates, text, rsvp count, and location", async () => {
    const expectedEvents = [{ _id: "event-10" }];
    const { builder, calls } = createQueryBuilder(
      expectedEvents,
      "exec"
    );
    const findMock = mock.method(Event, "find", () => builder);

    const filters = {
      author: "khush",
      startDate: "2026-03-01",
      endDate: "2026-03-25",
      createdAfter: "2026-02-20T00:00:00.000Z",
      createdBefore: "2026-03-09T00:00:00.000Z",
      minFlags: 0,
      maxFlags: 3,
      removed: false,
      searchText: "meeting",
      lat: 35,
      lng: -120,
      radius: 6,
      minRsvp: 2,
      maxRsvp: 20,
      sortBy: "rsvpCount",
      sortOrder: "asc",
      skip: 1,
      limit: 3
    };

    const result = await eventServices.searchEvents(filters);
    const radiusInDegrees = 6 / 111;

    assert.deepEqual(result, expectedEvents);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        author: { $regex: "khush", $options: "i" },
        date: { $gte: "2026-03-01", $lte: "2026-03-25" },
        createdAt: {
          $gte: new Date(filters.createdAfter),
          $lte: new Date(filters.createdBefore)
        },
        flag: { $gte: 0, $lte: 3 },
        removed: false,
        description: { $regex: "meeting", $options: "i" },
        rsvpCount: { $gte: 2, $lte: 20 },
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
      { method: "sort", args: [{ rsvpCount: 1 }] },
      { method: "skip", args: [1] },
      { method: "limit", args: [3] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchEvents supports startDate-only with max-only flag and RSVP filters", async () => {
    const expectedEvents = [{ _id: "event-11" }];
    const { builder, calls } = createQueryBuilder(
      expectedEvents,
      "exec"
    );
    const findMock = mock.method(Event, "find", () => builder);

    const result = await eventServices.searchEvents({
      startDate: "2026-04-01",
      maxFlags: 2,
      maxRsvp: 5
    });

    assert.deepEqual(result, expectedEvents);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        date: { $gte: "2026-04-01" },
        flag: { $lte: 2 },
        rsvpCount: { $lte: 5 }
      }
    ]);
    assert.deepEqual(calls, [
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchEvents supports endDate-only filtering", async () => {
    const expectedEvents = [{ _id: "event-12" }];
    const { builder, calls } = createQueryBuilder(
      expectedEvents,
      "exec"
    );
    const findMock = mock.method(Event, "find", () => builder);

    const result = await eventServices.searchEvents({
      endDate: "2026-04-30"
    });

    assert.deepEqual(result, expectedEvents);
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

  it("getEventStats returns totals, flagged, removed, and active counts", async () => {
    const countMock = mock.method(
      Event,
      "countDocuments",
      async (query) => {
        if (!query) {
          return 15;
        }
        if (query.flag) {
          return 4;
        }
        return 5;
      }
    );

    const result = await eventServices.getEventStats();

    assert.deepEqual(result, {
      total: 15,
      flagged: 4,
      removed: 5,
      active: 10
    });
    assert.deepEqual(
      countMock.mock.calls.map((call) => call.arguments),
      [[], [{ flag: { $gt: 0 } }], [{ removed: true }]]
    );
  });
});
