// __tests__/user.test.ts
import mockingoose from 'mockingoose';
import CommentSchema from '../models/comment.js';
import commentServices from "../models/comment-services.js";
import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";

describe('test mongoose Comment model', () => {
    it("createComment saves a new comment document", async () => {

        const expectedComment = {
            _id: '69f14388d44ebb600688f552',
            author: "507f1f77bcf86cd799439011",
            comment: "Test comment",
            date: '2026-04-28T23:32:24.902Z',
            flag: 0,
            likedBy: [],
            likes: 0,
            location: { lat: 35.3, lng: -120.7 },
            removed: false
        };

        mockingoose(CommentSchema).toReturn(expectedComment, 'save');

        const result = await commentServices.createComment(
            expectedComment
        );

        assert.deepStrictEqual(JSON.parse(JSON.stringify(result)), expectedComment);
    });

    it("getComments requests active comments with author usernames", async () => {

        const expectedComments = [{
            _id: '69f14388d44ebb600688f552',
            author: "507f1f77bcf86cd799439011",
            comment: "Test comment",
            date: '2026-04-28T23:32:24.902Z',
            flag: 0,
            likedBy: [],
            likes: 0,
            location: { lat: 35.3, lng: -120.7 },
            removed: false
        }];

        mockingoose(CommentSchema).toReturn(expectedComments, 'find');

        const result = await commentServices.getComments();

        assert.deepStrictEqual(JSON.parse(JSON.stringify(result)), expectedComments);
    });

    it("getCommentStats aggregates totals and active count", async () => {
        
        const counterMockfunction = (query) => {
                if (query._conditions.removed === undefined && query._conditions.flag === undefined) {
                    return 12; // total comments
                }
                if (query._conditions.flag) {
                    return 3; // flagged comments
                }
                return 4; // removed comments
            };

        const countMock = mockingoose(CommentSchema).toReturn(counterMockfunction, 'countDocuments');

        const result = await commentServices.getCommentStats();

        assert.deepEqual(result, {
            total: 12,
            flagged: 3,
            removed: 4,
            active: 8
        });
    });

});