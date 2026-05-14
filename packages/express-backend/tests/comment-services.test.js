import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";

import Comment from "../models/comment.js";
import commentServices from "../models/comment-services.js";
import { createQueryBuilder } from "./helpers/query-builder.js";

afterEach(() => {
  mock.restoreAll();
});

describe("comment-services", () => {
  it("createComment saves a new comment document", async () => {
    const commentData = {
      author: "507f1f77bcf86cd799439011",
      comment: "Test comment",
      location: { lat: 35.3, lng: -120.7 }
    };
    let savedDocument;

    mock.method(
      Comment.prototype,
      "save",
      async function save() {
        savedDocument = {
          author: String(this.author),
          comment: this.comment,
          location: this.location.toObject()
        };

        return {
          _id: "comment-1",
          ...savedDocument
        };
      }
    );

    const result = await commentServices.createComment(
      commentData
    );

    assert.deepEqual(savedDocument, commentData);
    assert.equal(result._id, "comment-1");
  });

  it("getComments requests active comments with author usernames", async () => {
    const expectedComments = [{ _id: "comment-1" }];
    const { builder, calls } = createQueryBuilder(
      expectedComments,
      "lean"
    );
    const findMock = mock.method(
      Comment,
      "find",
      () => builder
    );

    const result = await commentServices.getComments();

    assert.deepEqual(result, expectedComments);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      { removed: false }
    ]);
    assert.deepEqual(calls, [
      { method: "populate", args: ["author", "username"] },
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "lean", args: [] }
    ]);
  });

  it("getCommentsByArea builds a location query from the given radius", async () => {
    const expectedComments = [{ _id: "comment-2" }];
    const { builder, calls } = createQueryBuilder(
      expectedComments,
      "lean"
    );
    const findMock = mock.method(
      Comment,
      "find",
      () => builder
    );

    const result = await commentServices.getCommentsByArea(
      35,
      -120,
      10
    );

    const radiusInDegrees = 10 / 111;

    assert.deepEqual(result, expectedComments);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        removed: false,
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
      { method: "populate", args: ["author", "username"] },
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "lean", args: [] }
    ]);
  });

  it("getCommentById populates the author username", async () => {
    const expectedComment = { _id: "comment-3" };
    const { builder, calls } = createQueryBuilder(
      expectedComment,
      "populate"
    );
    const findByIdMock = mock.method(
      Comment,
      "findById",
      () => builder
    );

    const result = await commentServices.getCommentById(
      "comment-3"
    );

    assert.deepEqual(result, expectedComment);
    assert.deepEqual(findByIdMock.mock.calls[0].arguments, [
      "comment-3"
    ]);
    assert.deepEqual(calls, [
      { method: "populate", args: ["author", "username"] }
    ]);
  });

  it("deleteComment deletes by id", async () => {
    const deletedComment = { _id: "comment-4" };
    const deleteMock = mock.method(
      Comment,
      "findByIdAndDelete",
      async () => deletedComment
    );

    const result = await commentServices.deleteComment(
      "comment-4"
    );

    assert.deepEqual(result, deletedComment);
    assert.deepEqual(deleteMock.mock.calls[0].arguments, [
      "comment-4"
    ]);
  });

  it("removeComment marks a comment as removed", async () => {
    mock.method(Comment, "findByIdAndUpdate", async () => ({
      removed: true
    }));

    const result = await commentServices.removeComment(
      "comment-5"
    );

    assert.deepEqual(result, { removed: true });
    assert.deepEqual(
      Comment.findByIdAndUpdate.mock.calls[0].arguments,
      ["comment-5", { removed: true }, { new: true }]
    );
  });

  it("unremoveComment clears the removed flag", async () => {
    mock.method(Comment, "findByIdAndUpdate", async () => ({
      removed: false
    }));

    const result = await commentServices.unremoveComment(
      "comment-6"
    );

    assert.deepEqual(result, { removed: false });
    assert.deepEqual(
      Comment.findByIdAndUpdate.mock.calls[0].arguments,
      ["comment-6", { removed: false }, { new: true }]
    );
  });

  it("addFlag increments the flag count", async () => {
    mock.method(Comment, "findByIdAndUpdate", async () => ({
      flag: 2
    }));

    const result = await commentServices.addFlag("comment-7");

    assert.deepEqual(result, { flag: 2 });
    assert.deepEqual(
      Comment.findByIdAndUpdate.mock.calls[0].arguments,
      ["comment-7", { $inc: { flag: 1 } }, { new: true }]
    );
  });

  it("removeFlag decrements the flag count", async () => {
    mock.method(Comment, "findByIdAndUpdate", async () => ({
      flag: 1
    }));

    const result = await commentServices.removeFlag(
      "comment-8"
    );

    assert.deepEqual(result, { flag: 1 });
    assert.deepEqual(
      Comment.findByIdAndUpdate.mock.calls[0].arguments,
      ["comment-8", { $inc: { flag: -1 } }, { new: true }]
    );
  });

  it("likeComment only likes once per user and populates the author", async () => {
    const updatedComment = { _id: "comment-9", likes: 1 };
    const { builder, calls } = createQueryBuilder(
      updatedComment,
      "populate"
    );
    const updateMock = mock.method(
      Comment,
      "findOneAndUpdate",
      () => builder
    );

    const result = await commentServices.likeComment(
      "comment-9",
      "user-2"
    );

    assert.deepEqual(result, updatedComment);
    assert.deepEqual(updateMock.mock.calls[0].arguments, [
      {
        _id: "comment-9",
        likedBy: { $ne: "user-2" }
      },
      {
        $addToSet: { likedBy: "user-2" },
        $inc: { likes: 1 }
      },
      { new: true }
    ]);
    assert.deepEqual(calls, [
      { method: "populate", args: ["author", "username"] }
    ]);
  });

  it("searchComments builds a filtered query with pagination and sorting", async () => {
    const expectedComments = [{ _id: "comment-10" }];
    const { builder, calls } = createQueryBuilder(
      expectedComments,
      "exec"
    );
    const findMock = mock.method(
      Comment,
      "find",
      () => builder
    );

    const filters = {
      author: "user-3",
      startDate: "2026-03-01T00:00:00.000Z",
      endDate: "2026-03-09T23:59:59.999Z",
      minFlags: 1,
      maxFlags: 4,
      removed: false,
      searchText: "cleanup",
      lat: 35,
      lng: -120,
      radius: 5,
      sortBy: "flag",
      sortOrder: "asc",
      skip: 10,
      limit: 5
    };

    const result = await commentServices.searchComments(
      filters
    );
    const radiusInDegrees = 5 / 111;

    assert.deepEqual(result, expectedComments);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        author: "user-3",
        createdAt: {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        },
        flag: { $gte: 1, $lte: 4 },
        removed: false,
        comment: { $regex: "cleanup", $options: "i" },
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
      { method: "populate", args: ["author", "username"] },
      { method: "sort", args: [{ flag: 1 }] },
      { method: "skip", args: [10] },
      { method: "limit", args: [5] },
      { method: "exec", args: [] }
    ]);
  });

  it("searchComments supports maxFlags-only filtering", async () => {
    const expectedComments = [{ _id: "comment-11" }];
    const { builder, calls } = createQueryBuilder(
      expectedComments,
      "exec"
    );
    const findMock = mock.method(
      Comment,
      "find",
      () => builder
    );

    const result = await commentServices.searchComments({
      maxFlags: 2
    });

    assert.deepEqual(result, expectedComments);
    assert.deepEqual(findMock.mock.calls[0].arguments, [
      {
        flag: { $lte: 2 }
      }
    ]);
    assert.deepEqual(calls, [
      { method: "populate", args: ["author", "username"] },
      { method: "sort", args: [{ createdAt: -1 }] },
      { method: "exec", args: [] }
    ]);
  });

  it("getCommentStats aggregates totals and active count", async () => {
    const countMock = mock.method(
      Comment,
      "countDocuments",
      async query => {
        if (!query) {
          return 12;
        }
        if (query.flag) {
          return 3;
        }
        return 4;
      }
    );

    const result = await commentServices.getCommentStats();

    assert.deepEqual(result, {
      total: 12,
      flagged: 3,
      removed: 4,
      active: 8
    });
    assert.deepEqual(
      countMock.mock.calls.map(call => call.arguments),
      [[], [{ flag: { $gt: 0 } }], [{ removed: true }]]
    );
  });
});
