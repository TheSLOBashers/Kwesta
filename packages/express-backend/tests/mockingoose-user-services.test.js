// __tests__/user.test.ts
import mockingoose from 'mockingoose';
import UserSchema from '../models/user.js';
import userServices from "../models/user-services.js";
import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";

describe('test mongoose User model', () => {

    it('getUserByUsername proxies to User.findOne', async () => {
        const expectedUser = { _id: "69f13a139615c947306ab614", badges: [], username: "ex-1", blockList: [], followers: [], following: [], devices: [], flagList: [], permissions: 'regular', points: 3, rankedPoints: 0 };

        mockingoose(UserSchema).toReturn(expectedUser, 'findOne');

        const result = await userServices.getUserByUsername(
            "khush"
        );

        assert.deepStrictEqual(JSON.parse(JSON.stringify(result)), expectedUser);
    });

    it("createNewUser hashes the password and saves when username and email are unique", async () => {
        mock.method(
            bcrypt,
            "hash",
            async password => `hashed:${password}`
        );

        const expectedUser = { _id: "69f13a139615c947306ab614", badges: [], username: "ex-2", email: "ex-2@example.com", password: "hashed:secret", blockList: [], followers: [], following: [], devices: [], flagList: [], permissions: 'regular', points: 3, rankedPoints: 0 };

        const finderMock = (query) => {
            if (
                (query.getQuery().email && query.getQuery().email !== 'ex-2@example.com') ||
                (query.getQuery().username && query.getQuery().username !== 'ex-2')
            ) {
                return expectedUser;
            }
            return null;
        };

        mockingoose(UserSchema).toReturn(finderMock, 'findOne');
        mockingoose(UserSchema).toReturn(expectedUser, 'save');

        const result = await userServices.createNewUser(
            "ex-2",
            "ex-2@example.com",
            "secret"
        );

        const obj = result.toObject();
        obj._id = obj._id.toString();

        assert.deepStrictEqual(obj, expectedUser);
    });

    it("createNewUser rejects duplicate usernames", async () => {
        mock.method(
            bcrypt,
            "hash",
            async password => `hashed:${password}`
        );

        const expectedUser = { _id: "69f13a139615c947306ab614", username: "ex-3", email: "ex-3@example.com", password: "hashed:secret", blockList: [], followers: [], following: [], devices: [], flagList: [], permissions: 'regular', points: 3, rankedPoints: 0 };

        const finderMock = (query) => {
            if (
                (query.getQuery().email && query.getQuery().email === 'ex-3@example.com') ||
                (query.getQuery().username && query.getQuery().username === 'ex-3')
            ) {
                return expectedUser;
            }
            return null;
        };

        mockingoose(UserSchema).toReturn(finderMock, 'findOne');
        mockingoose(UserSchema).toReturn(expectedUser, 'save');

        await assert.rejects(
            () =>
                userServices.createNewUser(
                    "ex-3",
                    "ex-3@example.com",
                    "secret"
                ),
            /Username already exists/
        );

    });

    it("authenticateUser returns the user when the password matches", async () => {

        const expectedUser = { _id: "69f13a139615c947306ab614", badges: [], username: "ex-4", email: "ex-4@example.com", password: "hashed:secret", blockList: [], followers: [], following: [], devices: [], flagList: [], permissions: 'regular', points: 3, rankedPoints: 0 };

        const finderMock = (query) => {
            if (
                (query.getQuery().email && query.getQuery().email === 'ex-4@example.com') ||
                (query.getQuery().username && query.getQuery().username === 'ex-4')
            ) {
                return expectedUser;
            }
            return null;
        };

        mockingoose(UserSchema).toReturn(finderMock, 'findOne');
        mock.method(bcrypt, "compare", async () => true);

        const result = await userServices.authenticateUser(
            "ex-4",
            "secret"
        );

        const obj = result.toObject();
        obj._id = obj._id.toString();

        assert.deepStrictEqual(obj, expectedUser);
    });

    it("authenticateUser rejects missing users", async () => {
        mockingoose(UserSchema).toReturn(null, 'findOne');

        await assert.rejects(
            () => userServices.authenticateUser("ghost", "secret"),
            /User not found/
        );
    });

    it("authenticateUser rejects invalid passwords", async () => {

        const expectedUser = { _id: "69f13a139615c947306ab614", username: "ex-4", email: "ex-4@example.com", password: "hashed:secret", blockList: [], followers: [], following: [], devices: [], flagList: [], permissions: 'regular', points: 3, };

        const finderMock = (query) => {
            if (
                (query.getQuery().email && query.getQuery().email === 'ex-4@example.com') ||
                (query.getQuery().username && query.getQuery().username === 'ex-4')
            ) {
                return expectedUser;
            }
            return null;
        };

        mockingoose(UserSchema).toReturn(finderMock, 'findOne');
        mock.method(bcrypt, "compare", async () => false);

        await assert.rejects(
            () => userServices.authenticateUser("ex-4", "wrong"),
            /Invalid password/
        );
    });

    it("authenticateUser rejects banned users when permissions are banned", async () => {

        const expectedUser = { _id: "69f13a139615c947306ab614", username: "ex-4", email: "ex-4@example.com", password: "hashed:secret", blockList: [], followers: [], following: [], devices: [], flagList: [], permissions: 'banned', points: 3, rankedPoints: 0 };

        const finderMock = (query) => {
            if (
                (query.getQuery().email && query.getQuery().email === 'ex-4@example.com') ||
                (query.getQuery().username && query.getQuery().username === 'ex-4')
            ) {
                return expectedUser;
            }
            return null;
        };

        mockingoose(UserSchema).toReturn(finderMock, 'findOne');
        mock.method(bcrypt, "compare", async () => true);

        await assert.rejects(
            () => userServices.authenticateUser("ex-4", "secret"),
            /Banned/
        );
    });

});
