import getCommentsCall from "../src/APICalls/getCommentsCall";

global.fetch = jest.fn();

describe("getCommentsCall", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("returns formatted comments on successful fetch", async () => {
        const mockApiResponse = {
            comments: [
                {
                    _id: "1",
                    author: { username: "Alice" },
                    date: "2026-03-03T00:00:00Z",
                    comment: "Hello",
                    location: { lat:0, lng:0 },
                    flag: false,
                },
                {
                    _id: "2",
                    author: "Jim",
                    date: "2026-03-03T01:00:00Z",
                    comment: "Wassup",
                    location: { lat:1, lng:2 },
                    flag: true,
                },
            ],
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockApiResponse,
        });

        const comments = await getCommentsCall();

        expect(fetch).toHaveBeenCalledWith("http://localhost:8000/comments");
        expect(comments).toEqual([
            {
                id: "1",
                author: "Alice",
                date: "2026-03-03T00:00:00Z",
                comment: "Hello",
                location: { lat:0, lng:0 },
                flag: false,
            },
            {
                id: "2",
                author: "Jim",
                date: "2026-03-03T01:00:00Z",
                comment: "Wassup",
                location: { lat:1, lng:2 },
                flag: true,
            },
        ]);
    });

    test("returns empty array if fetch fails", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        const comments = await getCommentsCall();
        expect(comments).toEqual([]);
    });

    test("returns empty array if fetch throws error", async () => {
        fetch.mockResolvedValueOnce(new Error("Network error"));

        const comments = await getCommentsCall();
        expect(comments).toEqual([]);
    });
});