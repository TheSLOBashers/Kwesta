// __tests__/user.test.ts
import mockingoose from 'mockingoose';
import Event from '../models/event.js';
import eventServices from "../models/event-services.js";
import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";

describe('test mongoose Event model', () => {

    it("getEventsByAuthor looks up the event by author", async () => {

        const eventData = {
            _id: '69f193738d5ffe62197e307e',
            author: "507f1f77bcf86cd799439011",
            date: "2026-03-15",
            description: "Beach cleanup",
            flag: 0,
            location: { lat: 35.1, lng: -120.6 },
            removed: false,
            rsvpList: []
        };

        const findMockFunction = (query) => {
            if (query._conditions.author === "507f1f77bcf86cd799439011") {
                return eventData; // 
            }
            return null; //
        };

        mockingoose(Event).toReturn(findMockFunction, 'find');

        const result = await eventServices.getEventsByAuthor('507f1f77bcf86cd799439011');

        const obj = result.toObject();
        obj._id = obj._id.toString();
        obj.author = obj.author.toString();

        assert.deepStrictEqual(obj, eventData);

    });
    
        it("getEventStats aggregates totals and active count", async () => {
    
            const counterMockfunction = (query) => {
                if (query._conditions.removed === undefined && query._conditions.flag === undefined) {
                    return 12; // total events
                }
                if (query._conditions.flag) {
                    return 3; // flagged events
                }
                return 4; // removed events
            };
    
            const countMock = mockingoose(Event).toReturn(counterMockfunction, 'countDocuments');
    
            const result = await eventServices.getEventStats();
    
            assert.deepEqual(result, {
                total: 12,
                flagged: 3,
                removed: 4,
                active: 8
            });
        });
    
});