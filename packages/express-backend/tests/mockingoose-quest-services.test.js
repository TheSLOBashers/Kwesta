// __tests__/user.test.ts
import mockingoose from 'mockingoose';
import Quest from '../models/quest.js';
import questServices from "../models/quest-services.js";
import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";

describe('test mongoose Quest model', () => {

    it("createQuest saves a new quest document", async () => {
        const questData = {
            _id: '69f193738d5ffe62197e307e',
            author: "507f1f77bcf86cd799439011",
            date: "2026-03-15",
            description: "Beach cleanup",
            flag: 0,
            location: { lat: 35.1, lng: -120.6 },
            points: 0,
            removed: false,
            rsvpList: []
        };

        mockingoose(Quest).toReturn(questData, 'save');

        const result = await questServices.createQuest(questData);

        const obj = result.toObject();
        obj._id = obj._id.toString();
        obj.author = obj.author.toString();

        assert.deepStrictEqual(obj, questData);
    });

    it("getQuestsByAuthor looks up the quest by author", async () => {

        const questData = {
            _id: '69f193738d5ffe62197e307e',
            author: "507f1f77bcf86cd799439011",
            date: "2026-03-15",
            description: "Beach cleanup",
            flag: 0,
            location: { lat: 35.1, lng: -120.6 },
            points: 0,
            removed: false,
            rsvpList: []
        };

        const findMockFunction = (query) => {
            if (query._conditions.author === "507f1f77bcf86cd799439011") {
                return questData; // 
            }
            return null; //
        };

        mockingoose(Quest).toReturn(findMockFunction, 'find');

        const result = await questServices.getQuestsByAuthor('507f1f77bcf86cd799439011');

        const obj = result.toObject();
        obj._id = obj._id.toString();
        obj.author = obj.author.toString();

        assert.deepStrictEqual(obj, questData);

    });

    it("getQuestStats aggregates totals and active count", async () => {

        const counterMockfunction = (query) => {
            if (query._conditions.removed === undefined && query._conditions.flag === undefined) {
                return 12; // total quests
            }
            if (query._conditions.flag) {
                return 3; // flagged quests
            }
            return 4; // removed quests
        };

        const countMock = mockingoose(Quest).toReturn(counterMockfunction, 'countDocuments');

        const result = await questServices.getQuestStats();

        assert.deepEqual(result, {
            total: 12,
            flagged: 3,
            removed: 4,
            active: 8
        });
    });

});